import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "../Estructura/modal.tsx";
import "../../styles/Empresa/empresaDetail.css";

interface Empresa {
    id: number;
    nombre: string;
    razonSocial: string;
    cuil: string;
    sitioWeb: string;
}

interface Sucursal {
    id: number;
    direccion: string;
    contacto: string;
}

interface Marca {
    id: number;
    nombre: string;
    cuil: string;
    telefono: string;
    sucursales: Sucursal[];
    empresa?: { id: number };
}

const EmpresaDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Marca modal state
    const [isMarcaModalOpen, setIsMarcaModalOpen] = useState(false);
    const [editingMarca, setEditingMarca] = useState<Marca | null>(null);
    const [marcaForm, setMarcaForm] = useState<Partial<Marca>>({ nombre: "", cuil: "", telefono: "" });
    const [marcaToDelete, setMarcaToDelete] = useState<Marca | null>(null);

    // Sucursal modal state
    const [isSucursalModalOpen, setIsSucursalModalOpen] = useState(false);
    const [editingSucursal, setEditingSucursal] = useState<{ marcaId: number, sucursal: Sucursal | null } | null>(null);
    const [sucursalForm, setSucursalForm] = useState<Partial<Sucursal>>({ direccion: "", contacto: "" });
    const [sucursalToDelete, setSucursalToDelete] = useState<{ marcaId: number, sucursal: Sucursal } | null>(null);

    useEffect(() => {
        fetchEmpresaYMarcas();
        // eslint-disable-next-line
    }, [id]);

    const fetchEmpresaYMarcas = async () => {
        setLoading(true);
        setError(null);
        try {
            // Obtener datos de la empresa
            const resEmp = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/empresa/${id}`);
            if (!resEmp.ok) throw new Error("Empresa no encontrada");
            const dataEmp = await resEmp.json();
            setEmpresa(dataEmp.data);

            // Obtener marcas de la empresa
            const resMarcas = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/marca`);
            const dataMarcas = await resMarcas.json();
            // Filtrar marcas por empresa
            const marcasEmpresa = (dataMarcas.data as Marca[]).filter(m => m.empresa?.id === Number(id));
            // Para cada marca, obtener sucursales
            const marcasConSucursales = await Promise.all(
                marcasEmpresa.map(async (marca) => {
                    if (marca.sucursales && Array.isArray(marca.sucursales)) {
                        return marca;
                    }
                    const resMarca = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/marca/${marca.id}`);
                    const dataMarca = await resMarca.json();
                    return { ...marca, sucursales: dataMarca.data.sucursales || [] };
                })
            );
            setMarcas(marcasConSucursales);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // CRUD Marca
    const openAddMarcaModal = () => {
        setEditingMarca(null);
        setMarcaForm({ nombre: "", cuil: "", telefono: "" });
        setIsMarcaModalOpen(true);
    };
    const openEditMarcaModal = (marca: Marca) => {
        setEditingMarca(marca);
        setMarcaForm({ nombre: marca.nombre, cuil: marca.cuil, telefono: marca.telefono });
        setIsMarcaModalOpen(true);
    };
    const closeMarcaModal = () => {
        setIsMarcaModalOpen(false);
        setEditingMarca(null);
        setMarcaForm({ nombre: "", cuil: "", telefono: "" });
    };
    const handleMarcaFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMarcaForm({ ...marcaForm, [e.target.name]: e.target.value });
    };
    const saveMarca = async () => {
        if (!marcaForm.nombre || !marcaForm.cuil || !marcaForm.telefono) return;
        if (editingMarca) {
            // Update
            await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/marca/${editingMarca.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...editingMarca, ...marcaForm, empresa: empresa?.id }),
            });
        } else {
            // Create
            await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/marca`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...marcaForm, empresa: empresa?.id }),
            });
        }
        closeMarcaModal();
        fetchEmpresaYMarcas();
    };
    const confirmDeleteMarca = (marca: Marca) => setMarcaToDelete(marca);
    const deleteMarca = async () => {
        if (!marcaToDelete) return;
        await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/marca/${marcaToDelete.id}`, { method: "DELETE" });
        setMarcaToDelete(null);
        fetchEmpresaYMarcas();
    };

    // CRUD Sucursal
    const openAddSucursalModal = (marcaId: number) => {
        setEditingSucursal({ marcaId, sucursal: null });
        setSucursalForm({ direccion: "", contacto: "" });
        setIsSucursalModalOpen(true);
    };
    const openEditSucursalModal = (marcaId: number, sucursal: Sucursal) => {
        setEditingSucursal({ marcaId, sucursal });
        setSucursalForm({ direccion: sucursal.direccion, contacto: sucursal.contacto });
        setIsSucursalModalOpen(true);
    };
    const closeSucursalModal = () => {
        setIsSucursalModalOpen(false);
        setEditingSucursal(null);
        setSucursalForm({ direccion: "", contacto: "" });
    };
    const handleSucursalFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSucursalForm({ ...sucursalForm, [e.target.name]: e.target.value });
    };
    const saveSucursal = async () => {
        if (!sucursalForm.direccion || !sucursalForm.contacto || !editingSucursal) return;
        if (editingSucursal.sucursal) {
            // Update
            await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/sucursal/${editingSucursal.sucursal.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...editingSucursal.sucursal, ...sucursalForm }),
            });
        } else {
            // Create
            // Primero crear sucursal
            const res = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/sucursal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...sucursalForm }),
            });
            const data = await res.json();
            // Luego asociar a la marca
            await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/marca/${editingSucursal.marcaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sucursales: [
                        ...(marcas.find(m => m.id === editingSucursal.marcaId)?.sucursales.map(s => s.id) || []),
                        data.data.id
                    ]
                }),
            });
        }
        closeSucursalModal();
        fetchEmpresaYMarcas();
    };
    const confirmDeleteSucursal = (marcaId: number, sucursal: Sucursal) => setSucursalToDelete({ marcaId, sucursal });
    const deleteSucursal = async () => {
        if (!sucursalToDelete) return;
        // Quitar la sucursal de la marca (actualizar marca)
        const marca = marcas.find(m => m.id === sucursalToDelete.marcaId);
        if (marca) {
            const nuevasSucursales = marca.sucursales.filter(s => s.id !== sucursalToDelete.sucursal.id).map(s => s.id);
            await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/marca/${marca.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sucursales: nuevasSucursales }),
            });
        }
        // Opcional: eliminar sucursal completamente
        // await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/sucursal/${sucursalToDelete.sucursal.id}`, { method: "DELETE" });
        setSucursalToDelete(null);
        fetchEmpresaYMarcas();
    };

    if (loading) return <div className="empresa-detail-container" style={{ textAlign: "center" }}>Cargando empresa...</div>;
    if (error) return <div className="empresa-detail-container" style={{ textAlign: "center", color: "red" }}>{error}</div>;
    if (!empresa) return <div className="empresa-detail-container" style={{ textAlign: "center" }}>Empresa no encontrada</div>;

    return (
        <div className="empresa-detail-container">
            <button
                onClick={() => navigate(-1)}
                className="empresa-detail-volver-btn"
            >
                Volver
            </button>
            <h1 className="empresa-detail-title">{empresa.nombre}</h1>
            <hr className="empresa-detail-hr" />
            <div className="empresa-detail-marcas-header">
                <h2>Marcas de la empresa</h2>
            </div>
            <div className="empresa-detail-marcas-btn-row">
                <button onClick={openAddMarcaModal} className="empresa-detail-marcas-btn">Agregar Marca</button>
            </div>
            {marcas.length === 0 ? (
                <p>No hay marcas asociadas a esta empresa.</p>
            ) : (
                <div className="empresa-detail-grid">
                    {marcas.map(marca => (
                        <div key={marca.id} className="empresa-detail-marca-card">
                            <div className="empresa-detail-marca-header">
                                <h3 style={{ margin: 0 }}>{marca.nombre}</h3>
                            </div>
                            <div className="empresa-detail-marca-btn-row">
                                <button onClick={() => openEditMarcaModal(marca)} className="empresa-detail-marca-btn">Editar</button>
                                <button onClick={() => confirmDeleteMarca(marca)} className="empresa-detail-marca-btn empresa-detail-marca-btn-delete">Eliminar</button>
                            </div>
                            <p><strong>CUIL:</strong> {marca.cuil}</p>
                            <p><strong>Teléfono:</strong> {marca.telefono}</p>
                            <div className="empresa-detail-sucursales-section">
                                <div className="empresa-detail-sucursales-header">
                                    <strong>Sucursales:</strong>
                                </div>
                                <div className="empresa-detail-sucursales-btn-row">
                                    <button onClick={() => openAddSucursalModal(marca.id)} className="empresa-detail-sucursales-btn">Agregar Sucursal</button>
                                </div>
                                {marca.sucursales && marca.sucursales.length > 0 ? (
                                    <div className="empresa-detail-sucursal-grid">
                                        {marca.sucursales.map(suc => (
                                            <div key={suc.id} className="empresa-detail-sucursal-card">
                                                <span>{suc.direccion} ({suc.contacto})</span>
                                                <div className="empresa-detail-sucursal-btn-row">
                                                    <button onClick={() => openEditSucursalModal(marca.id, suc)} className="empresa-detail-sucursal-btn">Editar</button>
                                                    <button onClick={() => confirmDeleteSucursal(marca.id, suc)} className="empresa-detail-sucursal-btn empresa-detail-sucursal-btn-delete">Eliminar</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span> No tiene sucursales.</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Marca */}
            <Modal isOpen={isMarcaModalOpen} onClose={closeMarcaModal}>
                <div style={{ padding: 20 }}>
                    <h2>{editingMarca ? "Editar Marca" : "Agregar Marca"}</h2>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={marcaForm.nombre || ""}
                        onChange={handleMarcaFormChange}
                        style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: 10, width: "100%" }}
                    />
                    <input
                        type="text"
                        name="cuil"
                        placeholder="CUIL"
                        value={marcaForm.cuil || ""}
                        onChange={handleMarcaFormChange}
                        style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: 10, width: "100%" }}
                    />
                    <input
                        type="text"
                        name="telefono"
                        placeholder="Teléfono"
                        value={marcaForm.telefono || ""}
                        onChange={handleMarcaFormChange}
                        style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: 10, width: "100%" }}
                    />
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                        <button onClick={saveMarca} style={{ flex: 1, padding: "12px", backgroundColor: "#6a5d4d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                            {editingMarca ? "Actualizar" : "Agregar"}
                        </button>
                        <button onClick={closeMarcaModal} style={{ flex: 1, padding: "12px", backgroundColor: "#6a5d4d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
            {/* Modal Eliminar Marca */}
            <Modal isOpen={!!marcaToDelete} onClose={() => setMarcaToDelete(null)}>
                <div style={{ padding: 20, textAlign: "center" }}>
                    <h2>Confirmar Eliminación</h2>
                    <p>¿Seguro que deseas eliminar la marca <strong>{marcaToDelete?.nombre}</strong>?</p>
                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        <button onClick={deleteMarca} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Eliminar</button>
                        <button onClick={() => setMarcaToDelete(null)} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                    </div>
                </div>
            </Modal>

            {/* Modal Sucursal */}
            <Modal isOpen={isSucursalModalOpen} onClose={closeSucursalModal}>
                <div style={{ padding: 20 }}>
                    <h2>{editingSucursal?.sucursal ? "Editar Sucursal" : "Agregar Sucursal"}</h2>
                    <input
                        type="text"
                        name="direccion"
                        placeholder="Dirección"
                        value={sucursalForm.direccion || ""}
                        onChange={handleSucursalFormChange}
                        style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: 10, width: "100%" }}
                    />
                    <input
                        type="text"
                        name="contacto"
                        placeholder="Contacto"
                        value={sucursalForm.contacto || ""}
                        onChange={handleSucursalFormChange}
                        style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: 10, width: "100%" }}
                    />
                    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                        <button onClick={saveSucursal} style={{ flex: 1, padding: "12px", backgroundColor: "#6a5d4d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                            {editingSucursal?.sucursal ? "Actualizar" : "Agregar"}
                        </button>
                        <button onClick={closeSucursalModal} style={{ flex: 1, padding: "12px", backgroundColor: "#6a5d4d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </Modal>
            {/* Modal Eliminar Sucursal */}
            <Modal isOpen={!!sucursalToDelete} onClose={() => setSucursalToDelete(null)}>
                <div style={{ padding: 20, textAlign: "center" }}>
                    <h2>Confirmar Eliminación</h2>
                    <p>¿Seguro que deseas eliminar la sucursal <strong>{sucursalToDelete?.sucursal.direccion}</strong>?</p>
                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        <button onClick={deleteSucursal} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Eliminar</button>
                        <button onClick={() => setSucursalToDelete(null)} style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmpresaDetail;
