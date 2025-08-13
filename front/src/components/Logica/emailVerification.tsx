import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailVerification: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [message, setMessage] = useState('Verificando...');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`/api/usuario/verify-email/${token}`, {
                    method: 'GET'
                });
                const data = await response.json();
                if (response.ok) {
                    setMessage('¡Email verificado correctamente! Ahora puedes iniciar sesión.');
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setMessage(data.message || 'No se pudo verificar el email.');
                }
            } catch {
                setMessage('Error al verificar el email.');
            }
        };
        if (token) verifyEmail();
    }, [token, navigate]);

    return (
        <div className="form-session">
            <div className="left-side">
                <div className="title-login">
                    <h2>Verificación de Email</h2>
                </div>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default EmailVerification;
