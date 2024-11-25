import React from "react";
import { useState, useEffect } from "react";

interface Empresa{ 
    id: number,
    nombre: string, 
    razonSocial: string, 
    cuil:string, 
    sitioWeb:string
}

const empresaContainer = () =>{
    const [empresa, setEmpresa] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newEmpresa, setNewEmpresa] = useState<Empresa>({id: 0, nombre: "", razonSocial: "", cuil: "", sitioWeb: "" });
    const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
    const fetchEmpresa = async () => {
        try {
            const response = await fetch("/api/empresa");
            const data = await response.json();
            setEmpresa(data);
        } catch (error) {
            console.error("Error al traer las empresas:", error);
        } finally {
            setLoading(false);
        }
    };

    const createEmpresa = async () => {
        try {
            const response = await fetch("/api/empresa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEmpresa),
            });
            const data = await response.json();
            setEmpresa([...empresa, data]);
            setNewEmpresa({id: 0, nombre: "", razonSocial: "", cuil: "", sitioWeb: "" }); 
        } catch (error) {
            console.error("Error al cargar la empresa:", error);
        }
    };

    const updateEmpresa = async (id: number) => {
        try {
            if (!editingEmpresa) return;
            const response = await fetch(`//api/empresa/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingEmpresa),
            });
            if (response.ok) {
                fetchEmpresa(); 
                setEditingEmpresa(null); 
            }
        } catch (error) {
            console.error("Error al actualizar los datos de la empresa:", error);
        }
    };

    const deleteEmpresa = async (id: number) => {
        try {
            await fetch(`/api/empresa/${id}`, {
                method: "DELETE",
            });
            setEmpresa(empresa.filter((empresas) => empresas.id !== id));
        } catch (error) {
            console.error("Error al eliminar los datos de la empresa:", error);
        }
    };

    useEffect(() => {
        fetchEmpresa();
    }, []);

    return (
        <div className="empresa-container">
            <h1>Lista de Empresas</h1>
            {loading ? (
                <p>Cargando Empresas...</p>
            ) : (
                <ul>
                    {empresa.map((empresas) => (
                        <li key={empresas.id}>
                            <strong>{empresas.nombre} </strong> - RAZON SOCIAL: {empresas.razonSocial} - CUIL: {empresas.cuil} - SITIO WEB: {empresas.sitioWeb}
                            <button onClick={() => setEditingEmpresa(empresas)}>Editar</button>
                            <button onClick={() => deleteEmpresa(empresas.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>{editingEmpresa ? "Editar Empresa" : "Agregar Empresa"}</h2>
            <input
                type="text"
                placeholder="Nombre"
                value={editingEmpresa ? editingEmpresa.nombre : newEmpresa.nombre}
                onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, nombre: e.target.value }) : setNewEmpresa({ ...newEmpresa, nombre: e.target.value })}
            />
            <input
                type="text"
                placeholder="razon social"
                value={editingEmpresa ? editingEmpresa.razonSocial : newEmpresa.razonSocial}
                onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, razonSocial: e.target.value }) : setNewEmpresa({ ...newEmpresa, razonSocial: e.target.value })}
            />
            <input
                type="text"
                placeholder="cuil"
                value={editingEmpresa ? editingEmpresa.cuil: newEmpresa.cuil}
                onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, cuil: e.target.value }) : setNewEmpresa({ ...newEmpresa, cuil: e.target.value })}
            />
            <input
                type="text"
                placeholder="sitio web"
                value={editingEmpresa ? editingEmpresa.sitioWeb : newEmpresa.sitioWeb}
                onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, sitioWeb: e.target.value }) : setNewEmpresa({ ...newEmpresa, sitioWeb: e.target.value })}
            />
            <button onClick={editingEmpresa ? () => updateEmpresa(editingEmpresa.id) : createEmpresa}>
                {editingEmpresa ? "Actualizar" : "Agregar"}
            </button>
        </div>
    );
}         
export default empresaContainer;     