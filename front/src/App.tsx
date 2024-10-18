import React from 'react';
import { Usuario } from './components/Usuario/Usuario';
import Text from './components/Usuario/Text'; 
import ItemListContainer from './components/Usuario/Productocontainer';
import Usuariocontainer from './components/Usuario/Usuariocontainer';


const App: React.FC = () => {
    const nombre = "MUEBLERÍA LUSECHI";
    
    // Datos del usuario que se van a pasar al componente Usuario
    return (
        <div>
            <ItemListContainer/>
            <Usuariocontainer/>
        </div>
    );
};

export default App;
