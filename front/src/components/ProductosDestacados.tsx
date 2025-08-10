import React, { useState, useEffect } from "react";
import { pedidoService } from "../services/pedidoService";

interface ProductoDestacado {
  id: number;
  nombre: string;
  imagen?: string;
  cantidad: number;
  pedidos: number;
  precio?: number;
  precio_oferta?: number;
  stock?: number;
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
}

interface ProductosDestacadosProps {
  mostrarEstadisticas?: boolean;
  limite?: number;
  onProductosCalculados?: (productos: ProductoDestacado[], stats: any) => void;
}

const ProductosDestacados: React.FC<ProductosDestacadosProps> = ({
  mostrarEstadisticas = true,
  limite = 15, // Aumentar límite por defecto
  onProductosCalculados
}) => {
  const [productosDestacados, setProductosDestacados] = useState<ProductoDestacado[]>([]);
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState({
    totalUnidadesVendidas: 0,
    totalProductosDiferentes: 0,
    promedioPorProducto: 0
  });

  useEffect(() => {
    cargarProductosDestacados();
  }, []);

  const calcularProductosPopulares = async (pedidos: Pedido[]): Promise<ProductoDestacado[]> => {
    const productosVendidos: { [key: number]: ProductoDestacado } = {};

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

    // Obtener información de precios y stock para cada producto
    const productosConPrecios = await Promise.all(
      Object.values(productosVendidos).map(async (producto) => {
        try {
          const response = await fetch(`/api/producto/${producto.id}`);
          if (response.ok) {
            const data = await response.json();
            return {
              ...producto,
              precio: data.data.precio,
              precio_oferta: data.data.precio_oferta,
              stock: data.data.cantidad
            };
          }
        } catch (error) {
          console.error(`Error fetching data for product ${producto.id}:`, error);
        }
        return producto;
      })
    );

    return productosConPrecios.sort((a, b) => b.cantidad - a.cantidad);
  };

  const cargarProductosDestacados = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Obtener pedidos para calcular productos destacados
      const pedidosResponse = await pedidoService.obtenerPedidosUsuario(token || '');
      const pedidos = pedidosResponse.data || [];
      
      const productosCalculados = await calcularProductosPopulares(pedidos);
      const productosLimitados = productosCalculados.slice(0, limite);
      
      setProductosDestacados(productosLimitados);
      
      // Calcular estadísticas
      const totalUnidadesVendidas = productosCalculados.reduce((total, producto) => total + producto.cantidad, 0);
      const totalProductosDiferentes = productosCalculados.length;
      const promedioPorProducto = totalProductosDiferentes > 0 ? Math.round(totalUnidadesVendidas / totalProductosDiferentes) : 0;
      
      const stats = {
        totalUnidadesVendidas,
        totalProductosDiferentes,
        promedioPorProducto
      };
      
      setEstadisticas(stats);
      
      // Callback para componentes padre
      if (onProductosCalculados) {
        onProductosCalculados(productosLimitados, stats);
      }
      
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
      setProductosDestacados([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#666'
      }}>
        <p>Cargando productos destacados...</p>
      </div>
    );
  }

  if (productosDestacados.length === 0) {
    return (
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6', 
        padding: '15px', 
        borderRadius: '5px',
        color: '#6c757d'
      }}>
        📈 No hay datos suficientes para mostrar estadísticas de productos populares
      </div>
    );
  }

  return (
    <div>
      {mostrarEstadisticas && (
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
                {estadisticas.totalUnidadesVendidas}
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
                {estadisticas.totalProductosDiferentes}
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
                {estadisticas.promedioPorProducto}
              </h4>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                Promedio por producto
              </p>
            </div>
          </div>
        </>
      )}

      <div className="productos-populares-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '15px' 
      }}>
        {productosDestacados.map((producto, index) => {
          // Función para obtener color del badge según posición
          const getBadgeColor = (position: number) => {
            if (position === 0) return '#FFD700'; // Oro
            if (position === 1) return '#C0C0C0'; // Plata
            if (position === 2) return '#CD7F32'; // Bronce
            if (position < 5) return '#9b59b6';   // Púrpura para top 5
            if (position < 10) return '#3498db';  // Azul para top 10
            return '#95a5a6'; // Gris para el resto
          };

          const getBadgeText = (position: number) => {
            if (position === 0) return '🥇 #1';
            if (position === 1) return '🥈 #2';
            if (position === 2) return '🥉 #3';
            if (position < 5) return `⭐ #${position + 1}`;
            if (position < 10) return `🔥 #${position + 1}`;
            return `💎 #${position + 1}`;
          };

          return (
            <div key={producto.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}>
              {/* Badge de posición mejorado */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: getBadgeColor(index),
                color: 'white',
                borderRadius: '20px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                border: '2px solid white'
              }}>
                {getBadgeText(index)}
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

              <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '16px', textAlign: 'center' }}>
                {producto.nombre}
              </h4>
              
              {/* Precio */}
              <div style={{ margin: '10px 0', fontSize: '16px', color: '#000', textAlign: 'center' }}>
                {producto.precio_oferta && producto.precio_oferta > 0 ? (
                  <>
                    <span style={{ textDecoration: 'line-through', color: '#888', marginRight: '8px' }}>
                      ${producto.precio?.toLocaleString()}
                    </span>
                    <span style={{ color: '#000' }}>
                      ${producto.precio_oferta.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span>
                    ${producto.precio?.toLocaleString() || 'Consultar'}
                  </span>
                )}
              </div>
              
              {/* Precio sin impuestos */}
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', textAlign: 'center' }}>
                Precio sin impuestos: ${((producto.precio_oferta && producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio || 0) / 1.21).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </div>
              
              {/* Stock */}
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px', textAlign: 'center' }}>
                Stock: {producto.stock !== undefined ? producto.stock : 'Consultando...'}
              </div>
              
              <div style={{ fontSize: '14px', color: '#666' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong> Unidades vendidas:</strong> 
                  <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '16px', marginLeft: '5px' }}>
                    {producto.cantidad}
                  </span>
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong> Aparece en pedidos:</strong> 
                  <span style={{ color: '#3498db', fontWeight: 'bold', marginLeft: '5px' }}>
                    {producto.pedidos}
                  </span>
                </p>
                <p style={{ margin: '5px 0', fontSize: '12px' }}>
                  <strong>Porcentaje del total:</strong> 
                  <span style={{ color: '#8e44ad', fontWeight: 'bold', marginLeft: '5px' }}>
                    {estadisticas.totalUnidadesVendidas > 0 ? 
                      ((producto.cantidad / estadisticas.totalUnidadesVendidas) * 100).toFixed(1) : 0}%
                  </span>
                </p>
              </div>

              {/* Barra de progreso visual mejorada */}
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  backgroundColor: '#ecf0f1',
                  borderRadius: '10px',
                  height: '10px',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    backgroundColor: getBadgeColor(index),
                    height: '100%',
                    width: `${productosDestacados[0] ? (producto.cantidad / productosDestacados[0].cantidad) * 100 : 0}%`,
                    borderRadius: '10px',
                    transition: 'width 0.5s ease',
                    background: `linear-gradient(90deg, ${getBadgeColor(index)}, ${getBadgeColor(index)}dd)`
                  }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductosDestacados;
