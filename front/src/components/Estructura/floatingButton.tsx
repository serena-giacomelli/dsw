import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/Estructura/floatingButton.css";

const FloatingButton = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (location.pathname !== "/") return null;

  return (
    <>
    <div className="floating-button" onClick={() => setOpen(!open)}>
        <span className="text">{"Contáctenos"}</span>
      </div>
          {open && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Contacto</h2>

            <div className="modal-content">
              <p><strong>Email:</strong> <a href="mailto:contacto@muebles.com">contacto@muebles.com</a></p>
              <p><strong>Teléfono:</strong> <a href="tel:+543412223344">+54 341 222 3344</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/5493411234567" target="_blank" rel="noopener noreferrer">Chat en WhatsApp</a></p>
            </div>

            <button className="close-button" onClick={() => setOpen(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    
    </>

  );
};


export default FloatingButton;