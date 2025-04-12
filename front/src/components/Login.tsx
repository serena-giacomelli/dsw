import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

  const Login: React.FC = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      console.log('API Response:', data); // Debugging log to check the response structure

      if (response.status === 200) {
          const { usuario, token } = data.data;
          setError('');
          console.log('Login successful:', { usuario, token });
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(usuario));
        } else if (response.status === 401) {
          if (data.error) {
            setError(data.error);
          } else {
            setError('Usuario o contraseña incorrectos.');
          }
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
            <div className="container-button">
              <button type="submit" className="btn-login">Iniciar Sesión</button>
            </div>
          </form>
        </div>

        <div className='divider'></div>

        <div className='right-side'>
          <div className='forgot-password'>
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className='register-button'>
            <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;