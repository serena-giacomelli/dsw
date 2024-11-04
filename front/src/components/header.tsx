// src/components/Header.jsx (o Header.tsx)
import React from 'react';
import '../styles/header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <img src="/logo.png" className="logo-image" />
            </div>
            <nav className="header-nav">
                <a href="#home">Inicio</a>
                <a href="#about">Sobre nosotros</a>
                <a href="#contact">Contacto</a>
            </nav>
        </header>
    );
};

export default Header;
