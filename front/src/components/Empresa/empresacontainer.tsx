import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/empresaContainer.css";
import Modal from "../Modal.tsx";

interface Empresa {
    id: number;
    nombre: string;
    razonSocial: string;
    cuil: string;
    sitioWeb: string;
}

const EmpresaContainer = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newEmpresa, setNewEmpresa] = useState<Empresa>({ id: 0, nombre: "", razonSocial: "", cuil: "", sitioWeb: "" });
    const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [empresaAEliminar, setEmpresaAEliminar] = useState<Empresa | null>(null);
    const navigate = useNavigate();

    const fetchEmpresas = async () => {
        try {
            const response = await fetch("/api/empresa");
            const data = await response.json();
            setEmpresas(data.data);
        } catch (error) {
            console.error("Error al traer las empresas:", error);
        } finally {
            setLoading(false);
        }
    };

    const createEmpresa = async () => {
        try {
            newEmpresa.id = 0;
            const response = await fetch("/api/empresa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEmpresa),
            });
            const data = await response.json();
            setEmpresas([...empresas, data.data]);
            setNewEmpresa({ id: 0, nombre: "", razonSocial: "", cuil: "", sitioWeb: "" });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al cargar la empresa:", error);
        }
    };

    const updateEmpresa = async (id: number) => {
        try {
            if (!editingEmpresa) return;
            const response = await fetch(`/api/empresa/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingEmpresa),
            });
            if (response.ok) {
                fetchEmpresas();
                setEditingEmpresa(null);
                setIsModalOpen(false);
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
            setEmpresas(empresas.filter((empresa) => empresa.id !== id));
            setIsDeleteModalOpen(false);
            setEmpresaAEliminar(null);
        } catch (error) {
            console.error("Error al eliminar los datos de la empresa:", error);
        }
    };

    const handleEditEmpresa = (empresa: Empresa) => {
        setEditingEmpresa(empresa);
        setIsModalOpen(true);
    };

    const handleDeleteEmpresa = (empresa: Empresa) => {
        setEmpresaAEliminar(empresa);
        setIsDeleteModalOpen(true);
    };

    const handleNewEmpresa = () => {
        setEditingEmpresa(null);
        setNewEmpresa({ id: 0, nombre: "", razonSocial: "", cuil: "", sitioWeb: "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEmpresa(null);
        setNewEmpresa({ id: 0, nombre: "", razonSocial: "", cuil: "", sitioWeb: "" });
    };

    useEffect(() => {
        fetchEmpresas();
    }, []);

    return (
        <div className="empresa-list-container">
            <button
                onClick={handleNewEmpresa}
                className="custom-styled"
                style={{
                    marginBottom: "20px",
                    padding: "10px 20px",
                    backgroundColor: "#6a5d4d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                Agregar nueva empresa
            </button>

            {loading ? (
                <p>Cargando empresas...</p>
            ) : (
                <ul
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "20px",
                        listStyle: "none",
                        padding: 0,
                    }}>
                    {empresas.map((empresa) => (
                        <li
                            key={empresa.id}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "0px",
                                padding: "15px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                backgroundColor: "#fff",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                cursor: "pointer"
                            }}
                            onClick={(e) => {
                                if ((e.target as HTMLElement).tagName === "BUTTON") return;
                                navigate(`/empresa/${empresa.id}`);
                            }}
                        >
                            <div>
                                <h3>{empresa.nombre}</h3>
                                <p><strong>Razón Social:</strong> {empresa.razonSocial}</p>
                                <p><strong>CUIL:</strong> {empresa.cuil}</p>
                                <p><strong>Sitio Web:</strong> <a href={empresa.sitioWeb} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{empresa.sitioWeb}</a></p>
                            </div>
                            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                                <button
                                    onClick={e => { e.stopPropagation(); handleEditEmpresa(empresa); }}
                                    className="custom-styled"
                                    style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        backgroundColor: "#6a5d4d",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={e => { e.stopPropagation(); handleDeleteEmpresa(empresa); }}
                                    className="custom-styled"
                                    style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        backgroundColor: "#6a5d4d",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal para agregar/editar empresa */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div style={{ padding: "20px" }}>
                    <h2>{editingEmpresa ? "Editar Empresa" : "Agregar Empresa"}</h2>
                    <div style={{
                        display: "grid",
                        gap: "15px",
                        marginTop: "20px"
                    }}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editingEmpresa ? editingEmpresa.nombre : newEmpresa.nombre}
                            onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, nombre: e.target.value }) : setNewEmpresa({ ...newEmpresa, nombre: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <input
                            type="text"
                            placeholder="Razón Social"
                            value={editingEmpresa ? editingEmpresa.razonSocial : newEmpresa.razonSocial}
                            onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, razonSocial: e.target.value }) : setNewEmpresa({ ...newEmpresa, razonSocial: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <input
                            type="text"
                            placeholder="CUIL"
                            value={editingEmpresa ? editingEmpresa.cuil : newEmpresa.cuil}
                            onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, cuil: e.target.value }) : setNewEmpresa({ ...newEmpresa, cuil: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <input
                            type="text"
                            placeholder="Sitio Web"
                            value={editingEmpresa ? editingEmpresa.sitioWeb : newEmpresa.sitioWeb}
                            onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, sitioWeb: e.target.value }) : setNewEmpresa({ ...newEmpresa, sitioWeb: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button
                                onClick={editingEmpresa ? () => updateEmpresa(editingEmpresa.id) : createEmpresa}
                                className="custom-styled"
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    backgroundColor: "#6a5d4d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                {editingEmpresa ? "Actualizar" : "Agregar"}
                            </button>
                            <button
                                onClick={closeModal}
                                className="custom-styled"
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    backgroundColor: "#6a5d4d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal para confirmar eliminación */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div style={{ padding: "20px", textAlign: "center" }}>
                    <h2>Confirmar Eliminación</h2>
                    <p style={{ margin: "20px 0" }}>
                        ¿Estás seguro de que deseas eliminar la empresa{" "}
                        <strong>
                            {empresaAEliminar?.nombre}
                        </strong>?
                    </p>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button
                            onClick={() => empresaAEliminar && deleteEmpresa(empresaAEliminar.id)}
                            className="custom-styled"
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Eliminar
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="custom-styled"
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmpresaContainer;