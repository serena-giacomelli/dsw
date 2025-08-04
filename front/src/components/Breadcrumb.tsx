import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/breadcrumb.css";

const routeNameMap: { [key: string]: string } = {
  productos: "PRODUCTOS",
  tipoproductos: "TIPOPRODUCTOS",
  tipo: "PRODUCTOS POR TIPO",
  usuarios: "USUARIOS",
  empresas: "EMPRESAS",
  carrito: "CARRITO",
  perfil: "PERFIL",
  login: "LOGIN",
  "finalizar-pedido": "FINALIZAR COMPRA",
  "mis-pedidos": "MIS PEDIDOS"
};

const Breadcrumb = () => {
  const location = useLocation();
  const [nombreTipoProducto, setNombreTipoProducto] = useState<string | null>(null);

  const pathnames = location.pathname.split("/").filter((x) => x);

  useEffect(() => {
    const last = pathnames[pathnames.length - 1];
    const secondLast = pathnames[pathnames.length - 2];

    if (secondLast === "tipo" && !isNaN(Number(last))) {
      fetch(`/api/tipoP/${last}`)
        .then((res) => res.json())
        .then((data) => {
          setNombreTipoProducto(data.data?.nombre?.toUpperCase() || `ID ${last}`);
        })
        .catch(() => setNombreTipoProducto(`ID ${last}`));
    } else {
      setNombreTipoProducto(null);
    }
  }, [location]);

  if (location.pathname === "/") return null;

  return (
    <nav className="breadcrumb">
      <Link to="/">INICIO</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const previous = pathnames[index - 1];

        let label = routeNameMap[value] || value.replace(/-/g, " ").toUpperCase();

        if (previous === "tipo" && nombreTipoProducto && isLast) {
          label = nombreTipoProducto;
        }

        return isLast ? (
          <span key={to}>› <strong>{label}</strong></span>
        ) : (
          <span key={to}>
            › <Link to={to}>{label}</Link>
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
