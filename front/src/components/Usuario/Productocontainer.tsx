import React, { useState, useEffect } from "react";
import './ProductListContainer.css';


interface ProductoType {
    codigo: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
}

const ProductListContainer: React.FC = () => {
    const [productos, setProductos] = useState<ProductoType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState<ProductoType>({ codigo: 0, nombre: "", descripcion: "", cantidad: 0 });
    const [editingProduct, setEditingProduct] = useState<ProductoType | null>(null);

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
        if (!newProduct.nombre || !newProduct.descripcion || newProduct.cantidad <= 0) {
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
            setNewProduct({ codigo: 0, nombre: "", descripcion: "", cantidad: 0 });
        } catch (error: any) {
            setError(error.message);
        }
    };

    const updateProducto = async (codigo: number) => {
        if (!editingProduct) return;
        try {
            const response = await fetch(`/api/producto/${codigo}`, {
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

    const deleteProducto = async (codigo: number) => {
        try {
            const response = await fetch(`/api/producto/${codigo}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar el producto");
            setProductos(productos.filter((producto) => producto.codigo !== codigo));
        } catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProductoType) => {
        const value = field === "cantidad" || field === "codigo" ? Number(e.target.value) : e.target.value;
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, [field]: value });
        } else {
            setNewProduct({ ...newProduct, [field]: value });
        }
    };

    return (
        <div>
            <h1>Lista de Productos</h1>
            {loading ? (
                <p>Cargando productos...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <ul>
                    {productos.map((producto) => (
                        <li key={producto.codigo}>
                            <strong>{producto.nombre}</strong> - {producto.descripcion} - Cantidad: {producto.cantidad}
                            <button onClick={() => setEditingProduct(producto)}>Editar</button>
                            <button onClick={() => deleteProducto(producto.codigo)}>Eliminar</button>
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
            <button onClick={editingProduct ? () => updateProducto(editingProduct.codigo) : createProducto}>
                {editingProduct ? "Actualizar" : "Agregar"}
            </button>
        </div>
    );
};

export default ProductListContainer;
