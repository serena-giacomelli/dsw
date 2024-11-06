import React from 'react';
import "./Transport.css";

interface TransportProps {
    nombre: string;
    contacto: string;
    id: number;
}

export const Transport: React.FC<TransportProps> = (props) => {
    const{nombre,contacto, id}=props; 
    return (
        <div className="Transport"> 
            <h1>{nombre}</h1>
            <h1>{contacto}</h1>
            <p>id: {id}</p>
            <hr />
            <button>Confirmar</button>
        </div>
    );
};
