import React, { useState, useEffect } from "react";

interface TipoProducto{
    nombre:string;
    descripcion:string;
    id:number;
}

const TipoProductoContainer = () => {
    const [tipoP, setTipoP] = useState<TipoProducto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchTipoP = async () => {
        try {
            const response = await fetch("/api/tipoP");
            const data = await response.json();
            setTipoP(data);
        } catch (error) {
            console.error("Error al traer los tipos de productos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTipoP(); 
    }, []);

    return (
        <div>
            <h1>Lista de Tipos de Productos</h1>
            {loading ? (
                <p>Cargando tipos de productos...</p>
            ) : (
                <ul>
                    {tipoP.map((tipoP) => (
                        <li key={tipoP.id}>
                            <strong>{tipoP.nombre}</strong>: {tipoP.descripcion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TipoProductoContainer;