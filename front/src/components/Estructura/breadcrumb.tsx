import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/Estructura/breadcrumb.css";

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
  const [nombreProducto, setNombreProducto] = useState<string | null>(null);

  const pathnames = location.pathname.split("/").filter((x) => x);

  useEffect(() => {
    const last = pathnames[pathnames.length - 1];
    const secondLast = pathnames[pathnames.length - 2];

    // Reset states
    setNombreTipoProducto(null);
    setNombreProducto(null);

    if (secondLast === "tipo" && !isNaN(Number(last))) {
      fetch(`https://dswback.onrender.com/api/tipoP/${last}`)
        .then((res) => res.json())
        .then((data) => {
          setNombreTipoProducto(data.data?.nombre?.toUpperCase() || `ID ${last}`);
        })
        .catch((error) => {
          setNombreTipoProducto(`ID ${last}`);
        });
    } else if (secondLast === "productos" && !isNaN(Number(last))) {
      fetch(`https://dswback.onrender.com/api/producto/${last}`)
        .then((res) => {
          if (!res.ok) throw new Error('Product not found');
          return res.json();
        })
        .then((data) => {
          const productName = data.data?.nombre?.toUpperCase() || `PRODUCTO ${last}`;
          setNombreProducto(productName);
        })
        .catch((error) => {
          setNombreProducto(`PRODUCTO ${last}`);
        });
    }
  }, [location, pathnames]);

  if (location.pathname === "/") return null;

  return (
    <nav className="breadcrumb">
      <Link to="/">INICIO</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const previous = pathnames[index - 1];

        let label = routeNameMap[value] || value.replace(/-/g, " ").toUpperCase();

        if (previous === "productos" && !isNaN(Number(value))) {
          label = nombreProducto || "CARGANDO...";
        }

        if (previous === "tipo" && nombreTipoProducto && isLast) {
          label = nombreTipoProducto;
        }

        if (value === "productos") {
          return (
            <span key={to}>
              › <Link to="/productos">{label}</Link>
            </span>
          );
        }

        // Último segmento sin link y en negrita
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
