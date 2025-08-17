import React, { useState, useEffect } from "react";
import "../../styles/Usuario/usuarioContainer.css";
import Modal from "../Estructura/modal.tsx";

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento: string;
    mail: string;
    password?: string; // Opcional para edición
}

const UserListContainer = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newUser, setNewUser] = useState<Usuario>({ id: 0, nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "", password: "" });
    const [editingUser, setEditingUser] = useState<Usuario | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch("https://dswback.onrender.com/api/usuario");
            const data = await response.json();
            console.log("Respuesta de fetchUsuarios:", data);
            
            // Verificar que la respuesta tenga la estructura esperada
            if (data && data.data && Array.isArray(data.data)) {
                setUsuarios(data.data);
            } else {
                console.error("Estructura de respuesta inesperada:", data);
                setUsuarios([]);
            }
        } catch (error) {
            console.error("Error al traer los usuarios:", error);
            setUsuarios([]);
        } finally {
            setLoading(false);
        }
    };

    const createUsuario = async () => {
        try {
            const { id, ...userData } = newUser;
            const token = localStorage.getItem('token');
            
            // Asegurarse de que password está incluido
            if (!userData.password) {
                alert("La contraseña es obligatoria");
                return;
            }
            
            console.log("Datos a enviar:", userData);
            
            const response = await fetch("https://dswback.onrender.com/api/usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(userData),
            });
            
            console.log("Response status:", response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta del servidor:", data);
                
                // Verificar que la respuesta tiene la estructura esperada
                if (data && data.data && data.data.id) {
                    setUsuarios([...usuarios, data.data]);
                    setNewUser({ id: 0, nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "", password: "" });
                    setIsModalOpen(false);
                    alert("Usuario creado exitosamente");
                } else {
                    // Si no tiene la estructura esperada, refrescar la lista
                    console.warn("Estructura de respuesta inesperada:", data);
                    await fetchUsuarios();
                    setNewUser({ id: 0, nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "", password: "" });
                    setIsModalOpen(false);
                    alert("Usuario creado exitosamente");
                }
            } else {
                const errorData = await response.json();
                console.error("Error al crear usuario:", response.status, errorData);
                alert(`Error al crear usuario: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error al crear el usuario:", error);
            alert("Error de conexión al crear usuario");
        }
    };

    const updateUsuario = async () => {
        try {
            if (!editingUser) return;
            const { id, ...userData } = editingUser;
            const token = localStorage.getItem('token');
            const response = await fetch(`https://dswback.onrender.com/api/usuario/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(userData),
            });
            
            if (response.ok) {
                fetchUsuarios(); 
                setEditingUser(null);
                setIsModalOpen(false); 
            } else {
                const errorData = await response.json();
                console.error("Error al actualizar usuario:", response.status, errorData);
                alert(`Error al actualizar usuario: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            alert("Error de conexión al actualizar usuario");
        }
    };

    const deleteUsuario = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://dswback.onrender.com/api/usuario/${id}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                }
            });
            
            if (response.ok) {
                setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
                setIsDeleteModalOpen(false);
                setUsuarioAEliminar(null);
            } else {
                const errorData = await response.json();
                console.error("Error al eliminar usuario:", response.status, errorData);
                alert(`Error al eliminar usuario: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            alert("Error de conexión al eliminar usuario");
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
        setNewUser({ id: 0, nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "", password: "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setNewUser({ id: 0, nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "", password: "" });
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
                    {usuarios.filter(usuario => usuario && usuario.id).map((usuario) => (
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
                        {!editingUser && (
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={newUser.password || ""}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                        )}
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button 
                                onClick={editingUser ? updateUsuario : createUsuario}
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
