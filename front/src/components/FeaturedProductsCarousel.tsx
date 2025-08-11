import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductosDestacados from "./ProductosDestacados";
import "../styles/FeaturedProductsCarousel.css";

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
    setLoading(false); // Ya no hay verificación de usuario
  }, []);

  const manejarProductosCalculados = (productos: ProductoDestacado[]) => {
    setProductosDestacados(productos);
  };

  const manejarConsulta = (producto: ProductoDestacado, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const mensaje = `Hola! Me interesa el producto: ${producto.nombre}. ¿Podrían darme más información?`;
    const numeroWhatsApp = "1234567890"; // Reemplazar con el número real
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
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
      {/* Usar el componente ProductosDestacados para obtener los datos */}
      <div style={{ display: 'none' }}>
        <ProductosDestacados 
          mostrarEstadisticas={false}
          limite={16}
          onProductosCalculados={manejarProductosCalculados}
        />
      </div>

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

