import React from 'react';
import Usuariocontainer from './components/Usuario/Usuariocontainer';
import Productocontainer from './components/Producto/Productocontainer';
import TipoProductocontainer from './components/TipoProducto/tipoProductocontainer';
import { Route, Routes, useLocation } from "react-router-dom";
import Header from './components/header';

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
                        <Productocontainer />
                        <Usuariocontainer />
                        <TipoProductocontainer />

                    </div>
                }
            />

        </Routes>

        </>
    );
};

export default App;


