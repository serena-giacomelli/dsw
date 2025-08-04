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
    {/* Overlay que cierra el carrito al clic */}
      <div
        className={`carrito-overlay ${visible ? "open" : ""}`}
        onClick={onClose}
      />
    <div className={`carrito-sidebar ${visible ? "open" : ""}`}>
      <div className="carrito-header">
        <h3>Carrito de pedidos ({carrito.length})</h3>
      </div>

      <div className="carrito-body">
        {carrito.map((producto) => (
          <div key={producto.id} className="carrito-item">
            <img src={producto.imagen} alt={producto.nombre} />
            <div className="carrito-info">
              <h4>{producto.nombre}</h4>
              <p>Cantidad: {producto.cantidad}</p>
              <p>
                ${producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio}
              </p>
              <button onClick={() => quitarDelCarrito(producto.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="carrito-footer">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
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
