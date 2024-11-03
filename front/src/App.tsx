import React from 'react';
import Usuariocontainer from './components/Usuario/Usuariocontainer';
import Productocontainer from './components/Usuario/Productocontainer';
import TipoProductocontainer from './components/Usuario/tipoProductocontainer'; 

const App: React.FC = () => {
    const nombre = "MUEBLERÍA LUSECHI";
    
    return (
        <div>
            <h1>{nombre}</h1>
            <Productocontainer />
            <Usuariocontainer />
            <TipoProductocontainer />
        </div>
    );
};

export default App;


