import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Usuario/featuredProductsCarousel.css";

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

const FeaturedProductsCarousel: React.FC = () => {
  const [productosDestacados, setProductosDestacados] = useState<ProductoDestacado[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductosDestacados();
  }, []);

  const cargarProductosDestacados = async () => {
    try {
      // Obtener todos los productos
      const productosResponse = await fetch('/api/producto');
      const productosData = await productosResponse.json();
      const todosLosProductos = productosData.data || [];

      // Obtener estadísticas públicas de productos destacados (sin autenticación)
      const estadisticasResponse = await fetch('/api/pedido/estadisticas-publicas');
      
      if (estadisticasResponse.ok) {
        const estadisticasData = await estadisticasResponse.json();
        const productosConEstadisticas = estadisticasData.data || [];

        if (productosConEstadisticas.length > 0) {
          // Combinar datos de estadísticas con información completa del producto
          const productosDestacadosCompletos = productosConEstadisticas.map((prodStats: any) => {
            const prodInfo = todosLosProductos.find((p: any) => p.id === prodStats.id) || {};
            return {
              id: prodStats.id,
              nombre: prodStats.nombre,
              cantidad: prodStats.cantidad,
              pedidos: prodStats.pedidos,
              imagen: prodStats.imagen || prodInfo.imagen,
              precio: prodInfo.precio,
              precio_oferta: prodInfo.precio_oferta,
              stock: prodInfo.cantidad
            };
          }).slice(0, 6); // Limitar a 6 productos

          console.log('Productos destacados con estadísticas reales:', productosDestacadosCompletos.length);
          setProductosDestacados(productosDestacadosCompletos);
        } else {
          // Sin datos de estadísticas, usar productos con ofertas
          console.log('Sin estadísticas disponibles, mostrando productos con ofertas');
          const productosParaMostrar = todosLosProductos
            .filter((producto: any) => producto.cantidad > 0) // Solo productos con stock
            .sort((a: any, b: any) => {
              // Priorizar productos con precio_oferta
              if (a.precio_oferta > 0 && b.precio_oferta <= 0) return -1;
              if (b.precio_oferta > 0 && a.precio_oferta <= 0) return 1;
              // Si ambos tienen o no tienen oferta, ordenar por ID descendente (más recientes primero)
              return b.id - a.id;
            })
            .slice(0, 6)
            .map((producto: any) => ({
              id: producto.id,
              nombre: producto.nombre,
              cantidad: 0,
              pedidos: 0,
              imagen: producto.imagen,
              precio: producto.precio,
              precio_oferta: producto.precio_oferta,
              stock: producto.cantidad
            }));
          
          setProductosDestacados(productosParaMostrar);
        }
      } else {
        throw new Error('No se pudieron cargar las estadísticas');
      }
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
      setProductosDestacados([]);
    } finally {
      setLoading(false);
    }
  };

  const manejarClickProducto = (productoId: number) => {
    navigate(`/producto/${productoId}`);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= Math.ceil(productosDestacados.length / 4) ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.ceil(productosDestacados.length / 4) - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="featured-carousel-container">
        <div className="loading-message">
          <p>Cargando productos destacados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-carousel-container">
      {productosDestacados.length === 0 ? (
        <div className="no-products-message">
          <p>No hay productos destacados disponibles en este momento</p>
        </div>
      ) : (
        <>
          <div className="carousel-wrapper">
            <button 
              className="carousel-nav carousel-nav-prev" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              type="button"
              aria-label="Productos anteriores"
            >
              &#8249;
            </button>
            
            <div className="carousel-track-container">
              <div 
                className="carousel-track"
                style={{ 
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: 'transform 0.5s ease'
                }}
              >
                {Array.from({ length: Math.ceil(productosDestacados.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="carousel-slide">
                    {productosDestacados
                      .slice(slideIndex * 4, slideIndex * 4 + 4)
                      .map((producto, index) => {
                        const globalIndex = slideIndex * 4 + index;

                        return (
                          <div 
                            key={producto.id} 
                            className="producto-card"
                            onClick={() => manejarClickProducto(producto.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={producto.imagen || '/placeholder-product.svg'}
                              alt={producto.nombre}
                              className="product-image"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-product.svg';
                              }}
                            />
                            
                            <div className="product-name">{producto.nombre}</div>
                            
                            <div className="product-prices" style={{ textAlign: 'center' }}>
                              {producto.precio_oferta && producto.precio_oferta > 0 ? (
                                <>
                                  <span className="old-price">
                                    ${producto.precio?.toLocaleString()}
                                  </span>
                                  <span className="discounted-price" style={{ color: '#000' }}>
                                    ${producto.precio_oferta.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="normal-price" style={{ color: '#000' }}>
                                  ${producto.precio?.toLocaleString() || 'Consultar'}
                                </span>
                              )}
                            </div>
                            
                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', textAlign: 'center' }}>
                              Precio sin impuestos: ${((producto.precio_oferta && producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio || 0) / 1.21).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                            </div>
                            
                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>
                              Stock: {producto.stock !== undefined ? producto.stock : 'Consultando...'}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="carousel-nav carousel-nav-next" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              type="button"
              aria-label="Productos siguientes"
            >
              &#8250;
            </button>
          </div>
        {/* Indicadores de grupo de productos (paginación) */}
        <div className="carousel-indicators">
          {Array.from({ length: Math.ceil(productosDestacados.length / 4) }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              aria-label={`Ir a grupo ${index + 1}`}
            />
          ))}
        </div>
        </>
      )}
    </div>
  );
};

export default FeaturedProductsCarousel;

