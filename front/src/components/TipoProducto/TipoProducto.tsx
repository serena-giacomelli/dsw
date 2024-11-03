import React from "react";

interface TipoProductoProps {
    tipo: {
        id: number;
        nombre: string;
        descripcion: string;
    };
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const TipoProducto: React.FC<TipoProductoProps> = ({ tipo, onEdit, onDelete }) => {
    return (
        <li key={tipo.id}>
            <strong>{tipo.nombre}</strong> - Descripción: {tipo.descripcion}
            <button onClick={() => onEdit(tipo.id)}>Editar</button>
            <button onClick={() => onDelete(tipo.id)}>Eliminar</button>
        </li>
    );
};

export default TipoProducto;
