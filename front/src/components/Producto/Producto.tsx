import React from "react";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    imagen: string;
    onEdit: () => void; 
    onDelete: () => void; 
}

const Producto: React.FC<Producto> = ({ id, nombre, descripcion, cantidad, precio, onEdit, onDelete }) => {
    return (
        <div className="producto-card">
            <h3>{nombre}</h3>
                <p>{descripcion}</p>
                <p>Cantidad: {cantidad}</p>
                <p>Precio: ${precio}</p>
                <button onClick={onEdit}>Editar</button>
                <button onClick={onDelete}>Eliminar</button>
        </div>
    );
};

export default Producto;
