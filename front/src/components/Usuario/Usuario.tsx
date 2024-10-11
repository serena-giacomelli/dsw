import React from 'react';
import "./Usuario.css";

interface UsuarioProps {
    nombre: string;
    apellido: string;
    dni: string;
    edad: number;
}

export const Usuario: React.FC<UsuarioProps> = (props) => {
    const{nombre,apellido,dni,edad}=props; 
    return (
        <div className="usuario"> 
            <h1>{nombre}</h1>
            <h1>{apellido}</h1>
            <p>DNI: {dni}</p>
            <p>Edad: {edad} años</p>
            <hr />
            <button>Confirmar</button>
        </div>
    );
};





