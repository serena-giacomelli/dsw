import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/register.css';

const Register: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dni, setDni] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const navigate = useNavigate();

    // Validación de contraseña
    const validatePassword = (pwd: string) => {
        // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pwd);
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setOtpError('');

        // Validaciones de campos obligatorios
        if (!nombre || !apellido || !mail || !password || !dni) {
            setError('Por favor completa todos los campos obligatorios.');
            return;
        }
        if (!validatePassword(password)) {
            setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            console.log('Enviando datos al backend:', {
                nombre,
                apellido,
                mail,
                password,
                dni,
                fechaNacimiento: fechaNacimiento || ''
            });
            const response = await fetch('https://dswback.onrender.com/api/usuario/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    mail,
                    password,
                    dni,
                    fechaNacimiento: fechaNacimiento || ''
                })
            });

            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error('Respuesta no JSON:', text);
                setError('El servidor devolvió una respuesta inesperada. Verifica la consola para más detalles.');
                setLoading(false);
                return;
            }
            console.log('Respuesta del backend:', data);
            if (response.ok) {
                setShowOtpModal(true);
                setSuccess('Se envió un código de verificación a tu email.');
            } else {
                setError(data.message || JSON.stringify(data) || 'Error al registrar usuario.');
            }
        } catch (err: any) {
            console.error('Error en fetch:', err);
            setError('Error al registrar usuario. Detalle: ' + (err?.message || err));
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setOtpError('');
        try {
            const response = await fetch('https://dswback.onrender.com/api/usuario/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mail, otp })
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('¡Registro y verificación exitosos! Ahora puedes iniciar sesión.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setOtpError(data.message || 'Código incorrecto o expirado.');
            }
        } catch (err: any) {
            setOtpError('Error al verificar el código.');
        }
    };

    return (
        <div className="form-session">
            <div className="left-side">
                <div className="title-login">
                    <h2 style={{ color: '#6a5d4d', fontFamily: 'Times New Roman, Times, serif' }}>Registro de Usuario</h2>
                </div>
                <form onSubmit={handleRegister} className="login-form">
                    <div className="input-group">
                        <label htmlFor="nombre">Nombre <span style={{color: 'red'}}>*</span>:</label>
                        <input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="apellido">Apellido <span style={{color: 'red'}}>*</span>:</label>
                        <input id="apellido" value={apellido} onChange={e => setApellido(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="mail">Email <span style={{color: 'red'}}>*</span>:</label>
                        <input id="mail" type="email" value={mail} onChange={e => setMail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña <span style={{color: 'red'}}>*</span>:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={8}
                            title="Al menos 8 caracteres, una mayúscula, una minúscula y un número"
                        />
                        <small>
                            Mínimo 8 caracteres, una mayúscula, una minúscula y un número.
                        </small>
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirmar contraseña <span style={{color: 'red'}}>*</span>:</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="dni">DNI <span style={{color: 'red'}}>*</span>:</label>
                        <input id="dni" value={dni} onChange={e => setDni(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="fechaNacimiento">Fecha de nacimiento <span style={{color: 'gray'}}>(opcional)</span>:</label>
                        <input
                            id="fechaNacimiento"
                            type="date"
                            value={fechaNacimiento}
                            onChange={e => setFechaNacimiento(e.target.value)}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <div className="container-button">
                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>
                </form>
                {showOtpModal && (
                    <div className="modal-otp">
                        <div className="modal-content">
                            <h3>Verifica tu email</h3>
                            <form onSubmit={handleVerifyOtp}>
                                <div className="input-group">
                                    <label htmlFor="otp">Código recibido por email:</label>
                                    <input
                                        id="otp"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        required
                                        maxLength={6}
                                    />
                                </div>
                                {otpError && <p className="error-message">{otpError}</p>}
                                <div className="container-button">
                                    <button type="submit" className="btn-login">Verificar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
