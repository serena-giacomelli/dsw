import React from 'react';
import '../styles/header.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Home from './home.tsx';


const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <header>
        
            <div className="top-bar"> ENVIOS A TODO EL PAIS </div>
            <nav className="navbar">
                
            <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
            <h1 className="logo">L U S E C H I</h1>

            <div className="icons-container">
                {/* Icono del carrito */}
            <div className="cart-icon">
                <img src="/carrito.png" alt="Carrito de compras" />
            </div>

                {/* Icono de usuario */}
            <div className="user-icon">
                 <Link to="/login">
                <img src="/usuario.png" alt="Usuario" />
                 </Link>
            </div>
            </div>
            
            {/* Fondo oscuro para cerrar menú al hacer clic fuera */}
            {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

            {/* Menú desplegable */}
            <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={closeMenu}>Inicio</Link>
                <Link to={'/productos'} onClick={closeMenu}>Productos</Link>
                <Link to={'/usuarios'} onClick={closeMenu}>Usuarios</Link>
                <Link to={'/tipoproductos'} onClick={closeMenu}>Tipo Productos</Link>
                <Link to={'/empresas'} onClick={closeMenu}>Empresas</Link>
            </div>
            </nav>

            <div> <Home /> </div>
        </header>
    );
};

export default Header;
