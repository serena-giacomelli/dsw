import React from "react";
import { useCart } from "../Context/CartContext.tsx";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Carrito.css";

const Carrito: React.FC = () => {
  const { carrito, quitarDelCarrito, vaciarCarrito } = useCart();
  const navigate = useNavigate();

  const calcularTotal = () => {
    return carrito.reduce((acc, producto) => {
      const precioUnitario = producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio;
      return acc + precioUnitario * producto.cantidad;
    }, 0);
  };

  return (
    <div className="carrito-container">
      <h2>Carrito de Pedidos</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {carrito.map((producto) => (
              <li key={producto.id} className="carrito-item">
                <img src={producto.imagen} alt={producto.nombre} />
                <div>
                  <h3>{producto.nombre}</h3>
                  <p>Precio: ${producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio}</p>
                  <p>Cantidad: {producto.cantidad}</p>
                  <button onClick={() => quitarDelCarrito(producto.id)}>Quitar</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="carrito-total">
            <h3>Total: ${calcularTotal().toFixed(2)}</h3>
            <button onClick={vaciarCarrito}>Vaciar carrito</button>
            <button onClick={() => navigate("/finalizar-pedido")}>Finalizar pedido</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
