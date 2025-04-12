import React, { useState, useEffect } from "react";
import TipoProducto from "./TipoProducto";

interface TipoProducto {
    id: number;
    nombre: string;
    descripcion: string;
}

const ProductoListContainer = () => {
    const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newTipoProducto, setNewTipoProducto] = useState<TipoProducto>({ id: 0, nombre: "", descripcion: "" });
    const [editingTipoProducto, setEditingTipoProducto] = useState<TipoProducto | null>(null);

    const fetchTiposProducto = async () => {
        try {
            const response = await fetch("/api/tipoP");
            const data = await response.json();
            setTiposProducto(data.data);
        } catch (error) {
            console.error("Error al traer los tipos de producto:", error);
        } finally {
            setLoading(false);
        }
    };

    const createTipoProducto = async () => {
        try {
            const response = await fetch("/api/tipoP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTipoProducto),
            });
            const data = await response.json();
            setTiposProducto([...tiposProducto, data]);
            setNewTipoProducto({ id: 0, nombre: "", descripcion: "" }); 
        } catch (error) {
            console.error("Error al crear el tipo de producto:", error);
        }
    };

    const updateTipoProducto = async (id: number) => {
        try {
            if (!editingTipoProducto) return;
            const response = await fetch(`/api/tipoP/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingTipoProducto),
            });
            if (response.ok) {
                fetchTiposProducto(); 
                setEditingTipoProducto(null); 
            }
        } catch (error) {
            console.error("Error al actualizar el tipo de producto:", error);
        }
    };

    const deleteTipoProducto = async (id: number) => {
        try {
            await fetch(`/api/tipoP/${id}`, {
                method: "DELETE",
            });
            setTiposProducto(tiposProducto.filter((tipo) => tipo.id !== id));
        } catch (error) {
            console.error("Error al eliminar el tipo de producto:", error);
        }
    };

    useEffect(() => {
        fetchTiposProducto();
    }, []);

    return (
        <div>
            <h1>Lista de Tipos de Producto</h1>
            {loading ? (
                <p>Cargando tipos de producto...</p>
            ) : (
                <ul>
                    {tiposProducto.map((tipo) => (
                        <li key={tipo.id}>
                            <strong>{tipo.nombre}</strong> - Descripción: {tipo.descripcion}
                            <button onClick={() => setEditingTipoProducto(tipo)}>Editar</button>
                            <button onClick={() => deleteTipoProducto(tipo.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>{editingTipoProducto ? "Editar Tipo de Producto" : "Agregar Tipo de Producto"}</h2>
            <input
                type="text"
                placeholder="Nombre"
                value={editingTipoProducto ? editingTipoProducto.nombre : newTipoProducto.nombre}
                onChange={(e) => editingTipoProducto ? setEditingTipoProducto({ ...editingTipoProducto, nombre: e.target.value }) : setNewTipoProducto({ ...newTipoProducto, nombre: e.target.value })}
            />
    
            <input
                type="text"
                placeholder="Descripción"
                value={editingTipoProducto ? editingTipoProducto.descripcion : newTipoProducto.descripcion}
                onChange={(e) => editingTipoProducto ? setEditingTipoProducto({ ...editingTipoProducto, descripcion: e.target.value }) : setNewTipoProducto({ ...newTipoProducto, descripcion: e.target.value })}
            />
             
            
            <button onClick={editingTipoProducto ? () => updateTipoProducto(editingTipoProducto.id) : createTipoProducto}>
                {editingTipoProducto ? "Actualizar" : "Agregar"}
            </button>
        </div>
    );
};

export default ProductoListContainer;
