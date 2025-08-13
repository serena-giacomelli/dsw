import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Usuario/tipoProducto.css";

interface TipoProductoProps {
    tipo: {
        id: number;
        nombre: string;
        descripcion: string;
    };
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

const TipoProducto: React.FC<TipoProductoProps> = ({ tipo, onEdit, onDelete }) => {
    const navigate = useNavigate();

    const handleVerProductos = () => {
        navigate(`/productos/tipo/${tipo.id}`);
    };

    return (
        <div className="tipo-producto-card">
            <h3>{tipo.nombre}</h3>
            <p><strong>Descripción:</strong> {tipo.descripcion}</p>
            <div className="acciones">
                {onEdit && onDelete ? (
                    <>
                        <button className="btn-editar" onClick={() => onEdit(tipo.id)}>Editar</button>
                        <button className="btn-eliminar" onClick={() => onDelete(tipo.id)}>Eliminar</button>
                    </>
                ) : (
                    <button className="btn-ver-productos" onClick={handleVerProductos}>
                        Ver productos
                    </button>
                )}
            </div>
        </div>
    );
};

export default TipoProducto;
