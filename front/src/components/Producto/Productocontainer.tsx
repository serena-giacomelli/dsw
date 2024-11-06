import React, { useState, useEffect } from "react";
import '../../styles/productContainer.css';

interface ProductoType {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
    id_tipo_producto: number; 
}

const ProductListContainer: React.FC = () => {
    const [productos, setProductos] = useState<ProductoType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState<ProductoType>({ id: 0, nombre: "", descripcion: "", cantidad: 0, id_tipo_producto: 0 });
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


    const createProducto = async () => {
        if (!newProduct.nombre || !newProduct.descripcion || newProduct.cantidad <= 0 || newProduct.id_tipo_producto <= 0) {
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
            const data: ProductoType = await response.json();
            setProductos([...productos, data]);
            setNewProduct({ id: 0, nombre: "", descripcion: "", cantidad: 0, id_tipo_producto: 0 });
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
            setProductos(productos.filter((producto) => producto.id !== id));
        } catch (error: any) {
            setError(error.message);
        }
    };
    
     // Funciones de filtrado
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

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProductoType) => {
        const value = field === "cantidad" || field === "id" || field === "id_tipo_producto" ? Number(e.target.value) : e.target.value;
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, [field]: value });
        } else {
            setNewProduct({ ...newProduct, [field]: value });
        }
    };
    console.log(productos,"este es el producto")
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

        {loading ? (
            <p>Cargando productos...</p>
        ) : error ? (
            <p>Error: {error}</p>
        ) : (
            <ul>
                {productos.map((producto) => (
                    <li key={producto.id}>
                        <strong>{producto.nombre}</strong> - {producto.descripcion} - Cantidad: {producto.cantidad} - Tipo Producto ID: {producto.id_tipo_producto}
                        <button onClick={() => setEditingProduct(producto)}>Editar</button>
                        <button onClick={() => deleteProducto(producto.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        )}

        <h2>{editingProduct ? "Editar Producto" : "Agregar Producto"}</h2>
        <input
            type="text"
            placeholder="Nombre"
            value={editingProduct ? editingProduct.nombre : newProduct.nombre}
            onChange={(e) => handleInputChange(e, "nombre")}
        />
        <input
            type="text"
            placeholder="Descripción"
            value={editingProduct ? editingProduct.descripcion : newProduct.descripcion}
            onChange={(e) => handleInputChange(e, "descripcion")}
        />
        <input
            type="number"
            placeholder="Cantidad"
            value={editingProduct ? editingProduct.cantidad : newProduct.cantidad}
            onChange={(e) => handleInputChange(e, "cantidad")}
        />
        <input
            type="number"
            placeholder="ID Tipo Producto"
            value={editingProduct ? editingProduct.id_tipo_producto : newProduct.id_tipo_producto}
            onChange={(e) => handleInputChange(e, "id_tipo_producto")}
        />
        <button onClick={editingProduct ? () => updateProducto(editingProduct.id) : createProducto}>
            {editingProduct ? "Actualizar" : "Agregar"}
        </button>
    </div>
);
};

       
export default ProductListContainer;