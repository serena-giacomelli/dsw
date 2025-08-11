import React from 'react';
import "./Usuario.css";

interface UsuarioProps {
    nombre: string;
    apellido: string;
    dni: string;
    fechaNacimiento?: string;
}

export const Usuario: React.FC<UsuarioProps> = (props) => {
    const { nombre, apellido, dni, fechaNacimiento } = props;
    return (
        <div className="usuario"> 
            <h1>{nombre}</h1>
            <h1>{apellido}</h1>
            <p>DNI: {dni}</p>
            {fechaNacimiento && <p>Fecha de nacimiento: {fechaNacimiento}</p>}
            <hr />
            <button>Confirmar</button>
        </div>
    );
};





