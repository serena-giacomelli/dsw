import React from 'react';
import Usuariocontainer from './components/Usuario/Usuariocontainer';
import Productocontainer from './components/Usuario/Productocontainer';
import TipoProductocontainer from './components/Usuario/tipoProductocontainer';
import { Route, Routes, useLocation } from "react-router-dom";

const App: React.FC = () => {
    const nombre = "MUEBLERÍA LUSECHI";
    const location = useLocation();

    return (
        <Routes location={location} key={location.pathname}>
            <Route
                path="/"
                element={
                    <div>
                        <h1>{nombre}</h1>
                        <Productocontainer />
                        <Usuariocontainer />
                        <TipoProductocontainer />

                    </div>
                }
            />

        </Routes>
    );
};

export default App;


