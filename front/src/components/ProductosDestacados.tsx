import React, { useState, useEffect } from "react";
import { pedidoService } from "../services/pedidoService";
import "../styles/ProductosDestacadosAdmin.css";
         
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
  limite = 15,
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

  // Cambia la función para obtener todos los productos y todos los pedidos
  const cargarProductosDestacados = async () => {
    try {
      // Obtener todos los productos
      const productosResponse = await fetch('/api/producto');
      const productosData = await productosResponse.json();
      const todosLosProductos = productosData.data || [];

      // Obtener todos los pedidos (de todos los usuarios)
      const token = localStorage.getItem('token');
      const pedidosResponse = await fetch('/api/pedido', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      const pedidosData = await pedidosResponse.json();
      const pedidos = pedidosData.data || [];

      // Calcular los productos más pedidos
      const productosVendidos: { [key: number]: ProductoDestacado } = {};

      // Solo contar pedidos completados o entregados
      const pedidosCompletados = pedidos.filter((pedido: any) =>
        pedido.estado === 'completado' || pedido.estado === 'entregado'
      );

      pedidosCompletados.forEach((pedido: any) => {
        (pedido.lineasPed || []).forEach((linea: any) => {
          const producto = (linea.productos && linea.productos[0]) || null;
          if (producto) {
            if (!productosVendidos[producto.id]) {
              // Buscar info extra del producto en todosLosProductos
              const prodInfo = todosLosProductos.find((p: any) => p.id === producto.id) || {};
              productosVendidos[producto.id] = {
                id: producto.id,
                nombre: producto.nombre,
                cantidad: 0,
                pedidos: 0,
                imagen: producto.imagen || prodInfo.imagen,
                precio: prodInfo.precio,
                precio_oferta: prodInfo.precio_oferta,
                stock: prodInfo.cantidad
              };
            }
            productosVendidos[producto.id].cantidad += Number(linea.cantidad);
            productosVendidos[producto.id].pedidos += 1;
          }
        });
      });

      // Ordenar por cantidad vendida
      const productosCalculados = Object.values(productosVendidos).sort((a, b) => b.cantidad - a.cantidad);
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
    if (position === 0) return '#1';
    if (position === 1) return '#2';
    if (position === 2) return '#3';
    if (position < 5) return `#${position + 1}`;
    if (position < 10) return `#${position + 1}`;
    return `#${position + 1}`;
  };

  // Función para obtener la clase de performance según el porcentaje
  const getPerformanceClass = (percentage: number) => {
    if (percentage >= 70) return 'high-performance';
    if (percentage >= 30) return 'medium-performance';
    return 'low-performance';
  };

  if (loading) {
    return (
      <div className="productos-destacados-loading">
        <p>Cargando productos destacados...</p>
      </div>
    );
  }

  if (productosDestacados.length === 0) {
    return (
      <div className="productos-destacados-empty">
        📈 No hay datos suficientes para mostrar estadísticas de productos populares
      </div>
    );
  }

  return (
    <div>
      {mostrarEstadisticas && (
        <>
          <div className="estadisticas-container">
            <div className="estadistica-card estadistica-verde">
              <h4>{estadisticas.totalUnidadesVendidas}</h4>
              <p>Total unidades vendidas</p>
            </div>
            
            <div className="estadistica-card estadistica-azul">
              <h4>{estadisticas.totalProductosDiferentes}</h4>
              <p>Productos diferentes vendidos</p>
            </div>
            
            <div className="estadistica-card estadistica-naranja">
              <h4>{estadisticas.promedioPorProducto}</h4>
              <p>Promedio por producto</p>
            </div>
          </div>
        </>
      )}

      <div className="productos-populares-grid">
        {productosDestacados.map((producto, index) => {
          const porcentajeRelativo = productosDestacados[0] ? 
            (producto.cantidad / productosDestacados[0].cantidad) * 100 : 0;

          return (
            <div key={producto.id} className="producto-card">
              <div 
                className="producto-badge"
                style={{ backgroundColor: getBadgeColor(index) }}
              >
                {getBadgeText(index)}
              </div>

              {producto.imagen && (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="producto-imagen"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.svg';
                  }}
                />
              )}

              <h4 className="producto-titulo">
                {producto.nombre}
              </h4>
              
              <div className="producto-precio">
                {producto.precio_oferta && producto.precio_oferta > 0 ? (
                  <>
                    <span className="precio-tachado">
                      ${producto.precio?.toLocaleString()}
                    </span>
                    <span className="precio-oferta">
                      ${producto.precio_oferta.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span>
                    ${producto.precio?.toLocaleString() || 'Consultar'}
                  </span>
                )}
              </div>
              
              <div className="precio-sin-impuestos">
                Precio sin impuestos: ${((producto.precio_oferta && producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio || 0) / 1.21).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </div>
              
              <div className="producto-stock">
                Stock: {producto.stock !== undefined ? producto.stock : 'Consultando...'}
              </div>
              
              <div className="producto-stats">
                <p>
                  <strong> Unidades vendidas:</strong> 
                  <span className="stat-vendidas">
                    {producto.cantidad}
                  </span>
                </p>
                <p>
                  <strong> Aparece en pedidos:</strong> 
                  <span className="stat-pedidos">
                    {producto.pedidos}
                  </span>
                </p>
                <p className="stat-porcentaje">
                  <strong>Porcentaje del total:</strong> 
                  <span>
                    {estadisticas.totalUnidadesVendidas > 0 ? 
                      ((producto.cantidad / estadisticas.totalUnidadesVendidas) * 100).toFixed(1) : 0}%
                  </span>
                </p>
              </div>

              <div className="progress-container">
                <div className="progress-label">
                  <span className="label-text">Popularidad relativa</span>
                  <span className="percentage-text">
                    {porcentajeRelativo.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${getPerformanceClass(porcentajeRelativo)}`}
                    style={{
                      width: `${porcentajeRelativo}%`
                    }}
                  ></div>
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
