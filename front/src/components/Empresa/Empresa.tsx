import React from 'react';
import "./Empresa.css";

interface EmpresaProps {
    nombre: string;
    razonSocial: string;
    cuil: string;
    sitioWeb: number;
}

export const Empresa: React.FC<EmpresaProps> = (props) => {
    const{nombre,razonSocial, cuil, sitioWeb}=props; 
    return (
        <div className="empresa"> 
            <h1>{nombre}</h1>
            <h1>{razonSocial}</h1>
            <p>DNI: {cuil}</p>
            <p>Edad: {sitioWeb} años</p>
            <hr />
            <button>Confirmar</button>
        </div>
    );
};

