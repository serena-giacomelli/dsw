import React from 'react';
import '../styles/header.css';
import { Link } from 'react-router-dom';


const Header = () => {
    
    return (
        <header className="header">
            <div className="header-logo">
                <img src="/logo.png" className="logo-image" />
            </div>
            <nav className="header-nav">
                <Link to={'/productos'}>Productos</Link>
                <Link to={'/usuarios'}>Usuarios</Link>
                <Link to={'/tipoproductos'}>TipoProductos</Link>
            </nav>
        </header>
    );
};

export default Header;
