import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/perfil.css';

interface UserData {
    nombre: string;
    apellido?: string;
    mail: string;
    tipoUsuario: string;
    dni?: string;
    fechaNacimiento?: string;
}

const Perfil: React.FC = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<UserData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setEditData(userData);
        } else {
            navigate('/login'); 
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!editData) return;
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            const userId = storedUser ? JSON.parse(storedUser).id : null;
            
            if (!userId) {
                console.error('No se encontró el ID del usuario');
                alert('Error: No se encontró la información del usuario');
                return;
            }

            if (!token) {
                console.error('No se encontró el token');
                alert('Error: Sesión expirada, por favor inicia sesión nuevamente');
                navigate('/login');
                return;
            }

            console.log('Datos a enviar:', editData);
            console.log('ID del usuario:', userId);
            console.log('Token:', token ? 'Presente' : 'Ausente');
            
            // Excluir campos innecesarios
            const { tipoUsuario, ...userData } = editData;
            
            const response = await fetch(`https://dswback.onrender.com/api/usuario/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Usuario actualizado:', updatedUser);
                setUser(updatedUser.data);
                localStorage.setItem('user', JSON.stringify(updatedUser.data));
                setIsEditing(false);
                alert('Perfil actualizado exitosamente');
            } else {
                const errorData = await response.json();
                console.error('Error del servidor:', errorData);
                alert(`Error al actualizar perfil: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error de conexión al actualizar perfil');
        }
    };

    const handleCancel = () => {
        setEditData(user);
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => prev ? { ...prev, [name]: value } : null);
    };

    if (!user) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="perfil-container">
            <h2>Mi Perfil</h2>
            
            {isEditing ? (
                <div className="perfil-edit-form">
                    <div className="input-group">
                        <label>Nombre:</label>
                        <input
                            name="nombre"
                            value={editData?.nombre || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    {editData?.apellido !== undefined && (
                        <div className="input-group">
                            <label>Apellido:</label>
                            <input
                                name="apellido"
                                value={editData?.apellido || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    <div className="input-group">
                        <label>Email:</label>
                        <input
                            name="mail"
                            type="email"
                            value={editData?.mail || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    {editData?.dni !== undefined && (
                        <div className="input-group">
                            <label>DNI:</label>
                            <input
                                name="dni"
                                value={editData?.dni || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {editData?.fechaNacimiento !== undefined && (
                        <div className="input-group">
                            <label>Fecha de nacimiento:</label>
                            <input
                                name="fechaNacimiento"
                                type="date"
                                value={editData?.fechaNacimiento || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    <div className="edit-actions">
                        <button onClick={handleSave} className="btn-save">Guardar</button>
                        <button onClick={handleCancel} className="btn-cancel">Cancelar</button>
                    </div>
                </div>
            ) : (
                <div className="perfil-info">
                    <p><strong>Nombre:</strong> {user.nombre} {user.apellido || ''}</p>
                    <p><strong>Email:</strong> {user.mail}</p>
                    <p><strong>Tipo de usuario:</strong> {user.tipoUsuario}</p>
                    {user.dni && <p><strong>DNI:</strong> {user.dni}</p>}
                    {user.fechaNacimiento && <p><strong>Fecha de nacimiento:</strong> {user.fechaNacimiento}</p>}
                </div>
            )}
            
            <div className="perfil-acciones">
                {!isEditing && (
                    <button onClick={handleEdit} className="btn-edit-profile">
                        Editar Perfil
                    </button>
                )}
                {user.tipoUsuario === 'admin' ? (
                    <button 
                        onClick={() => navigate('/admin/gestion')} 
                        className="btn-admin-gestion"
                    >
                        Gestión
                    </button>
                ) : (
                    <button 
                        onClick={() => navigate('/mis-pedidos')} 
                        className="btn-mis-pedidos"
                    >
                        Ver mis pedidos
                    </button>
                )}
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Perfil;
