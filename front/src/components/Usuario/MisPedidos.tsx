import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pedidoService } from "../../services/pedidoService";
import "../../styles/Usuario/misPedidos.css";
import "../../styles/Estructura/placeholder.css";

interface LineaPedido {
  id: number;
  cantidad: string;
  precio_unitario: number;
  productos: {
    id: number;
    nombre: string;
    imagen?: string;
  }[];
}

interface Pedido {
  id: number;
  fecha_pedido: string;
  total: number;
  tipo_entrega: string;
  estado: string;
  usuarios?: {
    id: number;
    nombre: string;
    apellido: string;
    mail: string;
  }[];
  lineasPed?: LineaPedido[];
  transportista?: {
    id: number;
    nombre: string;
    contacto?: string;
  };
}

const MisPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await pedidoService.obtenerPedidosUsuario(token);
      setPedidos(response.data || []);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return '#f39c12';
      case 'completado':
        return '#27ae60';
      case 'cancelado':
        return '#e74c3c';
      case 'entregado':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      case 'entregado':
        return 'Entregado';
      default:
        return estado;
    }
  };

  const cancelarPedido = async (pedidoId: number) => {
    const motivo = prompt('¿Por qué deseas cancelar este pedido?');
    if (!motivo) {
      return;
    }

    if (!window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
      return;
    }

    try {
      setProcesando(pedidoId);
      const token = localStorage.getItem('token');
      if (!token) return;

      await pedidoService.cancelarPedido(pedidoId, motivo, token);
      
      // Actualizar el estado local
      setPedidos(prev => prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, estado: 'cancelado' }
          : pedido
      ));
      
      alert('Pedido cancelado exitosamente');
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      alert('Error al cancelar el pedido');
    } finally {
      setProcesando(null);
    }
  };

  const marcarComoRecibido = async (pedidoId: number) => {
    if (!window.confirm('¿Confirmas que has recibido este pedido?')) {
      return;
    }

    try {
      setProcesando(pedidoId);
      const token = localStorage.getItem('token');
      if (!token) return;

      await pedidoService.marcarComoRecibido(pedidoId, token);
      
      // Actualizar el estado local
      setPedidos(prev => prev.map(pedido => 
        pedido.id === pedidoId 
          ? { ...pedido, estado: 'completado' }
          : pedido
      ));
      
      alert('Pedido marcado como recibido');
    } catch (error) {
      console.error('Error al marcar como recibido:', error);
      alert('Error al confirmar la recepción del pedido');
    } finally {
      setProcesando(null);
    }
  };

  const puedeSerCancelado = (pedido: Pedido) => {
    return pedido.estado.toLowerCase() === 'pendiente';
  };

  const puedeSerMarcadoComoRecibido = (pedido: Pedido) => {
    return pedido.estado.toLowerCase() === 'entregado';
  };

  const abrirModal = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setPedidoSeleccionado(null);
    setMostrarModal(false);
  };

  const calcularTotalProductos = (lineasPed: LineaPedido[] = []) => {
    return lineasPed.reduce((total, linea) => {
      return total + (Number(linea.cantidad) * linea.precio_unitario);
    }, 0);
  };

  if (loading) {
    return (
      <div className="mis-pedidos-container">
        <h2>Mis Pedidos</h2>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="mis-pedidos-container">
      <h2>Mis Pedidos</h2>
      
      {pedidos.length === 0 ? (
        <div className="sin-pedidos">
          <p>No tienes pedidos realizados aún.</p>
          <button 
            onClick={() => navigate('/productos')}
            className="btn-continuar-comprando"
          >
            Comenzar a comprar
          </button>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className={`pedido-card estado-${pedido.estado.toLowerCase()}`}>
              <div className="pedido-header">
                <div className="pedido-numero">
                  <strong>Pedido #{pedido.id}</strong>
                </div>
                <div 
                  className="pedido-estado"
                  style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                >
                  {getEstadoTexto(pedido.estado)}
                </div>
              </div>
              
              <div className="pedido-info">
                <div className="info-item">
                  <span className="label">Fecha:</span>
                  <span className="value">{formatearFecha(pedido.fecha_pedido)}</span>
                </div>
                
                <div className="info-item">
                  <span className="label">Total:</span>
                  <span className="value total">${pedido.total.toFixed(2)}</span>
                </div>
                
                <div className="info-item">
                  <span className="label">Tipo de entrega:</span>
                  <span className="value tipo-entrega">{pedido.tipo_entrega}</span>
                </div>

                {/* Mostrar transportista si es entrega a domicilio y está asignado */}
                {pedido.tipo_entrega === 'domicilio' && pedido.transportista && (
                  <div className="info-item">
                    <span className="label">Transportista:</span>
                    <span className="value transportista">
                      {pedido.transportista.nombre} - {pedido.transportista.contacto || 'Sin contacto'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="pedido-acciones">
                {/* Botón para cancelar (solo si está pendiente) */}
                {puedeSerCancelado(pedido) && (
                  <button 
                    className="btn-cancelar"
                    onClick={() => cancelarPedido(pedido.id)}
                    disabled={procesando === pedido.id}
                  >
                    {procesando === pedido.id ? 'Cancelando...' : 'Cancelar pedido'}
                  </button>
                )}

                {/* Botón para marcar como recibido (solo si está entregado) */}
                {puedeSerMarcadoComoRecibido(pedido) && (
                  <button 
                    className="btn-recibido"
                    onClick={() => marcarComoRecibido(pedido.id)}
                    disabled={procesando === pedido.id}
                  >
                    {procesando === pedido.id ? 'Procesando...' : 'Marcar como recibido'}
                  </button>
                )}

                <button 
                  className="btn-ver-detalle"
                  onClick={() => abrirModal(pedido)}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="acciones-container">
        <button 
          onClick={() => navigate('/productos')}
          className="btn-seguir-comprando"
        >
          Continuar comprando
        </button>
      </div>

      {/* Modal de detalles del pedido */}
      {mostrarModal && pedidoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalles del Pedido #{pedidoSeleccionado.id}</h3>
              <button className="btn-cerrar" onClick={cerrarModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="pedido-detalle-info">
                <div className="info-section">
                  <h4>Información del Pedido</h4>
                  <div className="info-grid">
                    <div className="info-item-modal">
                      <span className="label">Estado:</span>
                      <span 
                        className="value estado-badge"
                        style={{ backgroundColor: getEstadoColor(pedidoSeleccionado.estado) }}
                      >
                        {getEstadoTexto(pedidoSeleccionado.estado)}
                      </span>
                    </div>
                    <div className="info-item-modal">
                      <span className="label">Fecha:</span>
                      <span className="value">{formatearFecha(pedidoSeleccionado.fecha_pedido)}</span>
                    </div>
                    <div className="info-item-modal">
                      <span className="label">Tipo de entrega:</span>
                      <span className="value">{pedidoSeleccionado.tipo_entrega === 'domicilio' ? 'A domicilio' : 'Retiro en sucursal'}</span>
                    </div>
                    {pedidoSeleccionado.transportista && (
                      <div className="info-item-modal">
                        <span className="label">Transportista:</span>
                        <span className="value">{pedidoSeleccionado.transportista.nombre} - {pedidoSeleccionado.transportista.contacto || 'Sin contacto'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="productos-section">
                  <h4>Productos del Pedido</h4>
                  {pedidoSeleccionado.lineasPed && pedidoSeleccionado.lineasPed.length > 0 ? (
                    <div className="productos-lista">
                      {pedidoSeleccionado.lineasPed.map((linea) => (
                        <div key={linea.id} className="producto-item">
                          <div className="producto-imagen-container">
                            <img 
                              src={linea.productos[0]?.imagen || '/placeholder-product.svg'} 
                              alt={linea.productos[0]?.nombre || 'Producto'}
                              className="producto-imagen-modal"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-product.svg';
                              }}
                            />
                          </div>
                          <div className="producto-info">
                            <div className="producto-nombre">
                              {linea.productos[0]?.nombre || 'Producto sin nombre'}
                            </div>
                            <div className="producto-detalles">
                              <span className="cantidad">Cantidad: {linea.cantidad}</span>
                              <span className="precio-unitario">Precio unitario: ${linea.precio_unitario.toFixed(2)}</span>
                              <span className="subtotal">Subtotal: ${(Number(linea.cantidad) * linea.precio_unitario).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="sin-productos">No hay productos registrados para este pedido</p>
                  )}
                </div>

                <div className="total-section">
                  <div className="total-final">
                    <span className="total-label">Total del Pedido:</span>
                    <span className="total-valor">${pedidoSeleccionado.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cerrar-modal" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
