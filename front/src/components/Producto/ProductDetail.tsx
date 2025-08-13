import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/cartContext.tsx";
import '../../styles/Usuario/productContainer.css';
import '../../styles/Usuario/productDetail.css';

interface ProductoType {
    id: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
    tipo: number;
    precio: number;
    precio_oferta: number;
    imagen: string;
}

interface TipoProducto {
    id: number;
    nombre: string;
}

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { agregarAlCarrito } = useCart();
    const [producto, setProducto] = useState<ProductoType | null>(null);
    const [tipoNombre, setTipoNombre] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [cantidad, setCantidad] = useState<number>(1);
    const [mensajeAgregado, setMensajeAgregado] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducto = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/producto/${id}`);
                if (!response.ok) throw new Error("Producto no encontrado");
                const data = await response.json();
                setProducto(data.data);
                
                // Fetch tipo nombre
                if (data.data.tipo) {
                    const tipoResponse = await fetch(`/api/tipoP/${data.data.tipo}`);
                    if (tipoResponse.ok) {
                        const tipoData = await tipoResponse.json();
                        setTipoNombre(tipoData.data.nombre);
                    }
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    const manejarAgregarAlCarrito = () => {
        if (!producto) return;

        const exito = agregarAlCarrito({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            precio_oferta: producto.precio_oferta,
            imagen: producto.imagen,
            cantidad: cantidad
        });

        if (exito) {
            setMensajeAgregado(`Se agregó "${producto.nombre}" (${cantidad}) al carrito.`);
            setTimeout(() => {
                setMensajeAgregado(null);
            }, 2500);
        }
    };

    if (loading) return <div className="product-detail-loading"><p>Cargando producto...</p></div>;
    if (error) return <div className="product-detail-error"><p className="error">{error}</p></div>;
    if (!producto) return <div className="product-detail-not-found"><p>Producto no encontrado</p></div>;

    return (
        <div className="product-list-container product-detail-container">
            {mensajeAgregado && (
                <div className="product-detail-success-message">
                    {mensajeAgregado}
                </div>
            )}

            <div className="product-detail-layout">
                {/* Imagen del producto */}
                <div className="product-detail-image-container">
                    {producto.imagen && (
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="product-detail-image"
                        />
                    )}
                </div>

                {/* Información del producto */}
                <div className="product-detail-info">
                    <h3 className="product-detail-title">{producto.nombre}</h3>
                    
                    <div className="product-detail-price-container">
                        {producto.precio_oferta > 0 ? (
                            <>
                                <div className="product-detail-main-price">
                                    $ {producto.precio_oferta.toLocaleString()}
                                </div>
                                <div className="product-detail-tax-free-price">
                                    Precio sin impuestos nacionales: $ {(producto.precio_oferta / 1.21).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="product-detail-main-price">
                                    $ {producto.precio.toLocaleString()}
                                </div>
                                <div className="product-detail-tax-free-price">
                                    Precio sin impuestos nacionales: $ {(producto.precio / 1.21).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="product-detail-stock">
                        <p className={`product-detail-stock-text ${producto.cantidad > 0 ? 'product-detail-stock-available' : 'product-detail-stock-unavailable'}`}>
                            {producto.cantidad > 0 ? `Stock: ${producto.cantidad} unidades` : "FUERA DE STOCK"}
                        </p>
                    </div>

                    {producto.cantidad > 0 && (
                        <>
                            <div className="product-detail-quantity-container">
                                <label className="product-detail-quantity-label">
                                    Cantidad:
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={producto.cantidad}
                                    value={cantidad}
                                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                                    className="product-detail-quantity-input"
                                />
                            </div>
                            <button
                                onClick={manejarAgregarAlCarrito}
                                className="product-detail-add-button"
                            >
                                Añadir al carrito
                            </button>
                        </>
                    )}

                    <div className="product-detail-metadata">
                        <p>Descripción: {producto.descripcion}</p>
                        <p>Categoría: {tipoNombre || `Tipo ${producto.tipo}`}</p>
                        <p>ID del producto: {producto.id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
