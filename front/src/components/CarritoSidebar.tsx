// components/CarritoSidebar.tsx
import React from "react";
import { useCart } from "../Context/CartContext.tsx";
import { useNavigate } from "react-router-dom";
import "../styles/CarritoSidebar.css"; // Asegúrate de tener un archivo CSS para los estilos

interface CarritoSidebarProps {
  visible: boolean;
  onClose: () => void;
}

const CarritoSidebar: React.FC<CarritoSidebarProps> = ({ visible, onClose }) => {
  const { carrito, quitarDelCarrito } = useCart();
  const navigate = useNavigate();

  const subtotal = carrito.reduce(
    (total, p) => total + (p.precio_oferta > 0 ? p.precio_oferta : p.precio) * p.cantidad,
    0
  );

  return (
    <>
      <div
        className={`carrito-overlay ${visible ? "open" : ""}`}
        onClick={onClose}
      />
      <div className={`carrito-sidebar ${visible ? "open" : ""}`}>
        <div className="carrito-header">
          <h3 className="carrito-titulo">Carrito de pedidos ({carrito.length})</h3>
          <button className="cerrar-btn" onClick={onClose}>×</button>
        </div>

        <div className="carrito-contenido">
          {carrito.map((producto) => (
            <div key={producto.id} className="carrito-item">
              <img src={producto.imagen} alt={producto.nombre} />
              <div className="item-info">
                <h4 className="item-nombre">{producto.nombre}</h4>
                <p className="item-precio">
                  ${(producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio).toFixed(2)}
                </p>
                <p className="precio-sin-impuestos">Impuestos incluidos</p>
              </div>
              <button className="eliminar-btn" onClick={() => quitarDelCarrito(producto.id)}>×</button>
            </div>
          ))}

          <div className="carrito-subtotal">
            <div className="subtotal-texto">
              <span>Subtotal</span>
              <span className="subtotal-precio">${subtotal.toFixed(2)}</span>
            </div>
            <p className="subtotal-impuestos">Impuestos incluidos</p>
          </div>
        </div>

        <div className="carrito-footer">
          <button 
            className="finalizar-btn"
            onClick={() => {
              onClose();
              navigate("/finalizar-pedido");
            }}
          >
            FINALIZAR COMPRA
          </button>
          <div className="carrito-links">
            <a className="link-carrito" href="/carrito">Ir al carrito</a>
            <a className="link-carrito" href="/productos">Seguir comprando</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarritoSidebar;
