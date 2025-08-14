import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/empresaContainer.css";
import Modal from "../Estructura/modal.tsx";

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
            const response = await fetch("https://dswback.onrender.comhttps://dswback.onrender.com/api/empresa");
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
            const response = await fetch("https://dswback.onrender.comhttps://dswback.onrender.com/api/empresa", {
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
            const response = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/empresa/${id}`, {
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
            await fetch(`https://dswback.onrender.com/api/empresa/${id}`, {
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
        <div className="empresa-container">
            <button
                onClick={handleNewEmpresa}
                className="empresa-btn empresa-btn-add"
            >
                Agregar nueva empresa
            </button>

            {loading ? (
                <p>Cargando empresas...</p>
            ) : (
                <ul className="empresa-list">
                    {empresas.map((empresa) => (
                        <li
                            key={empresa.id}
                            className="empresa-item"
                            onClick={(e) => {
                                if ((e.target as HTMLElement).tagName === "BUTTON") return;
                                navigate(`/empresa/${empresa.id}`);
                            }}
                        >
                            <div className="empresa-info">
                                <h3>{empresa.nombre}</h3>
                                <p><strong>Razón Social:</strong> {empresa.razonSocial}</p>
                                <p><strong>CUIL:</strong> {empresa.cuil}</p>
                                <p><strong>Sitio Web:</strong> <a href={empresa.sitioWeb} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{empresa.sitioWeb}</a></p>
                            </div>
                            <div className="empresa-actions">
                                <button
                                    onClick={e => { e.stopPropagation(); handleEditEmpresa(empresa); }}
                                    className="empresa-btn empresa-btn-edit"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={e => { e.stopPropagation(); handleDeleteEmpresa(empresa); }}
                                    className="empresa-btn empresa-btn-delete"
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
                <div className="empresa-modal">
                    <h2>{editingEmpresa ? "Editar Empresa" : "Agregar Empresa"}</h2>
                    <div className="empresa-modal-form">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editingEmpresa ? editingEmpresa.nombre : newEmpresa.nombre}
                            onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, nombre: e.target.value }) : setNewEmpresa({ ...newEmpresa, nombre: e.target.value })}
                            className="empresa-input"
                        />
                        <input
                            type="text"
                            placeholder="Razón Social"
                            value={editingEmpresa ? editingEmpresa.razonSocial : newEmpresa.razonSocial}
                            onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, razonSocial: e.target.value }) : setNewEmpresa({ ...newEmpresa, razonSocial: e.target.value })}
                            className="empresa-input"
                        />
                        <input
                            type="text"
                            placeholder="CUIL"
                            value={editingEmpresa ? editingEmpresa.cuil : newEmpresa.cuil}
                            onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, cuil: e.target.value }) : setNewEmpresa({ ...newEmpresa, cuil: e.target.value })}
                            className="empresa-input"
                        />
                        <input
                            type="text"
                            placeholder="Sitio Web"
                            value={editingEmpresa ? editingEmpresa.sitioWeb : newEmpresa.sitioWeb}
                            onChange={(e) => editingEmpresa ? setEditingEmpresa({ ...editingEmpresa, sitioWeb: e.target.value }) : setNewEmpresa({ ...newEmpresa, sitioWeb: e.target.value })}
                            className="empresa-input"
                        />
                        <div className="empresa-modal-actions">
                            <button
                                onClick={editingEmpresa ? () => updateEmpresa(editingEmpresa.id) : createEmpresa}
                                className="empresa-btn empresa-btn-add"
                            >
                                {editingEmpresa ? "Actualizar" : "Agregar"}
                            </button>
                            <button
                                onClick={closeModal}
                                className="empresa-btn"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal para confirmar eliminación */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="empresa-modal empresa-modal-delete">
                    <h2>Confirmar Eliminación</h2>
                    <p>
                        ¿Estás seguro de que deseas eliminar la empresa{" "}
                        <strong>
                            {empresaAEliminar?.nombre}
                        </strong>?
                    </p>
                    <div className="empresa-modal-actions">
                        <button
                            onClick={() => empresaAEliminar && deleteEmpresa(empresaAEliminar.id)}
                            className="empresa-btn empresa-btn-delete"
                        >
                            Eliminar
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="empresa-btn"
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