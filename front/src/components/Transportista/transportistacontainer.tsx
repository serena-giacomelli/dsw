import React from "react";
import { useState, useEffect } from "react";

interface Transportista{
    nombre: string, 
    contacto: string,
    id:number,
}

const transportistaListContainer = () => {
    const [transportista, setTransportista] = useState<Transportista[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newTransport, setNewTransport] = useState<Transportista>({nombre: "", contacto: "", id: 0 });
    const [editingTransport, setEditingTransport] = useState<Transportista | null>(null);
    const fetchTransport = async () => {
        try {
            const response = await fetch("/api/transportista");
            const data = await response.json();
            setTransportista(data);
        } catch (error) {
            console.error("Error al traer los transportistas:", error);
        } finally {
            setLoading(false);
        }
    };

    const createTransport = async () => {
        try {
            const response = await fetch("/api/transportista", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTransport),
            });
            const data = await response.json();
            setTransportista([...transportista, data]);
            setNewTransport({ nombre: "", contacto: "", id: 0 }); // Reset form
        } catch (error) {
            console.error("Error al cargar el transportista:", error);
        }
    };

    const updateTransport = async (id: number) => {
        try {
            if (!editingTransport) return;
            const response = await fetch(`/api/transportista/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingTransport),
            });
            if (response.ok) {
                fetchTransport(); // Refresh transpostist list
                setEditingTransport(null); // Reset editing state
            }
        } catch (error) {
            console.error("Error al actualizar los datos del transportista:", error);
        }
    };

    const deleteTransport = async (id: number) => {
        try {
            await fetch(`/api/transportista/${id}`, {
                method: "DELETE",
            });
            setTransportista(transportista.filter((transportistas) => transportistas.id !== id));
        } catch (error) {
            console.error("Error al eliminar los datos del transportista:", error);
        }
    };

    useEffect(() => {
        fetchTransport();
    }, []);

    return (
        <div className="transport-container">
            <h1>Lista de Transportistas</h1>
            {loading ? (
                <p>Cargando Transportistas...</p>
            ) : (
                <ul>
                    {transportista.map((transportistas) => (
                        <li key={transportistas.id}>
                            <strong>{transportistas.nombre} </strong> - CONTACTO: {transportistas.contacto}
                            <button onClick={() => setEditingTransport(transportistas)}>Editar</button>
                            <button onClick={() => deleteTransport(transportistas.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>{editingTransport ? "Editar Transportista" : "Agregar Transportista"}</h2>
            <input
                type="text"
                placeholder="Nombre"
                value={editingTransport ? editingTransport.nombre : newTransport.nombre}
                onChange={(e) => editingTransport ? setEditingTransport({ ...editingTransport, nombre: e.target.value }) : setNewTransport({ ...newTransport, nombre: e.target.value })}
            />
            <input
                type="text"
                placeholder="contacto"
                value={editingTransport ? editingTransport.contacto : newTransport.contacto}
                onChange={(e) => editingTransport ? setEditingTransport({ ...editingTransport, contacto: e.target.value }) : setNewTransport({ ...newTransport, contacto: e.target.value })}
            />
            <button onClick={editingTransport ? () => updateTransport(editingTransport.id) : createTransport}>
                {editingTransport ? "Actualizar" : "Agregar"}
            </button>
        </div>
    );
}
export default transportistaListContainer;