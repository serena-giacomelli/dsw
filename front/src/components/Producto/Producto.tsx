import React from "react";


interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
    onEdit: () => void; // Función para manejar la edición
    onDelete: () => void; // Función para manejar la eliminación
}

const Producto: React.FC<Producto> = ({ id, nombre, descripcion, cantidad, onEdit, onDelete }) => {
    return (
        <li>
            <strong>{nombre}</strong>: {descripcion} - Cantidad: {cantidad}
            <button onClick={onEdit}>Editar</button>
            <button onClick={onDelete}>Eliminar</button>
        </li>
    );
};

export default Producto;