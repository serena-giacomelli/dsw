import React from 'react';
import { Usuario } from './components/Usuario/Usuario';
import Text from './components/Usuario/Text'; 
const App: React.FC = () => {
    const nombre = "MUEBLERÍA LUSECHI";
    
    // Datos del usuario que se van a pasar al componente Usuario
    return (
        <div>
           
            <h1>{nombre}</h1>
            <Usuario 
                nombre="serena"
                apellido="giacomelli" 
                dni="3031111 "
                edad={20} 
            />
            <Usuario 
                nombre="chiara"
                apellido="leonardi" 
                dni="30311221 "
                edad={2}  
            />
            <Text/>
        </div>
    );
};

export default App;
