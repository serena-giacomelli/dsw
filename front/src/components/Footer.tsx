import React from "react";
import "../styles/footer.css";

const sucursales = [
  {
    direccion: "Av. Pellegrini 1234, Rosario",
    email: "rosario@sucursal.com",
  },
  {
    direccion: "San Martín 789, Funes",
    email: "funes@sucursal.com",
  },
  {
    direccion: "25 de Mayo 456, Santa Fe Capital",
    email: "santafe@sucursal.com",
  },
  {
    direccion: "Av. Corrientes 1000, CABA",
    email: "caba@sucursal.com",
  },
  {
    direccion: "Belgrano 321, Villa Carlos Paz",
    email: "carlospaz@sucursal.com",
  },
  {
    direccion: "Mitre 987, San Rafael",
    email: "sanrafael@sucursal.com",
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-section">
        <h3>Lusechi</h3>
      </div>
      <div className="footer-section">
        <h4>Contacto</h4>
        <p>Tel: +54 (341) 222 3344</p>
        <p>Email: lusechi3@gmail.com</p>
      </div>
      <div className="footer-section">
        <h4>Sucursales</h4>
        {sucursales.map((sucursal, idx) => (
          <div key={idx} style={{ marginBottom: "0.5em" }}>
            {sucursal.direccion}
            <br />
            <span style={{ fontSize: "0.95em", color: "#888" }}>{sucursal.email}</span>
          </div>
        ))}
      </div>
      <div className="footer-section">
        <p>&copy; {new Date().getFullYear()} Lusechi.SA Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
