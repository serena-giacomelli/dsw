import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './Context/CartContext.tsx';
import './styles/Login.css';

const Login: React.FC = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Nuevo estado para el mensaje de éxito
  const navigate = useNavigate();
  const { cargarCarrito } = useCart();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await fetch('/api/usuario/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail: mail,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Log para verificar la estructura de la respuesta

      if (response.ok && data.data) {
        const { usuario, token } = data.data;
        if (!usuario || !token) {
          console.error('Datos incompletos en la respuesta:', data);
          setError('Error inesperado al procesar la respuesta del servidor.');
          return;
        }
        setError('');
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        console.log('Login successful:', { usuario, token });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(usuario));
        
        // Cargar el carrito específico del usuario
        cargarCarrito();
        
        setTimeout(() => navigate('/'), 2000); // Redirigir después de 2 segundos
      } else {
        console.error('Error en la respuesta del servidor:', data);
        setError(data.message || 'Error inesperado al iniciar sesión.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Error al iniciar sesión, por favor intente nuevamente.');
    }
  }

  return (
    <div className='container-session'>
      <div className='container-image'>
      </div>
      <div className='form-session'>
        <div className='left-side'>
          <div className='title-login'>
            <h2>Ingresar a mi cuenta</h2>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="mail">Mail:</label>
              <input
                id="mail"
                type="text"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <div className="container-button">
              <button type="submit" className="btn-login">Iniciar Sesión</button>
            </div>
            
            <div className="forgot-password">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            </div>
            <div className="register-button">
            <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
            </div>
          </form>
        </div>
    </div>
    </div>
  );
};


export default Login;