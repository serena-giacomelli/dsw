
import React from "react";
import UsuarioContainer from "./Usuario/Usuariocontainer.tsx";
import ProductListContainer from "./Producto/Productocontainer.tsx";
import TipoProductoContainer from "./TipoProducto/tipoProductocontainer.tsx";
import '../../styles/vistaAdmin.css';

const VistaAdmin: React.FC = () => {
    return (
        <div className="vista-admin">
            <h1>Panel de Administración</h1>
            <div className="contenedores">
                <div className="contenedor">
                    <h2>Usuarios</h2>
                    <UsuarioContainer />
                </div>
                <div className="contenedor">
                    <h2>Productos</h2>
                    <ProductListContainer />
                </div>
                <div className="contenedor">
                    <h2>Tipos de Producto</h2>
                    <TipoProductoContainer />
                </div>
            </div>
        </div>
    );
};

export default VistaAdmin;
