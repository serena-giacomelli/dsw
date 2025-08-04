import React, { useState } from 'react';
import '../styles/header.css';
import { Link } from 'react-router-dom';
import Home from './home.tsx';
import { useCart } from '../Context/CartContext.tsx';
import CarritoSidebar from './CarritoSidebar';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false); // Nuevo estado para el menú de usuario
    const [carritoVisible, setCarritoVisible] = useState(false);
    const closeMenu = () => {
        setMenuOpen(false);
        setAdminDropdownOpen(false);
        setUserDropdownOpen(false); // Cierra también el menú de usuario
    };
    const isLoggedIn = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { carrito } = useCart();

    return (
        <header>
            <div className="top-bar">ENVIOS A TODO EL PAIS</div>
            <nav className="navbar">
                <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>☰</div>
                <h1 className="logo">L U S E C H I</h1>

                <div className="icons-container">
                    {/* Solo mostrar carrito si no es admin */}
                    {(!isLoggedIn || user.tipoUsuario !== 'admin') && (
                        <div className="cart-icon" onClick={() => setCarritoVisible(true)} style={{ cursor: "pointer" }}>
                            <img src="/carrito.png" alt="Carrito de pedidos" />
                            {carrito.length > 0 && <span className="badge">{carrito.length}</span>}
                        </div>
                    )}
                    <div className="user-icon">
                        <Link to={isLoggedIn ? "/perfil" : "/login"}>
                            <img src="/usuario.png" alt="Usuario" />
                        </Link>
                    </div>
                </div>

                {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

                <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={closeMenu}>Inicio</Link>

                    {isLoggedIn && user.tipoUsuario === 'admin' && (
                        <div className="admin-container">
                            <div className="admin-link" onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}>
                                Admin <span className={`arrow ${adminDropdownOpen ? 'open' : ''}`}>∇</span>
                            </div>
                            {adminDropdownOpen && (
                                <div className="admin-dropdown">
                                    <Link to="/usuarios" onClick={closeMenu}>Usuarios</Link>
                                    <Link to="/productos" onClick={closeMenu}>Productos</Link>
                                    <Link to="/tipoproductos" onClick={closeMenu}>Tipo Productos</Link>
                                    <Link to="/empresas" onClick={closeMenu}>Empresas</Link>
                                </div>
                            )}
                        </div>
                    )}

                    
                    {(!isLoggedIn || user.tipoUsuario !== 'admin') && (
                                    <><Link to="/tipoproductos" onClick={closeMenu}>Tipo Productos</Link>
                                    <Link to="/productos" onClick={closeMenu}>Productos</Link></>
                    )}
                       
                   
                </div>
            </nav>
                    <CarritoSidebar visible={carritoVisible} onClose={() => setCarritoVisible(false)} />
            <div><Home /></div>
        </header>
    );
};

export default Header;
