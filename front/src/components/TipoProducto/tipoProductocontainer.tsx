import React, { useState, useEffect } from "react";
import TipoProducto from "./TipoProducto";
import { useLocation } from "react-router-dom";
import "../../styles/Usuario/tipoProducto.css";
import Modal from "../Estructura/modal.tsx";

interface TipoProducto {
    id: number;
    nombre: string;
    descripcion: string;
}

const TipoProductocontainer = () => {
    const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newTipoProducto, setNewTipoProducto] = useState<TipoProducto>({ id: 0, nombre: "", descripcion: "" });
    const [editingTipoProducto, setEditingTipoProducto] = useState<TipoProducto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tipoProductoAEliminar, setTipoProductoAEliminar] = useState<TipoProducto | null>(null);
    
    const location = useLocation();

    const fetchTiposProducto = async () => {
        try {
            const response = await fetch("https://dswback.onrender.com/api/tipoP");
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
            const response = await fetch("https://dswback.onrender.com/api/tipoP", {
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
            const response = await fetch(`https://dswback.onrender.com/api/tipoP/${id}`, {
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
            await fetch(`https://dswback.onrender.com/api/tipoP/${id}`, {
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
        <div className="tipoproducto-list-container">
            <button onClick={() => {
                setEditingTipoProducto(null);
                setIsModalOpen(true);
            }}>
                Agregar Tipo de Producto
            </button>

            {loading ? (
                <p>Cargando tipos de producto...</p>
                ) : (
                
                <div className="grid-container">
                    {tiposProducto.map((tipo) => (
                        <TipoProducto
                            key={tipo.id}
                            tipo={tipo}
                            onEdit={(id) => {
                                const tipoAEditar = tiposProducto.find(t => t.id === id);
                                if (tipoAEditar) setEditingTipoProducto(tipoAEditar);
                                setIsModalOpen(true);
                            
                            }}
                            onDelete={(id) => {
                                const tipoAEliminar = tiposProducto.find(t => t.id === id);
                                if (tipoAEliminar) {
                                    setTipoProductoAEliminar(tipoAEliminar);
                                }
                            }}
                        />
                    ))}
                </div>
            )}
            

            {/* Modal Agregar / Editar */}
            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                setEditingTipoProducto(null);
            }}>
            <h2>{editingTipoProducto ? "Editar Tipo de Producto" : "Agregar Tipo de Producto"}</h2>
            <input
                type="text"
                placeholder="Nombre"
                value={editingTipoProducto ? editingTipoProducto.nombre : newTipoProducto.nombre}
                onChange={(e) => editingTipoProducto
                     ? setEditingTipoProducto({ ...editingTipoProducto, nombre: e.target.value })
                      : setNewTipoProducto({ ...newTipoProducto, nombre: e.target.value })}
            />
    
            <input
                type="text"
                placeholder="Descripción"
                value={editingTipoProducto ? editingTipoProducto.descripcion : newTipoProducto.descripcion}
                onChange={(e) => editingTipoProducto 
                    ? setEditingTipoProducto({ ...editingTipoProducto, descripcion: e.target.value }) 
                    : setNewTipoProducto({ ...newTipoProducto, descripcion: e.target.value })}
            />
             
            <button onClick={() => {
                        if (editingTipoProducto) {
                            updateTipoProducto(editingTipoProducto.id);
                        } else {
                            createTipoProducto();
                        }
                        setIsModalOpen(false);
                    }}>
                {editingTipoProducto ? "Actualizar" : "Agregar"}
            </button>
            </Modal>

            {/* Modal Confirmación de Eliminación */}
            <Modal isOpen={tipoProductoAEliminar !== null} onClose={() => setTipoProductoAEliminar(null)}>
                <h2>¿Eliminar tipo de producto?</h2>
                <p>Nombre: {tipoProductoAEliminar?.nombre}</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button onClick={() => {
                        if (tipoProductoAEliminar) deleteTipoProducto(tipoProductoAEliminar.id);
                        setTipoProductoAEliminar(null);
                    }}>
                        Confirmar
                    </button>
                    <button onClick={() => setTipoProductoAEliminar(null)}>Cancelar</button>
                </div>
            </Modal>
            <div></div>
        </div>
    );
};

export default TipoProductocontainer;
