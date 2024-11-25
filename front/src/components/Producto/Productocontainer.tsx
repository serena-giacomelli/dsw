import React, { useState, useEffect } from "react";
import '../../styles/productContainer.css';
import { useLocation } from "react-router-dom";

interface ProductoType {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
    id_tipo_producto: number;
    precio: number;
    precio_oferta: number;
}

const ProductListContainer: React.FC = () => {
    const [productos, setProductos] = useState<ProductoType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState<ProductoType>({ id: 0, nombre: "", descripcion: "", cantidad: 0, id_tipo_producto: 0, precio: 0, precio_oferta: 0 });
    const [editingProduct, setEditingProduct] = useState<ProductoType | null>(null);
    const [cantidadFiltro, setCantidadFiltro] = useState<number | "">("");
    const [tipoProductoFiltro, setTipoProductoFiltro] = useState<number | "">("");
    const [descuento, setDescuento] = useState<{ [id: number]: number }>({});
    const location = useLocation();
        

    const fetchProductos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/producto");
            if (!response.ok) throw new Error("Error al cargar productos");
            const data: ProductoType[] = await response.json();
            setProductos(data);
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
            const response = await fetch(`/api/producto/cantidad/${cantidadFiltro}`);
            if (!response.ok) throw new Error("No se encontraron productos con el stock especificado");
            const data: ProductoType[] = await response.json();
            setProductos(data);
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
            const response = await fetch(`/api/producto/categoria/${tipoProductoFiltro}`);
            if (!response.ok) throw new Error("No se encontraron productos para el tipo de producto especificado");
            const data: ProductoType[] = await response.json();
            setProductos(data);
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
            const response = await fetch(`/api/producto/${id}`, {
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
            const response = await fetch(`/api/producto/${id}/eliminar-oferta`, {
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
        if (!newProduct.nombre || !newProduct.descripcion || newProduct.cantidad <= 0 || newProduct.id_tipo_producto <= 0 || newProduct.precio <= 0) {
            alert("Por favor, completa todos los campos del nuevo producto.");
            return;
        }
        try {
            const response = await fetch("/api/producto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) throw new Error("Error al crear el producto");

            fetchProductos();
            setNewProduct({ id: 0, nombre: "", descripcion: "", cantidad: 0, id_tipo_producto: 0, precio: 0, precio_oferta: 0 });
        } catch (error: any) {
            setError(error.message);
        }
    };

    const updateProducto = async (id: number) => {
        if (!editingProduct) return;
        try {
            const response = await fetch(`/api/producto/${id}`, {
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
            const response = await fetch(`/api/producto/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el producto");
            setProductos(prevProductos => prevProductos.filter(producto => producto.id !== id));
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <div className="product-list-container">
            <h1>Lista de Productos</h1>
    
            <div className="filters">
                <h3>Filtrar productos</h3>
                <div>
                    <label>Cantidad mínima de stock:</label>
                    <input
                        type="number"
                        value={cantidadFiltro}
                        onChange={(e) => setCantidadFiltro(Number(e.target.value))}
                    />
                    <button onClick={fetchProductosPorStock}>Buscar por stock</button>
                </div>
                <div>
                    <label>ID de tipo de producto:</label>
                    <input
                        type="number"
                        value={tipoProductoFiltro}
                        onChange={(e) => setTipoProductoFiltro(Number(e.target.value))}
                    />
                    <button onClick={fetchProductosPorTipo}>Buscar por tipo de producto</button>
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
    
            {loading ? (
                <p>Cargando productos...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <ul>
                    {productos.map((producto) => (
                        <li key={producto.id}>
                            <h3>{producto.nombre}</h3>
                            <p>{producto.descripcion}</p>
                            <p>Cantidad: {producto.cantidad}</p>
                            <p>
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
                            <div>
                                <input
                                    type="number"
                                    placeholder="% descuento"
                                    value={descuento[producto.id] || ""}
                                    onChange={(e) =>
                                        setDescuento({ ...descuento, [producto.id]: Number(e.target.value) })
                                    }
                                    style={{ width: "120px", marginRight: "8px" }}
                                />
                                <button onClick={() => handleOferta(producto.id)}>Poner en oferta</button>
                            </div>
                            {producto.precio_oferta > 0 && (
                                <button onClick={() => handleDeleteOferta(producto.id)}>
                                    Sacar de oferta
                                </button>
                            )}
                            <button onClick={() => setEditingProduct(producto)}>Editar</button>
                            <button onClick={() => deleteProducto(producto.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>

                
            )}
    
        <div className="new-product-form">
                    <h2>{editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            type="text"
                            placeholder="Nombre"
                            value={editingProduct ? editingProduct.nombre : newProduct.nombre}
                            onChange={(e) =>
                                editingProduct
                                    ? setEditingProduct({ ...editingProduct, nombre: e.target.value })
                                    : setNewProduct({ ...newProduct, nombre: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <input
                            id="descripcion"
                            type="text"
                            placeholder="Descripción"
                            value={editingProduct ? editingProduct.descripcion : newProduct.descripcion}
                            onChange={(e) =>
                                editingProduct
                                    ? setEditingProduct({ ...editingProduct, descripcion: e.target.value })
                                    : setNewProduct({ ...newProduct, descripcion: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="tipo">Tipo de producto</label>
                        <input
                            id="tipo"
                            type="number"
                            placeholder="Tipo de producto"
                            value={editingProduct ? editingProduct.id_tipo_producto : newProduct.id_tipo_producto}
                            onChange={(e) =>
                                editingProduct
                                    ? setEditingProduct({ ...editingProduct, id_tipo_producto: Number(e.target.value) })
                                    : setNewProduct({ ...newProduct, id_tipo_producto: Number(e.target.value) })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="precio">Precio</label>
                        <input
                            id="precio"
                            type="number"
                            placeholder="Precio"
                            value={editingProduct ? editingProduct.precio : newProduct.precio}
                            onChange={(e) =>
                                editingProduct
                                    ? setEditingProduct({ ...editingProduct, precio: Number(e.target.value) })
                                    : setNewProduct({ ...newProduct, precio: Number(e.target.value) })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cantidad">Cantidad</label>
                        <input
                            id="cantidad"
                            type="number"
                            placeholder="Cantidad"
                            value={editingProduct ? editingProduct.cantidad : newProduct.cantidad}
                            onChange={(e) =>
                                editingProduct
                                    ? setEditingProduct({ ...editingProduct, cantidad: Number(e.target.value) })
                                    : setNewProduct({ ...newProduct, cantidad: Number(e.target.value) })
                            }
                        />
                    </div>
                    <button
                        onClick={
                            editingProduct ? () => updateProducto(editingProduct.id) : createProducto
                        }
                    >
                        {editingProduct ? "Guardar cambios" : "Crear producto"}
                    </button>
                </div>
        </div>
    );
};

export default ProductListContainer;
