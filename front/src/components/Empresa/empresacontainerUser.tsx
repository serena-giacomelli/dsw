import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Usuario/empresacontainerUser.css";

interface Empresa {
    id: number;
    nombre: string;
    razonSocial: string;
    cuil: string;
    sitioWeb: string;
}

interface Sucursal {
    id: number;
    direccion: string;
    contacto: string;
}

interface Marca {
    id: number;
    nombre: string;
    cuil: string;
    telefono: string;
    sucursales: Sucursal[];
    empresa?: { id: number };
}

const EmpresaContainerUser = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [marcasPorEmpresa, setMarcasPorEmpresa] = useState<{ [empresaId: number]: Marca[] }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmpresasYMarcas = async () => {
            try {
                const resEmp = await fetch("https://dswback.onrender.com/api/empresa");
                const dataEmp = await resEmp.json();
                setEmpresas(dataEmp.data);

                const resMarcas = await fetch("https://dswback.onrender.com/api/marca");
                const dataMarcas = await resMarcas.json();
                const marcas: Marca[] = dataMarcas.data;

                // Agrupar marcas por empresa
                const agrupadas: { [empresaId: number]: Marca[] } = {};
                for (const marca of marcas) {
                    if (!marca.empresa?.id) continue;
                    if (!agrupadas[marca.empresa.id]) agrupadas[marca.empresa.id] = [];
                    agrupadas[marca.empresa.id].push(marca);
                }
                // Para cada marca, obtener sucursales si no están cargadas
                await Promise.all(
                    marcas.map(async (marca) => {
                        if (!marca.sucursales || !Array.isArray(marca.sucursales)) {
                            const resMarca = await fetch(`https://dswback.onrender.com/api/marca/${marca.id}`);
                            const dataMarca = await resMarca.json();
                            marca.sucursales = dataMarca.data.sucursales || [];
                        }
                    })
                );
                setMarcasPorEmpresa(agrupadas);
            } catch (error) {
                console.error("Error al traer empresas o marcas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmpresasYMarcas();
    }, []);

    return (
        <div className="empresa-list-container">
            <h2
                className="empresa-titulo"
                style={{ color: '#6a5d4d', fontFamily: 'Times New Roman, Times, serif' }}
            >
                CALIDEZ, CALIDAD Y DISEÑO
            </h2>
            <p
                className="empresa-descripcion"
                style={{ color: '#6a5d4d', fontFamily: 'Times New Roman, Times, serif' }}
            >
                Les presentamos las Empresas y Marcas con las que trabajamos para brindar la mejor calidad a nuestros clientes
            </p>
            {loading ? (
                <p>Cargando empresas...</p>
            ) : (
                <ul className="empresa-grid">
                    {empresas.map((empresa) => (
                        <li
                            key={empresa.id}
                            className="empresa-card"
                        >
                            <div>
                                <h3>{empresa.nombre}</h3>
                                <p><strong>Razón Social:</strong> {empresa.razonSocial}</p>
                                <p><strong>CUIL:</strong> {empresa.cuil}</p>
                                <p>
                                    <strong>Sitio Web:</strong>{" "}
                                    <a
                                        href={empresa.sitioWeb}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {empresa.sitioWeb}
                                    </a>
                                </p>
                                <div className="empresa-marcas">
                                    <strong>Marcas:</strong>
                                    {marcasPorEmpresa[empresa.id] && marcasPorEmpresa[empresa.id].length > 0 ? (
                                        <ul className="marca-list">
                                            {marcasPorEmpresa[empresa.id].map(marca => (
                                                <li key={marca.id} className="marca-item">
                                                    <div>
                                                        <span className="marca-nombre">{marca.nombre}</span> - CUIL: {marca.cuil} - Teléfono: {marca.telefono}
                                                        <div className="marca-sucursales">
                                                            <strong>Sucursales:</strong>
                                                            {marca.sucursales && marca.sucursales.length > 0 ? (
                                                                <ul>
                                                                    {marca.sucursales.map(suc => (
                                                                        <li key={suc.id}>
                                                                            {suc.direccion} ({suc.contacto})
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <span> No tiene sucursales.</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span> No hay marcas asociadas.</span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmpresaContainerUser;
