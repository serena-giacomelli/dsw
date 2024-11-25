import React from 'react';
import Usuariocontainer from './components/Usuario/Usuariocontainer';
import Productocontainer from './components/Producto/Productocontainer';
import TipoProductocontainer from './components/TipoProducto/tipoProductocontainer';
import { Route, Routes, useLocation } from "react-router-dom";
import Header from './components/header';

import './styles/App.css';

const App: React.FC = () => {
    const nombre = "MUEBLERÍA LUSECHI";
    const location = useLocation();

    return (
        <>
            <Header />
            <Routes location={location} key={location.pathname}>
            <Route
                path="/"
                element={
                    <div>
                        <h1>Bienvenido a {nombre}</h1>
                        <div className='titulo'>
                            <p>Seleccione una opción del menú para comenzar.</p>
                        </div>
                    </div>
                }
            />
            <Route path="/productos" element={<Productocontainer />} />
            <Route path="/usuarios" element={<Usuariocontainer />} />
            <Route path="/tipoproductos" element={<TipoProductocontainer />} />

        </Routes>

        </>
    );
};

export default App;


