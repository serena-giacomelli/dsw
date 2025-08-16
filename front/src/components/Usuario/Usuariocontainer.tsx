import React, { useState, useEffect } from "react";
import "../../styles/Usuario/usuarioContainer.css";
import Modal from "../Estructura/modal.tsx";

interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: string;
    mail: string;
}

const UserListContainer = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newUser, setNewUser] = useState<Usuario>({ id: "", nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "" });
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch("https://dswback.onrender.com/api/usuario");
            const data = await response.json();
            setUsuarios(data.data);
        } catch (error) {
            console.error("Error al traer los usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const createUsuario = async () => {
        try {
            // No enviar el campo 'id' al crear usuario
            const { id, ...userData } = newUser;
            const response = await fetch("https://dswback.onrender.com/api/usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            console.log(data.data);
            setUsuarios([...usuarios, data.data]);
            setNewUser({ id: "", nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "" });
            setIsModalOpen(false); // Cerrar modal después de crear
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    };

    const updateUsuario = async (id: string) => {
        try {
            if (!editingUser) return;
            // No enviar el campo 'id' al actualizar usuario
            const { id, ...userData } = editingUser;
            const response = await fetch(`https://dswback.onrender.com/api/usuario/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            if (response.ok) {
                fetchUsuarios(); 
                setEditingUser(null);
                setIsModalOpen(false); // Cerrar modal después de actualizar
            }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    const deleteUsuario = async (id: string) => {
        try {
            await fetch(`https://dswback.onrender.com/api/usuario/${id}`, {
                method: "DELETE",
            });
            setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
            setIsDeleteModalOpen(false);
            setUsuarioAEliminar(null);
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const handleEditUser = (usuario: Usuario) => {
        setEditingUser(usuario);
        setIsModalOpen(true);
    };

    const handleDeleteUser = (usuario: Usuario) => {
        setUsuarioAEliminar(usuario);
        setIsDeleteModalOpen(true);
    };

    const handleNewUser = () => {
        setEditingUser(null);
        setNewUser({ id: "", nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setNewUser({ id: "", nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "" });
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <div className="product-list-container">
            {/* Botón para agregar nuevo usuario */}
            <button 
                onClick={handleNewUser}
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
                Agregar nuevo usuario
            </button>

            {loading ? (
                <p>Cargando usuarios...</p>
            ) : (
                <ul
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                    listStyle: "none",
                    padding: 0,
                }}>
                    {usuarios.map((usuario) => (
                        <li key={usuario.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "0px",
                            padding: "15px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            backgroundColor: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}>
                            <div>
                                <h3>{usuario.nombre} {usuario.apellido}</h3>
                                <p><strong>DNI:</strong> {usuario.dni}</p>
                                <p><strong>Email:</strong> {usuario.mail}</p>
                                <p><strong>Fecha de Nacimiento:</strong> {usuario.fechaNacimiento}</p>
                            </div>
                            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                                <button 
                                    onClick={() => handleEditUser(usuario)}
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
                                    onClick={() => handleDeleteUser(usuario)}
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

            {/* Modal para agregar/editar usuario */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div style={{ padding: "20px" }}>
                    <h2>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</h2>
                    <div style={{ 
                        display: "grid", 
                        gap: "15px", 
                        marginTop: "20px"
                    }}>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editingUser ? editingUser.nombre : newUser.nombre}
                            onChange={(e) => editingUser ? setEditingUser({ ...editingUser, nombre: e.target.value }) : setNewUser({ ...newUser, nombre: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <input
                            type="text"
                            placeholder="Apellido"
                            value={editingUser ? editingUser.apellido : newUser.apellido}
                            onChange={(e) => editingUser ? setEditingUser({ ...editingUser, apellido: e.target.value }) : setNewUser({ ...newUser, apellido: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <input
                            type="text"
                            placeholder="DNI"
                            value={editingUser ? editingUser.dni : newUser.dni}
                            onChange={(e) => editingUser ? setEditingUser({ ...editingUser, dni: e.target.value }) : setNewUser({ ...newUser, dni: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <input
                            type="date"
                            placeholder="Fecha de Nacimiento"
                            value={editingUser ? editingUser.fechaNacimiento : newUser.fechaNacimiento}
                            onChange={(e) => editingUser ? setEditingUser({ ...editingUser, fechaNacimiento: e.target.value }) : setNewUser({ ...newUser, fechaNacimiento: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editingUser ? editingUser.mail : newUser.mail}
                            onChange={(e) => editingUser ? setEditingUser({ ...editingUser, mail: e.target.value }) : setNewUser({ ...newUser, mail: e.target.value })}
                            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                        />
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button 
                                onClick={editingUser ? () => updateUsuario(editingUser.id) : createUsuario}
                                className="custom-styled"
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    backgroundColor: editingUser ? "#6a5d4d" : "#6a5d4d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                {editingUser ? "Actualizar" : "Agregar"}
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
                        ¿Estás seguro de que deseas eliminar al usuario{" "}
                        <strong>
                            {usuarioAEliminar?.nombre} {usuarioAEliminar?.apellido}
                        </strong>?
                    </p>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button 
                            onClick={() => usuarioAEliminar && deleteUsuario(usuarioAEliminar.id)}
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

export default UserListContainer;
