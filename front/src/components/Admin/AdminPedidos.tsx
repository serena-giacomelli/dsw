import React, { useState, useEffect } from "react";
import { pedidoService } from "../../services/pedidoService";
import { pagoService, Pago } from "../../services/pagoService";
import { transportistaService } from "../../../services/transportistaService";
import "../../styles/AdminPedidos.css";
import "../../styles/placeholder.css";

interface Transportista {
  id: number;
  nombre: string;
  contacto?: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  mail: string;
}

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
  usuarios: Usuario[];
  lineasPed: LineaPedido[];
  transportista?: Transportista;
  pagos?: Pago[];
}

const AdminPedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [transportistas, setTransportistas] = useState<Transportista[]>([]);
  const [pagosPendientes, setPagosPendientes] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  const [mostrarGestionPagos, setMostrarGestionPagos] = useState(false);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', token ? 'Sí' : 'No');
      if (!token) return;

      console.log('Iniciando carga de datos...');
      const [pedidosResponse, transportistasData, pagosPendientesResponse] = await Promise.all([
        pedidoService.obtenerPedidosUsuario(token), // Este endpoint ya maneja admin vs usuario
        transportistaService.obtenerTransportistas(),
        pagoService.obtenerPagosPendientes(token)
      ]);

      console.log('Respuesta de pedidos:', pedidosResponse);
      console.log('Datos de transportistas:', transportistasData);
      console.log('Respuesta de pagos pendientes:', pagosPendientesResponse);

      setPedidos(pedidosResponse.data || []);
      setTransportistas(transportistasData || []);
      setPagosPendientes(pagosPendientesResponse.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarPedido = async (pedidoId: number) => {
    try {
      setProcesando(pedidoId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/api/pedido/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'completado' })
      });

      if (response.ok) {
        // Actualizar el estado local
        setPedidos(prev => prev.map(pedido => 
          pedido.id === pedidoId 
            ? { ...pedido, estado: 'completado' }
            : pedido
        ));
        alert('Pedido confirmado para retiro en sucursal');
      } else {
        throw new Error('Error al confirmar pedido');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al confirmar el pedido');
    } finally {
      setProcesando(null);
    }
  };

  const asignarTransportista = async (pedidoId: number, transportistaId: number) => {
    try {
      setProcesando(pedidoId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/api/pedido/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          transportista: transportistaId,
          estado: 'entregado'
        })
      });

      if (response.ok) {
        const transportistaSeleccionado = transportistas.find(t => t.id === transportistaId);
        
        // Actualizar el estado local
        setPedidos(prev => prev.map(pedido => 
          pedido.id === pedidoId 
            ? { 
                ...pedido, 
                estado: 'entregado',
                transportista: transportistaSeleccionado
              }
            : pedido
        ));
        alert('Transportista asignado y pedido marcado como entregado');
      } else {
        throw new Error('Error al asignar transportista');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al asignar transportista');
    } finally {
      setProcesando(null);
    }
  };

  // Funciones para gestión de pagos
  const aprobarPago = async (pagoId: number, comentarios: string = '') => {
    try {
      setProcesando(pagoId);
      const token = localStorage.getItem('token');
      
      await pagoService.aprobarPago(pagoId, comentarios, token!);
      
      // Recargar datos para reflejar los cambios
      await cargarDatos();
      alert('Pago aprobado exitosamente');
    } catch (error) {
      console.error('Error al aprobar pago:', error);
      alert('Error al aprobar el pago');
    } finally {
      setProcesando(null);
    }
  };

  const rechazarPago = async (pagoId: number, comentarios: string) => {
    if (!comentarios.trim()) {
      alert('Los comentarios son obligatorios al rechazar un pago');
      return;
    }

    try {
      setProcesando(pagoId);
      const token = localStorage.getItem('token');
      
      await pagoService.rechazarPago(pagoId, comentarios, token!);
      
      // Recargar datos para reflejar los cambios
      await cargarDatos();
      alert('Pago rechazado');
    } catch (error) {
      console.error('Error al rechazar pago:', error);
      alert('Error al rechazar el pago');
    } finally {
      setProcesando(null);
    }
  };

  const manejarAprobacionPago = (pago: Pago) => {
    const comentarios = prompt('Comentarios para la aprobación (opcional):');
    if (comentarios !== null) { // null significa que canceló
      aprobarPago(pago.id, comentarios);
    }
  };

  const manejarRechazosPago = (pago: Pago) => {
    const comentarios = prompt('Motivo del rechazo (obligatorio):');
    if (comentarios && comentarios.trim()) {
      rechazarPago(pago.id, comentarios);
    } else if (comentarios !== null) {
      alert('El motivo del rechazo es obligatorio');
    }
  };

  const obtenerNombreMetodoPago = (metodo: number) => {
    switch (metodo) {
      case 1:
        return 'Transferencia';
      case 2:
        return 'Tarjeta';
      default:
        return 'Desconocido';
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
      case 'pago_aprobado':
        return '#9b59b6'; // Púrpura para estado intermedio
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
      case 'pago_aprobado':
        return 'Pago Aprobado';
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

  // Función para calcular productos más populares
  const calcularProductosPopulares = () => {
    const productosVendidos: { [key: number]: { 
      id: number, 
      nombre: string, 
      cantidad: number, 
      pedidos: number,
      imagen?: string 
    } } = {};

    // Solo contar pedidos completados para estadísticas reales
    const pedidosCompletados = pedidos.filter(pedido => 
      pedido.estado === 'completado' || pedido.estado === 'entregado'
    );

    pedidosCompletados.forEach(pedido => {
      pedido.lineasPed.forEach(linea => {
        const producto = linea.productos[0];
        if (producto) {
          if (!productosVendidos[producto.id]) {
            productosVendidos[producto.id] = {
              id: producto.id,
              nombre: producto.nombre,
              cantidad: 0,
              pedidos: 0,
              imagen: producto.imagen
            };
          }
          productosVendidos[producto.id].cantidad += Number(linea.cantidad);
          productosVendidos[producto.id].pedidos += 1;
        }
      });
    });

    return Object.values(productosVendidos)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10); // Top 10 productos
  };

  if (loading) {
    return (
      <div className="admin-pedidos-container">
        <h2>Panel de Gestión</h2>
        <p>Cargando datos...</p>
      </div>
    );
  }

  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente');
  const pedidosPagoAprobado = pedidos.filter(p => p.estado === 'pago_aprobado');
  const pedidosEntregados = pedidos.filter(p => p.estado === 'entregado');
  const pedidosCompletados = pedidos.filter(p => p.estado === 'completado');
  const pedidosCancelados = pedidos.filter(p => p.estado === 'cancelado');

  return (
    <div className="admin-pedidos-container">
      <h2>Panel de Gestión</h2>
      
      {/* Botones principales de navegación */}
      <div style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        gap: '20px', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        border: '1px solid #dee2e6'
      }}>
        <button 
          onClick={() => {
            setMostrarPedidos(!mostrarPedidos);
            setMostrarGestionPagos(false);
            setMostrarEstadisticas(false);
          }}
          style={{
            backgroundColor: mostrarPedidos ? '#e74c3c' : '#3498db',
            color: 'white',
            padding: '15px 25px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '200px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          📦 {mostrarPedidos ? 'Ocultar Pedidos' : 'Mostrar Pedidos'}
          {(pedidosPendientes.length + pedidosPagoAprobado.length) > 0 && (
            <span style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 8px',
              fontSize: '12px',
              marginLeft: '10px'
            }}>
              {pedidosPendientes.length + pedidosPagoAprobado.length}
            </span>
          )}
        </button>

        <button 
          onClick={() => {
            setMostrarGestionPagos(!mostrarGestionPagos);
            setMostrarPedidos(false);
            setMostrarEstadisticas(false);
          }}
          style={{
            backgroundColor: mostrarGestionPagos ? '#e74c3c' : '#f39c12',
            color: 'white',
            padding: '15px 25px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '200px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          💳 {mostrarGestionPagos ? 'Ocultar Pagos' : 'Mostrar Pagos'}
          {pagosPendientes.length > 0 && (
            <span style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '50%',
              padding: '2px 8px',
              fontSize: '12px',
              marginLeft: '10px'
            }}>
              {pagosPendientes.length}
            </span>
          )}
        </button>

        <button 
          onClick={() => {
            setMostrarEstadisticas(!mostrarEstadisticas);
            setMostrarPedidos(false);
            setMostrarGestionPagos(false);
          }}
          style={{
            backgroundColor: mostrarEstadisticas ? '#e74c3c' : '#16a085',
            color: 'white',
            padding: '15px 25px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            minWidth: '200px',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          📊 {mostrarEstadisticas ? 'Ocultar Productos' : 'Productos Destacados'}
        </button>
      </div>

      {/* Gestión de Pagos */}
      {mostrarGestionPagos && (
        <div className="seccion-pagos" style={{ marginBottom: '30px' }}>
          <h3>Gestión de Pagos Pendientes ({pagosPendientes.length})</h3>
          <p className="seccion-descripcion">Pagos que requieren aprobación o rechazo del administrador</p>
          
          {pagosPendientes.length === 0 ? (
            <div style={{ 
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb', 
              padding: '15px', 
              borderRadius: '5px',
              color: '#155724'
            }}>
              ✅ No hay pagos pendientes de revisión
            </div>
          ) : (
            <div className="pagos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
              {pagosPendientes.map((pago) => (
                <div key={pago.id} className="pago-card" style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <div className="pago-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                      💳 Pago #{pago.id} 
                      <span style={{
                        backgroundColor: '#f39c12',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        marginLeft: '10px'
                      }}>
                        {pago.estado.toUpperCase()}
                      </span>
                    </h4>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      <strong>Método:</strong> {obtenerNombreMetodoPago(pago.metodo_pago)}
                    </p>
                    {pago.monto && (
                      <p style={{ margin: '5px 0', color: '#27ae60', fontWeight: 'bold', fontSize: '16px' }}>
                        <strong>Monto:</strong> ${pago.monto.toFixed(2)}
                      </p>
                    )}
                    {pago.fecha_pago && (
                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Fecha:</strong> {new Date(pago.fecha_pago).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>

                  {/* Información del pedido asociado */}
                  {pago.pedidos && pago.pedidos.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#34495e' }}>📦 Pedido Asociado:</h5>
                      {pago.pedidos.map((pedido) => (
                        <div key={pedido.id} style={{ 
                          backgroundColor: '#f8f9fa', 
                          padding: '10px', 
                          borderRadius: '5px',
                          fontSize: '14px'
                        }}>
                          <p style={{ margin: '2px 0' }}><strong>Pedido:</strong> #{pedido.id}</p>
                          <p style={{ margin: '2px 0' }}><strong>Total:</strong> ${pedido.total?.toFixed(2) || 'N/A'}</p>
                          <p style={{ margin: '2px 0' }}><strong>Estado:</strong> {pedido.estado || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Información del cliente */}
                  {pago.usuarios && pago.usuarios.length > 0 && (
                    <div style={{ marginBottom: '15px' }}>
                      <h5 style={{ margin: '0 0 10px 0', color: '#34495e' }}>👤 Cliente:</h5>
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '5px',
                        fontSize: '14px'
                      }}>
                        <p style={{ margin: '2px 0' }}>
                          <strong>Nombre:</strong> {pago.usuarios[0]?.nombre} {pago.usuarios[0]?.apellido}
                        </p>
                        <p style={{ margin: '2px 0' }}>
                          <strong>Email:</strong> {pago.usuarios[0]?.mail}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Información adicional del pago */}
                  {pago.numero_referencia && (
                    <div style={{ marginBottom: '15px' }}>
                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                        <strong>Referencia:</strong> {pago.numero_referencia}
                      </p>
                    </div>
                  )}

                  {/* Acciones del pago */}
                  <div className="pago-acciones" style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #eee'
                  }}>
                    <button
                      onClick={() => manejarAprobacionPago(pago)}
                      disabled={procesando === pago.id}
                      style={{
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        flex: 1
                      }}
                    >
                      {procesando === pago.id ? 'Procesando...' : '✅ Aprobar'}
                    </button>
                    <button
                      onClick={() => manejarRechazosPago(pago)}
                      disabled={procesando === pago.id}
                      style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        flex: 1
                      }}
                    >
                      {procesando === pago.id ? 'Procesando...' : '❌ Rechazar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Estadísticas de Productos Populares */}
      {mostrarEstadisticas && (
        <div className="seccion-estadisticas" style={{ marginBottom: '30px' }}>
          <h3>📊 Productos Más Populares</h3>
          <p className="seccion-descripcion">
            Basado en productos vendidos en pedidos completados y entregados
          </p>
          
          {(() => {
            const productosPopulares = calcularProductosPopulares();
            const totalUnidadesVendidas = productosPopulares.reduce((total, producto) => total + producto.cantidad, 0);
            const totalPedidosConProductos = productosPopulares.reduce((total, producto) => total + producto.pedidos, 0);
            
            return productosPopulares.length === 0 ? (
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #dee2e6', 
                padding: '15px', 
                borderRadius: '5px',
                color: '#6c757d'
              }}>
                📈 No hay datos suficientes para mostrar estadísticas de productos populares
              </div>
            ) : (
              <>
                {/* Resumen de estadísticas */}
                <div style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    minWidth: '200px',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#27ae60' }}>
                      {totalUnidadesVendidas}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Total unidades vendidas
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    minWidth: '200px',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#3498db' }}>
                      {productosPopulares.length}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Productos diferentes vendidos
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#fff',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    minWidth: '200px',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#f39c12' }}>
                      {Math.round(totalUnidadesVendidas / productosPopulares.length)}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                      Promedio por producto
                    </p>
                  </div>
                </div>

                <div className="productos-populares-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '15px' 
                }}>
                  {productosPopulares.map((producto, index) => (
                    <div key={producto.id} style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '15px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}>
                      {/* Badge de posición */}
                      <div style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: index < 3 ? '#f39c12' : '#95a5a6',
                        color: 'white',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        #{index + 1}
                      </div>

                      {/* Imagen del producto */}
                      {producto.imagen && (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                            marginBottom: '10px'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.svg';
                          }}
                        />
                      )}

                      <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                        {producto.nombre}
                      </h4>
                      
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        <p style={{ margin: '5px 0' }}>
                          <strong>📦 Unidades vendidas:</strong> 
                          <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '16px', marginLeft: '5px' }}>
                            {producto.cantidad}
                          </span>
                        </p>
                        <p style={{ margin: '5px 0' }}>
                          <strong>🛒 Aparece en pedidos:</strong> 
                          <span style={{ color: '#3498db', fontWeight: 'bold', marginLeft: '5px' }}>
                            {producto.pedidos}
                          </span>
                        </p>
                        <p style={{ margin: '5px 0', fontSize: '12px' }}>
                          <strong>📊 Porcentaje del total:</strong> 
                          <span style={{ color: '#8e44ad', fontWeight: 'bold', marginLeft: '5px' }}>
                            {((producto.cantidad / totalUnidadesVendidas) * 100).toFixed(1)}%
                          </span>
                        </p>
                      </div>

                      {/* Barra de progreso visual */}
                      <div style={{ marginTop: '10px' }}>
                        <div style={{
                          backgroundColor: '#ecf0f1',
                          borderRadius: '10px',
                          height: '8px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            backgroundColor: index < 3 ? '#f39c12' : '#3498db',
                            height: '100%',
                            width: `${(producto.cantidad / productosPopulares[0].cantidad) * 100}%`,
                            borderRadius: '10px',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
      
      {/* Sección de Pedidos - Solo mostrar cuando mostrarPedidos sea true */}
      {mostrarPedidos && (
        <div className="seccion-completa-pedidos">
          {/* Pedidos Pendientes */}
          <div className="seccion-pedidos">
        <h3>Pedidos Pendientes ({pedidosPendientes.length})</h3>
        <p className="seccion-descripcion">Estos pedidos están esperando confirmación de pago</p>
        {pedidosPendientes.length === 0 ? (
          <p>No hay pedidos pendientes</p>
        ) : (
          <div className="pedidos-grid">
            {pedidosPendientes.map((pedido) => (
              <div key={pedido.id} className="pedido-admin-card">
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
                    <span className="label">Cliente:</span>
                    <span className="value">
                      {pedido.usuarios[0]?.nombre} {pedido.usuarios[0]?.apellido}
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{pedido.usuarios[0]?.mail}</span>
                  </div>
                  
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
                    <span className="value tipo-entrega">
                      {pedido.tipo_entrega === 'domicilio' ? 'A domicilio' : 'Retiro en sucursal'}
                    </span>
                  </div>

                  {/* Información de pago */}
                  {pedido.pagos && pedido.pagos.length > 0 && (
                    <div className="info-item">
                      <span className="label">Estado del pago:</span>
                      <span 
                        className="value"
                        style={{
                          color: pedido.pagos[0].estado === 'aprobado' ? '#27ae60' : 
                                 pedido.pagos[0].estado === 'rechazado' ? '#e74c3c' : '#f39c12',
                          fontWeight: 'bold'
                        }}
                      >
                        {pedido.pagos[0].estado === 'pendiente' ? '⏳ Pendiente' :
                         pedido.pagos[0].estado === 'aprobado' ? '✅ Aprobado' :
                         pedido.pagos[0].estado === 'rechazado' ? '❌ Rechazado' : pedido.pagos[0].estado}
                        {pedido.pagos[0].metodo_pago && ` (${obtenerNombreMetodoPago(pedido.pagos[0].metodo_pago)})`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Productos del pedido */}
                <div className="productos-pedido">
                  <h4>Productos:</h4>
                  <div className="productos-lista">
                    {pedido.lineasPed.map((linea) => (
                      <div key={linea.id} className="producto-item-admin">
                        <div className="producto-imagen">
                          <img 
                            src={linea.productos[0]?.imagen || '/placeholder-product.svg'} 
                            alt={linea.productos[0]?.nombre || 'Producto'}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.svg';
                            }}
                          />
                        </div>
                        <div className="producto-detalles-admin">
                          <span className="producto-nombre">{linea.productos[0]?.nombre}</span>
                          <span className="producto-cantidad">Cantidad: {linea.cantidad}</span>
                          <span className="producto-precio">Precio: ${linea.precio_unitario}</span>
                          <span className="producto-subtotal">Subtotal: ${(Number(linea.cantidad) * linea.precio_unitario).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Pedidos con Pago Aprobado - Requieren gestión de entrega */}
      <div className="seccion-pedidos">
        <h3>Pedidos con Pago Aprobado ({pedidosPagoAprobado.length})</h3>
        <p className="seccion-descripcion">Pedidos con pago aprobado que requieren asignación de transportista o aprobación de retiro</p>
        {pedidosPagoAprobado.length === 0 ? (
          <p>No hay pedidos con pago aprobado pendientes de gestión</p>
        ) : (
          <div className="pedidos-grid">
            {pedidosPagoAprobado.map((pedido) => (
              <div key={pedido.id} className="pedido-admin-card pago-aprobado" style={{ borderLeft: '4px solid #9b59b6' }}>
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
                    <span className="label">Cliente:</span>
                    <span className="value">
                      {pedido.usuarios[0]?.nombre} {pedido.usuarios[0]?.apellido}
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{pedido.usuarios[0]?.mail}</span>
                  </div>
                  
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
                    <span className="value tipo-entrega">
                      {pedido.tipo_entrega === 'domicilio' ? 'A domicilio' : 'Retiro en sucursal'}
                    </span>
                  </div>

                  {/* Información de pago */}
                  {pedido.pagos && pedido.pagos.length > 0 && (
                    <div className="info-item">
                      <span className="label">Estado del pago:</span>
                      <span 
                        className="value"
                        style={{
                          color: pedido.pagos[0].estado === 'aprobado' ? '#27ae60' : 
                                 pedido.pagos[0].estado === 'rechazado' ? '#e74c3c' : '#f39c12',
                          fontWeight: 'bold'
                        }}
                      >
                        {pedido.pagos[0].estado === 'pendiente' ? '⏳ Pendiente' :
                         pedido.pagos[0].estado === 'aprobado' ? '✅ Aprobado' :
                         pedido.pagos[0].estado === 'rechazado' ? '❌ Rechazado' : pedido.pagos[0].estado}
                        {pedido.pagos[0].metodo_pago && ` (${obtenerNombreMetodoPago(pedido.pagos[0].metodo_pago)})`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Productos del pedido */}
                <div className="productos-pedido">
                  <h4>Productos:</h4>
                  <div className="productos-lista">
                    {pedido.lineasPed.map((linea) => (
                      <div key={linea.id} className="producto-item-admin">
                        <div className="producto-imagen">
                          <img 
                            src={linea.productos[0]?.imagen || '/placeholder-product.svg'} 
                            alt={linea.productos[0]?.nombre || 'Producto'}
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.svg';
                            }}
                          />
                        </div>
                        <div className="producto-detalles-admin">
                          <span className="producto-nombre">{linea.productos[0]?.nombre}</span>
                          <span className="producto-cantidad">Cantidad: {linea.cantidad}</span>
                          <span className="producto-precio">Precio: ${linea.precio_unitario}</span>
                          <span className="producto-subtotal">Subtotal: ${(Number(linea.cantidad) * linea.precio_unitario).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Acción según tipo de entrega */}
                <div className="pedido-acciones">
                  {pedido.tipo_entrega === 'domicilio' ? (
                    <div className="asignar-transportista">
                      <label>Asignar transportista para entrega:</label>
                      <select 
                        onChange={(e) => {
                          if (e.target.value) {
                            asignarTransportista(pedido.id, Number(e.target.value));
                          }
                        }}
                        disabled={procesando === pedido.id}
                      >
                        <option value="">Seleccionar transportista</option>
                        {transportistas.map((transportista) => (
                          <option key={transportista.id} value={transportista.id}>
                            {transportista.nombre} - {transportista.contacto || 'Sin contacto'}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <button 
                      className="btn-confirmar"
                      onClick={() => confirmarPedido(pedido.id)}
                      disabled={procesando === pedido.id}
                      style={{
                        backgroundColor: '#9b59b6',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      {procesando === pedido.id ? 'Procesando...' : '🏪 Aprobar retiro en sucursal'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pedidos Entregados */}
      <div className="seccion-pedidos">
        <h3>Pedidos Entregados ({pedidosEntregados.length})</h3>
        <p className="seccion-descripcion">Pedidos entregados esperando confirmación del cliente</p>
        {pedidosEntregados.length === 0 ? (
          <p>No hay pedidos entregados pendientes de confirmación</p>
        ) : (
          <div className="pedidos-grid">
            {pedidosEntregados.map((pedido) => (
              <div key={pedido.id} className="pedido-admin-card entregado">
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
                    <span className="label">Cliente:</span>
                    <span className="value">
                      {pedido.usuarios[0]?.nombre} {pedido.usuarios[0]?.apellido}
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{pedido.usuarios[0]?.mail}</span>
                  </div>
                  
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
                    <span className="value tipo-entrega">
                      {pedido.tipo_entrega === 'domicilio' ? 'A domicilio' : 'Retiro en sucursal'}
                    </span>
                  </div>

                  {/* Mostrar transportista si es entrega a domicilio */}
                  {pedido.tipo_entrega === 'domicilio' && pedido.transportista && (
                    <div className="info-item">
                      <span className="label">Transportista:</span>
                      <span className="value">
                        {pedido.transportista.nombre} - {pedido.transportista.contacto || 'Sin contacto'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pedidos Completados */}
      <div className="seccion-pedidos">
        <h3>Pedidos Completados ({pedidosCompletados.length})</h3>
        <p className="seccion-descripcion">Pedidos finalizados y confirmados por los clientes</p>
        {pedidosCompletados.length === 0 ? (
          <p>No hay pedidos completados</p>
        ) : (
          <div className="pedidos-grid">
            {pedidosCompletados.slice(0, 10).map((pedido) => (
              <div key={pedido.id} className="pedido-admin-card completado">
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
                    <span className="label">Cliente:</span>
                    <span className="value">
                      {pedido.usuarios[0]?.nombre} {pedido.usuarios[0]?.apellido}
                    </span>
                  </div>
                  
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
                    <span className="value tipo-entrega">
                      {pedido.tipo_entrega === 'domicilio' ? 'A domicilio' : 'Retiro en sucursal'}
                    </span>
                  </div>

                  {/* Mostrar transportista si es entrega a domicilio */}
                  {pedido.tipo_entrega === 'domicilio' && pedido.transportista && (
                    <div className="info-item">
                      <span className="label">Transportista:</span>
                      <span className="value">
                        {pedido.transportista.nombre} - {pedido.transportista.contacto || 'Sin contacto'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pedidos Cancelados */}
      <div className="seccion-pedidos">
        <h3>Pedidos Cancelados ({pedidosCancelados.length})</h3>
        <p className="seccion-descripcion">Pedidos cancelados por los clientes o por rechazo de pago</p>
        {pedidosCancelados.length === 0 ? (
          <p>No hay pedidos cancelados</p>
        ) : (
          <div className="pedidos-grid">
            {pedidosCancelados.slice(0, 10).map((pedido) => (
              <div key={pedido.id} className="pedido-admin-card cancelado">
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
                    <span className="label">Cliente:</span>
                    <span className="value">
                      {pedido.usuarios[0]?.nombre} {pedido.usuarios[0]?.apellido}
                    </span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{pedido.usuarios[0]?.mail}</span>
                  </div>
                  
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
                    <span className="value tipo-entrega">
                      {pedido.tipo_entrega === 'domicilio' ? 'A domicilio' : 'Retiro en sucursal'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
};

export default AdminPedidos;
