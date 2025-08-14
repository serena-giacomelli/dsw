import React, { useState, useEffect } from "react";
import '../../styles/Usuario/productContainer.css';
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../Estructura/modal.tsx";

interface ProductoType {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
    tipo: number;
    precio: number;
    precio_oferta: number;
    imagen: string;
}

const Productocontainer: React.FC = () => {
    const [productos, setProductos] = useState<ProductoType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState<ProductoType>({ id: 0, nombre: "", descripcion: "", cantidad: 0, tipo: 0, precio: 0, precio_oferta: 0, imagen: "" });
    const [editingProduct, setEditingProduct] = useState<ProductoType | null>(null);
    const [cantidadFiltro, setCantidadFiltro] = useState<number | "">("");
    const [tipoProductoFiltro, setTipoProductoFiltro] = useState<number | "">("");
    const [descuento, setDescuento] = useState<{ [id: number]: number }>({});
    const [orden, setOrden] = useState<'asc-nombre' | 'desc-nombre' | 'asc-precio' | 'desc-precio'>('asc-nombre');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState<ProductoType | null>(null);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    
    const fetchProductos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://dswback.onrender.com/api/producto");
            if (!response.ok) throw new Error("Error al cargar productos");
            const data = await response.json();
            setProductos(data.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductosPorStock = async () => {
        if (cantidadFiltro === "") return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://dswback.onrender.com/api/producto/cantidad/${cantidadFiltro}`);
            if (!response.ok) throw new Error("No se encontraron productos con el stock especificado");
            const data = await response.json();
            setProductos(data.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductosPorTipo = async () => {
        if (tipoProductoFiltro === "") return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://dswback.onrender.com/api/producto/categoria/${tipoProductoFiltro}`);
            if (!response.ok) throw new Error("No se encontraron productos para el tipo de producto especificado");
            const data = await response.json();
            setProductos(data.data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOferta = async (id: number) => {
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        const descuentoAplicado = descuento[id] || 0; 
        if (descuentoAplicado <= 0 || descuentoAplicado > 100) {
            alert("Por favor, ingresa un porcentaje de descuento válido (entre 1 y 100).");
            return;
        }

        const nuevoPrecio = producto.precio * (1 - descuentoAplicado / 100); 
        const productoConOferta = { ...producto, precio_oferta: nuevoPrecio };

        try {
            const response = await fetch(`https://dswback.onrender.com/api/producto/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productoConOferta),
            });
            if (!response.ok) throw new Error("Error al poner el producto en oferta");
            fetchProductos();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleDeleteOferta = async (id: number) => {
        try {
            const response = await fetch(`https://dswback.onrender.com/api/producto/${id}/eliminar-oferta`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ precio_oferta: null }),
            });

            if (!response.ok) throw new Error("Error al sacar el producto de oferta");
            fetchProductos();
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const createProducto = async () => {
        if (!newProduct.nombre || !newProduct.descripcion || newProduct.cantidad <= 0 || newProduct.tipo <= 0 || newProduct.precio <= 0) {
            alert("Por favor, completa todos los campos del nuevo producto.");
            return;
        }
        try {
            const response = await fetch("https://dswback.onrender.com/api/producto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el producto");
            }

            fetchProductos();
            setNewProduct({ id: 0, nombre: "", descripcion: "", cantidad: 0, tipo: 0, precio: 0, precio_oferta: 0, imagen: "" });
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, [location]);


    const updateProducto = async (id: number) => {
        if (!editingProduct) return;
        try {
            const response = await fetch(`https://dswback.onrender.com/api/producto/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingProduct),
            });
            if (!response.ok) throw new Error("Error al actualizar el producto");
            fetchProductos();
            setEditingProduct(null);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const deleteProducto = async (id: number | undefined) => {
        if (id === undefined) {
            console.error("El código del producto es indefinido.");
            return;
        }
        try {
            const response = await fetch(`https://dswback.onrender.com/api/producto/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el producto");
            setProductos(prevProductos => prevProductos.filter(producto => producto.id !== id));
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const productosOrdenados = [...productos];
    
        switch (orden) {
          case 'asc-nombre':
            productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
          case 'desc-nombre':
            productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
            break;
          case 'asc-precio':
            productosOrdenados.sort((a, b) => a.precio - b.precio);
            break;
          case 'desc-precio':
            productosOrdenados.sort((a, b) => b.precio - a.precio);
            break;
        }
    
        setProductos(productosOrdenados);
      }, [orden]);


    return (
        <div className="product-list-container">
            <div className="filters" style={{ marginBottom: "1rem" }}>
            <h3        
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                style={{
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
                marginBottom: "10px",
                textTransform: "uppercase",
                }}>
                {mostrarFiltros ? "−" : "+"} Filtros
            </h3>
            
                {mostrarFiltros && (
                    <div style={{ paddingLeft: "10px" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Ordenar por:</label>
                        <select
                        value={orden}
                        onChange={(e) => setOrden(e.target.value as any)}
                        style={{ marginLeft: "10px" }}
                        >
                        <option value="asc-nombre">Nombre A-Z</option>
                        <option value="desc-nombre">Nombre Z-A</option>
                        <option value="asc-precio">Precio: menor a mayor</option>
                        <option value="desc-precio">Precio: mayor a menor</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>Cantidad mínima de stock:</label>
                        <input
                        type="number"
                        value={cantidadFiltro}
                        onChange={(e) => setCantidadFiltro(Number(e.target.value))}
                        style={{ marginLeft: "10px" }}
                        />
                        <button
                        onClick={fetchProductosPorStock}
                        style={{ display: "block", marginTop: "5px" }}
                        >
                        Buscar por stock
                        </button>
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>ID de tipo de producto:</label>
                        <input
                        type="number"
                        value={tipoProductoFiltro}
                        onChange={(e) => setTipoProductoFiltro(Number(e.target.value))}
                        style={{ marginLeft: "10px" }}
                        />
                        <button
                        onClick={fetchProductosPorTipo}
                        style={{ display: "block", marginTop: "5px" }}
                        >
                        Buscar por tipo de producto
                        </button>
                    </div>

                    <button
                        onClick={() => {
                        fetchProductos();
                        setCantidadFiltro("");
                        setTipoProductoFiltro("");
                        }}
                    >
                        Mostrar todos los productos
                    </button>
                    </div>
                )}
  
            </div>
            <button onClick={() => setIsModalOpen(true)}style={{ marginTop: "5px", marginBottom: "5px" }}>Crear nuevo producto</button>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="new-product-form">
                <h2>Agregar Nuevo Producto</h2>
                
                <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                    id="nombre"
                    type="text"
                    value={newProduct.nombre}
                    onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                />
                </div>

                <div className="form-group">
                    <label htmlFor="imagen">Imagen del producto</label>
                    <input
                        id="imagen"
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("upload_preset", "muebles");

                        try {
                            const response = await fetch("https:/https://dswback.onrender.com/api.cloudinary.com/v1_1/dsbcv1htw/image/upload", {
                            method: "POST",
                            body: formData,
                            });
                            const data = await response.json();

                            setNewProduct({ ...newProduct, imagen: data.secure_url });
                        } catch (err) {
                            alert("Error al subir la imagen.");
                            console.error(err);
                        }
                        }}
                    />
                    {newProduct.imagen && (
                        <div style={{ marginTop: '10px' }}>
                        <img src={newProduct.imagen} alt="Vista previa" width="100" />
                        </div>
                    )}
                    </div>


                <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <input
                    id="descripcion"
                    type="text"
                    value={newProduct.descripcion}
                    onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                />
                </div>
                <div className="form-group">
                <label htmlFor="tipo">Tipo</label>
                <input
                    id="tipo"
                    type="number"
                    value={newProduct.tipo}
                    onChange={(e) => setNewProduct({ ...newProduct, tipo: Number(e.target.value) })}
                />
                </div>
                <div className="form-group">
                <label htmlFor="precio">Precio</label>
                <input
                    id="precio"
                    type="number"
                    value={newProduct.precio}
                    onChange={(e) => setNewProduct({ ...newProduct, precio: Number(e.target.value) })}
                />
                </div>
                <div className="form-group">
                <label htmlFor="cantidad">Cantidad</label>
                <input
                    id="cantidad"
                    type="number"
                    value={newProduct.cantidad}
                    onChange={(e) => setNewProduct({ ...newProduct, cantidad: Number(e.target.value) })}
                />
                </div>
                <button
                onClick={async () => {
                    await createProducto();
                    setIsModalOpen(false);
                }}
                >
                Crear Producto
                </button>
            </div>
            </Modal>

            {loading ? (
                <p>Cargando productos...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (

                <ul
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                    listStyle: "none",
                    padding: 0,
                }}>
                {productos.map((producto) => (
                    <li key={producto.id}
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "0px",
                        padding: "15px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        backgroundColor: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                      >
                        {/* Imagen del producto */}
                        {producto.imagen && (
                            <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            style={{
                                width: "300px",
                                height: "300px",
                                objectFit: "cover",
                                borderRadius: "0px",
                                marginBottom: "10px",
                              }}
                            />
                        )}
                        {/* Información del producto */}
                        <h3 
                            onClick={() => navigate(`/producto/${producto.id}`)}
                            style={{ 
                                cursor: "pointer", 
                                color: "#000",
                                textDecoration: "none",
                                transition: "text-decoration 0.2s"
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLHeadingElement).style.textDecoration = "underline")}
                            onMouseLeave={(e) => ((e.target as HTMLHeadingElement).style.textDecoration = "none")}
                        >
                            {producto.nombre}
                        </h3>
                        <p style={{ marginBottom: "2px" }}>
                            Precio:
                            {producto.precio_oferta > 0 ? (
                                <>
                                    <span style={{ textDecoration: "line-through", marginRight: "8px" }}>
                                        ${producto.precio}
                                    </span>
                                    <span className="precio-descuento">${producto.precio_oferta}</span>
                                </>
                            ) : (
                                `$${producto.precio}`
                            )}
                        </p>
                        <div style={{ marginTop: "10px" }}>
                            <input
                                type="number"
                                placeholder="% descuento"
                                value={descuento[producto.id] || ""}
                                onChange={(e) =>
                                    setDescuento({ ...descuento, [producto.id]: Number(e.target.value) })
                                }
                                style={{ width: "120px", marginRight: "8px" }}
                            />
                            <button onClick={() => handleOferta(producto.id)}>Ofertar</button>
                        </div>
                        {producto.precio_oferta > 0 && (
                            <button onClick={() => handleDeleteOferta(producto.id)}>
                                Sacar de oferta
                            </button>
                        )}
                        <button onClick={() => setEditingProduct(producto)}style={{ marginTop: "5px" }}>Editar</button>
                        <button onClick={() => setProductoAEliminar(producto)} style={{ marginTop: "5px" }}>Eliminar</button>
                        
                        <Modal isOpen={!!productoAEliminar} onClose={() => setProductoAEliminar(null)}>
                        <h2>Confirmar Eliminación</h2>
                        <p>¿Estás segura/o de que querés eliminar el producto <strong>{productoAEliminar?.nombre}</strong>?</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                            style={{ backgroundColor: "blue", color: "white" }}
                            onClick={() => {
                                if (productoAEliminar) {
                                deleteProducto(productoAEliminar.id);
                                setProductoAEliminar(null);
                                }
                            }}
                            >
                            Sí, eliminar
                            </button>
                            <button onClick={() => setProductoAEliminar(null)}>Cancelar</button>
                        </div>
                        </Modal>
                    </li>
                ))}
            </ul>
            )}
    
                <Modal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
            <div className="new-product-form">
                <h2>Editar Producto</h2>

                <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                    id="nombre"
                    type="text"
                    placeholder="Nombre"
                    value={editingProduct?.nombre ?? ""}
                    onChange={(e) =>
                    setEditingProduct({ ...editingProduct!, nombre: e.target.value })
                    }
                />
                </div>

                <div className="form-group">
                <label htmlFor="imagen">Imagen del producto</label>
                <input
                    id="imagen"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", "muebles");

                    try {
                        const response = await fetch("https:/https://dswback.onrender.com/api.cloudinary.com/v1_1/dsbcv1htw/image/upload", {
                        method: "POST",
                        body: formData,
                        });
                        const data = await response.json();

                        setEditingProduct({
                        ...editingProduct!,
                        imagen: data.secure_url,
                        });
                    } catch (err) {
                        alert("Error al subir la imagen.");
                        console.error(err);
                    }
                    }}
                />
                {editingProduct?.imagen && (
                    <div style={{ marginTop: '10px' }}>
                    <img src={editingProduct.imagen} alt="Vista previa" width="100" />
                    </div>
                )}
                </div>

                <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <input
                    id="descripcion"
                    type="text"
                    placeholder="Descripción"
                    value={editingProduct?.descripcion ?? ""}
                    onChange={(e) =>
                    setEditingProduct({ ...editingProduct!, descripcion: e.target.value })
                    }
                />
                </div>

                <div className="form-group">
                <label htmlFor="tipo">Tipo de producto</label>
                <input
                    id="tipo"
                    type="number"
                    placeholder="Tipo de producto"
                    value={editingProduct?.tipo ?? 0}
                    onChange={(e) =>
                    setEditingProduct({ ...editingProduct!, tipo: Number(e.target.value) })
                    }
                />
                </div>

                <div className="form-group">
                <label htmlFor="precio">Precio</label>
                <input
                    id="precio"
                    type="number"
                    placeholder="Precio"
                    value={editingProduct?.precio ?? 0}
                    onChange={(e) =>
                    setEditingProduct({ ...editingProduct!, precio: Number(e.target.value) })
                    }
                />
                </div>

                <div className="form-group">
                <label htmlFor="cantidad">Cantidad</label>
                <input
                    id="cantidad"
                    type="number"
                    placeholder="Cantidad"
                    value={editingProduct?.cantidad ?? 0}
                    onChange={(e) =>
                    setEditingProduct({ ...editingProduct!, cantidad: Number(e.target.value) })
                    }
                />
                </div>


                <button onClick={() => updateProducto(editingProduct!.id)}>
                Guardar cambios
                </button>
            </div>
            </Modal>
        </div>
        
    );
};



export default Productocontainer;

