import React, { useState, useEffect } from "react";


interface Producto {
    codigo: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
}

const ItemListContainer = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Función para traer los productos desde el back
    const fetchProductos = async () => {
        try {
            const response = await fetch("/api/producto");
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error("Error al traer los productos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos(); // Llamada al back cuando el componente se monta
    }, []);

    return (
        <div>
            <h1>Lista de Productos</h1>
            {loading ? (
                <p>Cargando productos...</p>
            ) : (
                <ul>
                    {productos.map((producto) => (
                        <li key={producto.codigo}>
                            <strong>{producto.nombre}</strong>: {producto.descripcion} - Cantidad: {producto.cantidad}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ItemListContainer;

