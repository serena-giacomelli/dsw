import React, { useState, useEffect } from "react";
import "../../styles/usuarioContainer.css"

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

    const fetchUsuarios = async () => {
        try {
            const response = await fetch("/api/usuario");
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al traer los usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const createUsuario = async () => {
        try {
            const response = await fetch("/api/usuario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });
            const data = await response.json();
            setUsuarios([...usuarios, data]);
            setNewUser({ id: "", nombre: "", apellido: "", dni: "", fechaNacimiento: "", mail: "" }); 
        } catch (error) {
            console.error("Error al crear el usuario:", error);
        }
    };

    const updateUsuario = async (id: string) => {
        try {
            if (!editingUser) return;
            const response = await fetch(`/api/usuario/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editingUser),
            });
            if (response.ok) {
                fetchUsuarios(); 
                setEditingUser(null); 
            }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
        }
    };

    const deleteUsuario = async (id: string) => {
        try {
            await fetch(`/api/usuario/${id}`, {
                method: "DELETE",
            });
            setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (

        <div className="user-container">
            <h1>Lista de Usuarios</h1>
            {loading ? (
                <p>Cargando usuarios...</p>
            ) : (
                <ul>
                    {usuarios.map((usuario) => (
                        <li key={usuario.id}>
                            <strong>{usuario.nombre} {usuario.apellido}</strong> - DNI: {usuario.dni} - Mail: {usuario.mail}
                            <button onClick={() => setEditingUser(usuario)}>Editar</button>
                            <button onClick={() => deleteUsuario(usuario.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>{editingUser ? "Editar Usuario" : "Agregar Usuario"}</h2>
            <input
                type="text"
                placeholder="Nombre"
                value={editingUser ? editingUser.nombre : newUser.nombre}
                onChange={(e) => editingUser ? setEditingUser({ ...editingUser, nombre: e.target.value }) : setNewUser({ ...newUser, nombre: e.target.value })}
            />
            <input
                type="text"
                placeholder="Apellido"
                value={editingUser ? editingUser.apellido : newUser.apellido}
                onChange={(e) => editingUser ? setEditingUser({ ...editingUser, apellido: e.target.value }) : setNewUser({ ...newUser, apellido: e.target.value })}
            />
            <input
                type="text"
                placeholder="DNI"
                value={editingUser ? editingUser.dni : newUser.dni}
                onChange={(e) => editingUser ? setEditingUser({ ...editingUser, dni: e.target.value }) : setNewUser({ ...newUser, dni: e.target.value })}
            />
            <input
                type="date"
                placeholder="Fecha de Nacimiento"
                value={editingUser ? editingUser.fechaNacimiento : newUser.fechaNacimiento}
                onChange={(e) => editingUser ? setEditingUser({ ...editingUser, fechaNacimiento: e.target.value }) : setNewUser({ ...newUser, fechaNacimiento: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={editingUser ? editingUser.mail : newUser.mail}
                onChange={(e) => editingUser ? setEditingUser({ ...editingUser, mail: e.target.value }) : setNewUser({ ...newUser, mail: e.target.value })}
            />
            <button onClick={editingUser ? () => updateUsuario(editingUser.id) : createUsuario}>
                {editingUser ? "Actualizar" : "Agregar"}
            </button>
        </div>
    );
};

export default UserListContainer;
