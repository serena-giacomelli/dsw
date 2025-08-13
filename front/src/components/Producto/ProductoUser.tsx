import React, { useState, useEffect } from "react";
import '../../styles/Usuario/productContainer.css';
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


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

const ProductoListContainerUser: React.FC = () => {
const [productos, setProductos] = useState<ProductoType[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [orden, setOrden] = useState<'asc-nombre' | 'desc-nombre' | 'asc-precio' | 'desc-precio'>('asc-nombre');
const [filtroSeleccionado, setFiltroSeleccionado] = useState("");
const [cantidadFiltro, setCantidadFiltro] = useState<number | "">("");
const [tipoProductoFiltro, setTipoProductoFiltro] = useState<number | "">("");
const [mostrarFiltros, setMostrarFiltros] = useState(false);
const { id } = useParams();
const navigate = useNavigate();

const location = useLocation();

const fetchProductosUser = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch("/api/producto");
        if (!response.ok) throw new Error("Error al cargar productos");
        const data = await response.json();
        setProductos(data.data);
    } catch (error: any) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

const fetchProductosUserPorStock = async () => {
    if (cantidadFiltro === "") return;
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`/api/producto/cantidad/${cantidadFiltro}`);
        if (!response.ok) throw new Error("No se encontraron productos con el stock especificado");
        const data = await response.json();
        setProductos(data.data);
    } catch (error: any) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

const fetchProductosUserPorTipo = async (tipoId: number) => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(`/api/producto/categoria/${tipoId}`);
        if (!response.ok) throw new Error("No se encontraron productos para el tipo especificado");
        const data = await response.json();
        setProductos(data.data);
    } catch (error: any) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    if (location.pathname.startsWith("/productos/tipo/") && id) {
        fetchProductosUserPorTipo(Number(id));
    } else {
        fetchProductosUser();
    }
}, [location, id]);

useEffect(() => {
const productosOrdenados = [...productos];

switch (orden) {
    case 'asc-nombre':
    productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    break;
    case 'desc-nombre':
    productosOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    break;
    case 'asc-precio':
    productosOrdenados.sort((a, b) => a.precio - b.precio);
    break;
    case 'desc-precio':
    productosOrdenados.sort((a, b) => b.precio - a.precio);
    break;
}

setProductos(productosOrdenados);
}, [orden]);


return (
    <div className="product-list-container">
        <div className="filters" style={{ marginBottom: "1rem" }}>
            <h3
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                style={{
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
                paddingBottom: "5px",
                marginBottom: "10px",
                textTransform: "uppercase",
                }}>
                {mostrarFiltros ? "−" : "+"} Filtros
            </h3>

            {mostrarFiltros && (
                <div style={{ paddingLeft: "10px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Ordenar por:</label>
                    <select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value as any)}
                    style={{ marginLeft: "10px" }}
                    >
                    <option value="asc-nombre">Nombre A-Z</option>
                    <option value="desc-nombre">Nombre Z-A</option>
                    <option value="asc-precio">Precio: menor a mayor</option>
                    <option value="desc-precio">Precio: mayor a menor</option>
                    </select>
                </div>

               <div style={{ marginBottom: "10px" }}>
                    <label>Cantidad mínima de stock:</label>
                    <input
                    type="number"
                    value={cantidadFiltro}
                    onChange={(e) => setCantidadFiltro(Number(e.target.value))}
                    style={{ marginLeft: "10px" }}
                    />
                    <button
                    onClick={fetchProductosUserPorStock}
                    style={{ display: "block", marginTop: "5px" }}
                    >
                    Buscar por stock
                    </button>
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>ID de tipo de producto:</label>
                    <input
                    type="number"
                    value={tipoProductoFiltro}
                    onChange={(e) => setTipoProductoFiltro(Number(e.target.value))}
                    style={{ marginLeft: "10px" }}
                    />
                    <button
                    onClick={() => {
                        if (tipoProductoFiltro !== "") {
                            navigate(`/productos/tipo/${tipoProductoFiltro}`);
                        }
                    }}
                    style={{ display: "block", marginTop: "5px" }}
                    >
                    Buscar por tipo de producto
                    </button>
                </div>
            <button
                onClick={() => {
                    navigate("/productos");
                    setCantidadFiltro("");
                    setTipoProductoFiltro("");
                }}
            >
        
                Mostrar todos los productos
            </button>
            </div> 
        )}

        </div>
            {loading ? (
                <p>Cargando productos...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (

                <ul
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                    listStyle: "none",
                    padding: 0,
                }}>
    {productos.map((producto) => (
        <li key={producto.id}
        style={{
            border: "1px solid #ccc",
            borderRadius: "0px",
            padding: "15px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          >
            {/* Imagen del producto */}
            {producto.imagen && (
                <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{
                    width: "300px",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "0px",
                    marginBottom: "10px",
                  }}
                />
            )}
            {/* Información del producto */}
            <h3 
                onClick={() => navigate(`/producto/${producto.id}`)}
                style={{ 
                    cursor: "pointer", 
                    color: "#000",
                    textDecoration: "none",
                    transition: "text-decoration 0.2s"
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
            >
                {producto.nombre}
            </h3>
            <p style={{ marginBottom: "0px" }}>
                Precio:
                {producto.precio_oferta > 0 ? (
                    <>
                        <span style={{ textDecoration: "line-through", marginRight: "8px" }}>
                            ${producto.precio}
                        </span>
                        <span className="precio-descuento">${producto.precio_oferta}</span>
                    </>
                ) : (
                    `$${producto.precio}`
                )}
            </p>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "8px" }}>
                Precio sin impuestos nacionales: $ {producto.precio_oferta > 0 ? 
                    (producto.precio_oferta / 1.21).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 
                    (producto.precio / 1.21).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p style={{ color: producto.cantidad > 0 ? "#666" : "#999", fontWeight: "normal", fontSize: "14px" }}>
                {producto.cantidad > 0 ? `Stock: ${producto.cantidad} unidades` : "FUERA DE STOCK"}
            </p>
        </li>
    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductoListContainerUser;