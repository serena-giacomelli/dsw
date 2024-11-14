import React, { useState, useEffect } from "react";
import '../../styles/productContainer.css';

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

        const nuevoPrecio = producto.precio * 0.7; // Baja el precio en un 30%
        // Actualiza el producto con el nuevo precio
        const productoConOferta = { ...producto, precio_oferta: nuevoPrecio };

        try {
            const response = await fetch(`/api/producto/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productoConOferta),
            });
            if (!response.ok) throw new Error("Error al poner el producto en oferta");

            // Después de actualizar el precio, actualiza la lista de productos
            fetchProductos();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleDeleteOferta = async (id: number) => {
        try {
            // Llamada para actualizar el producto y quitar el precio_oferta
            const response = await fetch(`/api/producto/${id}/eliminar-oferta`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ precio_oferta: null }), // Enviar el valor null para eliminar el precio_oferta
            });

            if (!response.ok) throw new Error("Error al sacar el producto de oferta");

            // Después de eliminar el precio_oferta, actualiza la lista de productos
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
            // Llamada para crear el producto
            const response = await fetch("/api/producto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) throw new Error("Error al crear el producto");

            // Obtener la respuesta con el ID del producto creado (se asume que devuelves solo el ID)
            const insertId: number = await response.json();

            // Después de crear el producto, actualiza la lista de productos
            fetchProductos();

            // Resetear el formulario del nuevo producto
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
            // Aquí, eliminamos el producto localmente después de borrarlo en el servidor
            setProductos(prevProductos => prevProductos.filter(producto => producto.id !== id));
        } catch (error: any) {
            setError(error.message);
        }
    };


    return (
        <div className="product-list-container">
            <h1>Lista de Productos</h1>

            {/* Filtros */}
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
            </div>
            {loading ? <p>Cargando productos...</p> : error ? <p className="error">{error}</p> : (
                <ul>
                    {productos.map(producto => (
                        <li key={producto.id}>
                            <h3>{producto.nombre}</h3>
                            <p>{producto.descripcion}</p>
                            <p>Cantidad: {producto.cantidad}</p>
                            <p>
                                Precio: ${producto.precio_oferta ? (
                                    <>
                                        <span style={{ textDecoration: 'line-through' }}>${producto.precio}</span>
                                        ${producto.precio_oferta}
                                    </>
                                ) : (
                                    producto.precio
                                )}
                            </p>
                            <button onClick={() => setEditingProduct(producto)}>Editar</button>
                            <button onClick={() => deleteProducto(producto.id)}>Eliminar</button>
                            <button onClick={() => handleOferta(producto.id)}>Poner en oferta</button>
                            {producto.precio_oferta && (
                                <button onClick={() => handleDeleteOferta(producto.id)}>Sacar de oferta</button>
                            )}
                        </li>
                    ))}
                </ul>

            )}
            <div className="new-product-form">
                <h2>Agregar Nuevo Producto</h2>
                <input type="text" placeholder="Nombre" value={newProduct.nombre} onChange={e => setNewProduct({ ...newProduct, nombre: e.target.value })} />
                <input type="text" placeholder="Descripción" value={newProduct.descripcion} onChange={e => setNewProduct({ ...newProduct, descripcion: e.target.value })} />
                <input type="number" placeholder="Cantidad" value={newProduct.cantidad} onChange={e => setNewProduct({ ...newProduct, cantidad: Number(e.target.value) })} />
                <input type="number" placeholder="Tipo de Producto" value={newProduct.id_tipo_producto} onChange={e => setNewProduct({ ...newProduct, id_tipo_producto: Number(e.target.value) })} />
                <input type="number" placeholder="Precio" value={newProduct.precio} onChange={e => setNewProduct({ ...newProduct, precio: Number(e.target.value) })} />
                <button onClick={createProducto}>Agregar Producto</button>
            </div>
        </div>
    );
};

export default ProductListContainer;
