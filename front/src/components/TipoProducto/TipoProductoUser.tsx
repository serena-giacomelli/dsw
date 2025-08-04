import React, { useState, useEffect } from "react";
import "../../styles/tipoProducto.css";

import TipoProducto from "./TipoProducto";

interface TipoProducto {
    id: number;
    nombre: string;
    descripcion: string;
}

const TipoProductoUser = () => {
    const [tiposProducto, setTiposProductoUser] = useState<TipoProducto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchTiposProductoUser = async () => {
        try {
            const response = await fetch("/api/tipoP");
            const data = await response.json();
            setTiposProductoUser(data.data);
        } catch (error) {
            console.error("Error al traer los tipos de producto:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTiposProductoUser();
    }, []);

    return (
        <div className="tipoproducto-list-container">
            {loading ? (
                <p>Cargando tipos de producto...</p>
            ) : (
                <div className="grid-container">
                    {tiposProducto.map((tipo) => (
                        <TipoProducto key={tipo.id} tipo={tipo} />
             ))}
            </div>
        )}
    </div>
    );
};

export default TipoProductoUser;