import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/perfil.css';

const Perfil: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login'); 
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="perfil-container">
            <h2>Mi Perfil</h2>
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Email:</strong> {user.mail}</p>
            <p><strong>Tipo de usuario:</strong> {user.tipoUsuario}</p>
            
            <div className="perfil-acciones">
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
