import React, { useState, useEffect } from "react";
import '../../styles/productContainer.css';
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../Context/CartContext.tsx";
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
const { agregarAlCarrito } = useCart();
const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
const [mensajeAgregado, setMensajeAgregado] = useState<string | null>(null);
const manejarCambioCantidad = (id: number, valor: number) => {
  setCantidades(prev => ({ ...prev, [id]: valor }));
};
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


const manejarAgregarAlCarrito = (producto: ProductoType) => {
  const cantidad = cantidades[producto.id] || 1;

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

            {mensajeAgregado && (
            <div style={{ background: "#d4edda", color: "#155724", padding: "10px", marginBottom: "15px", borderRadius: "5px" }}>
            {mensajeAgregado}
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
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>Cantidad: {producto.cantidad}</p>
            <p>
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

                {producto.cantidad === 0 ? (
                <div style={{ marginTop: "10px", color: "red", fontWeight: "bold" }}>
                    FUERA DE STOCK
                </div>
                ) : (
                <div style={{ marginTop: "10px" }}>
                    <label>Cantidad:</label>
                    <input
                    type="number"
                    min="1"
                    value={cantidades[producto.id] || 1}
                    onChange={(e) => manejarCambioCantidad(producto.id, parseInt(e.target.value))}
                    style={{ width: "60px", marginLeft: "10px" }}
                    />
                    <button
                    onClick={() => manejarAgregarAlCarrito(producto)}
                    style={{ marginLeft: "10px" }}
                    >
                    Agregar al carrito
                    </button>
                </div>
                )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductoListContainerUser;