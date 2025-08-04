import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext.tsx";
import { useNavigate } from "react-router-dom";
import { pedidoService } from "../services/pedidoService.ts";
import { sucursalService, Sucursal } from "../services/sucursalService.ts";
import "../styles/FinalizarPedido.css";

interface DatosEnvio {
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  ciudad: string;
  codigoPostal: string;
  tipoEntrega: 'domicilio' | 'sucursal';
  sucursalSeleccionada?: number;
}

interface DatosPago {
  metodoPago: string;
  numeroTarjeta?: string;
  nombreTitular?: string;
  fechaVencimiento?: string;
  cvv?: string;
}

const FinalizarPedido: React.FC = () => {
  const { carrito, vaciarCarrito } = useCart();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);

  const [datosEnvio, setDatosEnvio] = useState<DatosEnvio>({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
    ciudad: "",
    codigoPostal: "",
    tipoEntrega: 'domicilio'
  });

  const [datosPago, setDatosPago] = useState<DatosPago>({
    metodoPago: "Transferencia"
  });

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalesFiltradas, setSucursalesFiltradas] = useState<Sucursal[]>([]);
  const [emailSugerencia, setEmailSugerencia] = useState<string>("");
  const [mostrarSugerencia, setMostrarSugerencia] = useState(false);
  const [cargandoSucursales, setCargandoSucursales] = useState(false);

  // Cargar sucursales al montar el componente
  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        setCargandoSucursales(true);
        const sucursalesData = await sucursalService.obtenerSucursales();
        setSucursales(sucursalesData || []);
        console.log('Sucursales cargadas:', sucursalesData);
      } catch (error) {
        console.error('Error al cargar sucursales:', error);
        setSucursales([]); // Asegurar que siempre sea un array
      } finally {
        setCargandoSucursales(false);
      }
    };

    cargarSucursales();
  }, []);

  // Filtrar sucursales cuando cambie la ciudad
  useEffect(() => {
    try {
      if (datosEnvio.ciudad && sucursales && sucursales.length > 0) {
        const filtradas = sucursalService.filtrarSucursalesPorCiudad(sucursales, datosEnvio.ciudad);
        setSucursalesFiltradas(filtradas || []);
      } else {
        setSucursalesFiltradas(sucursales || []);
      }
    } catch (error) {
      console.error('Error al filtrar sucursales:', error);
      setSucursalesFiltradas([]);
    }
  }, [datosEnvio.ciudad, sucursales]);

  // Función para validar y sugerir correcciones de email
  const validarEmail = (email: string) => {
    const dominiosComunes = [
      'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 
      'live.com', 'icloud.com', 'protonmail.com'
    ];
    
    const dominiosConErrores = {
      'gmai.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'hotmai.com': 'hotmail.com',
      'homail.com': 'hotmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'outlok.com': 'outlook.com',
      'outlokc.com': 'outlook.com'
    };

    if (email.includes('@')) {
      const dominio = email.split('@')[1];
      const usuario = email.split('@')[0];
      
      // Verificar si hay un error común de dominio
      if (dominiosConErrores[dominio]) {
        const emailCorregido = `${usuario}@${dominiosConErrores[dominio]}`;
        setEmailSugerencia(emailCorregido);
        setMostrarSugerencia(true);
        return false;
      }
      
      setMostrarSugerencia(false);
      return true;
    }
    
    setMostrarSugerencia(false);
    return false;
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, producto) => {
      const precioUnitario = producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio;
      return acc + precioUnitario * producto.cantidad;
    }, 0);
  };

  const handleEnvioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosEnvio({
      ...datosEnvio,
      [name]: value
    });

    // Validar email en tiempo real
    if (name === 'email') {
      validarEmail(value);
    }

    // Si cambia el tipo de entrega, limpiar sucursal seleccionada
    if (name === 'tipoEntrega' && value === 'domicilio') {
      setDatosEnvio(prev => ({ ...prev, sucursalSeleccionada: undefined }));
    }
  };

  const handlePagoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatosPago({
      ...datosPago,
      [e.target.name]: e.target.value
    });
  };

  const aceptarSugerenciaEmail = () => {
    setDatosEnvio({
      ...datosEnvio,
      email: emailSugerencia
    });
    setMostrarSugerencia(false);
  };

  const validarPaso1 = () => {
    const datosBasicos = (
      datosEnvio.nombre &&
      datosEnvio.apellido &&
      datosEnvio.telefono &&
      datosEnvio.email &&
      datosEnvio.ciudad
    );

    if (datosEnvio.tipoEntrega === 'domicilio') {
      return datosBasicos && datosEnvio.direccion && datosEnvio.codigoPostal;
    } else {
      return datosBasicos && datosEnvio.sucursalSeleccionada;
    }
  };

  const validarPaso2 = () => {
    if (datosPago.metodoPago === "transferencia") {
      return true;
    }
    return (
      datosPago.numeroTarjeta &&
      datosPago.nombreTitular &&
      datosPago.fechaVencimiento &&
      datosPago.cvv
    );
  };

  const verificarToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      const response = await fetch('api/usuario', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error al verificar token:', error);
      return false;
    }
  };

  const testServerConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch('api/usuario', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.ok || response.status === 401;
    } catch (error) {
      console.error('No se puede conectar al servidor:', error);
      return false;
    }
  };

  const procesarCompra = async () => {
    setLoading(true);
    
    try {
      // Primero verificar la conexión al servidor
      const serverConnected = await testServerConnection();
      if (!serverConnected) {
        alert('No se puede conectar al servidor. Por favor, verifica que el servidor backend esté funcionando.');
        return;
      }

      const usuario = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');

      if (!token || !usuario.id) {
        alert('Debes iniciar sesión para realizar el pedido');
        navigate('/login');
        return;
      }

      // Verificar si el token es válido
      const tokenValido = await verificarToken();
      if (!tokenValido) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      // Verificar si el token es válido
      const isTokenValid = await verificarToken();
      if (!isTokenValid) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const isServerReachable = await testServerConnection();
      if (!isServerReachable) {
        alert('Error de conexión: No se puede conectar al servidor. Verifica que el servidor esté funcionando y que tu conexión a internet esté activa.');
        return;
      }

      console.log('Iniciando proceso de pedido...', { usuario, carrito });
      console.log('Token disponible:', !!token);
      console.log('URL del API:', 'http://localhost:3000');

      const compraCompleta = {
        datosEnvio: datosEnvio,
        datosPago: datosPago,
        productos: carrito.map(producto => ({
          id: producto.id,
          nombre: producto.nombre,
          cantidad: producto.cantidad,
          precio: producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio
        })),
        total: calcularTotal(),
        tipoEntrega: datosEnvio.tipoEntrega,
        sucursalId: datosEnvio.sucursalSeleccionada
      };

      console.log('Datos de pedido completo:', compraCompleta);
      
      // Usar la nueva función de pedido completa
      const resultado = await pedidoService.finalizarCompraCompleta(compraCompleta, token);

      // Limpiar carrito y redirigir
      vaciarCarrito();
      
      const emailEnviado = resultado.data?.emailEnviado;
      const mensajeExito = emailEnviado 
        ? 'Pedido realizado exitosamente! Te hemos enviado los detalles y datos de transferencia por email.'
        : 'Pedido realizado exitosamente! Los detalles de tu pedido han sido procesados.';
        
      alert(mensajeExito);
      navigate('/');

    } catch (error) {
      console.error('Error detallado al procesar el pedido:', error);
      
      // Mostrar más detalles del error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Verificar si es un error de red
        if (error.message === 'Failed to fetch') {
          alert('Error de conexión: No se puede conectar al servidor. Verifica que el servidor esté funcionando y que tu conexión a internet esté activa.');
        } else {
          alert(`Error al procesar el pedido: ${error.message}`);
        }
      } else {
        console.error('Error desconocido:', error);
        alert('Error desconocido al procesar el pedido. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="finalizar-pedido-container">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos al carrito para continuar con el pedido.</p>
        <button onClick={() => navigate('/productos')} className="btn-continuar">
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="finalizar-pedido-container">
      <h2>Finalizar Pedido</h2>
      
      <div className="pasos-container">
        <div className={`paso ${paso >= 1 ? 'activo' : ''} ${paso > 1 ? 'completado' : ''}`}>
          <span>1</span> Datos de envío
        </div>
        <div className={`paso ${paso >= 2 ? 'activo' : ''} ${paso > 2 ? 'completado' : ''}`}>
          <span>2</span> Método de pago
        </div>
        <div className={`paso ${paso >= 3 ? 'activo' : ''}`}>
          <span>3</span> Confirmación
        </div>
      </div>

      {paso === 1 && (
        <div className="paso-contenido">
          <h3>Datos de envío</h3>
          <div className="form-grupo">
            <div className="form-fila">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={datosEnvio.nombre}
                onChange={handleEnvioChange}
                required
              />
              <input
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={datosEnvio.apellido}
                onChange={handleEnvioChange}
                required
              />
            </div>
            <div className="email-container">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={datosEnvio.email}
                onChange={handleEnvioChange}
                className={mostrarSugerencia ? 'email-con-error' : ''}
                required
              />
              {mostrarSugerencia && (
                <div className="email-sugerencia">
                  <span className="icono-warning">⚠️</span>
                  <span>¿Quisiste decir <strong>{emailSugerencia}</strong>?</span>
                  <button 
                    type="button" 
                    className="btn-aceptar-sugerencia"
                    onClick={aceptarSugerenciaEmail}
                  >
                    Usar este email
                  </button>
                  <button 
                    type="button" 
                    className="btn-cerrar-sugerencia"
                    onClick={() => setMostrarSugerencia(false)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <div className="form-fila">
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={datosEnvio.ciudad}
                onChange={handleEnvioChange}
                required
              />
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono"
                value={datosEnvio.telefono}
                onChange={handleEnvioChange}
                required
              />
            </div>
            
            <div className="tipo-entrega">
              <label>
                <strong>Tipo de entrega:</strong>
              </label>
              <select
                name="tipoEntrega"
                value={datosEnvio.tipoEntrega}
                onChange={handleEnvioChange}
                className="select-tipo-entrega"
                required
              >
                <option value="Domicilio">Entrega a Domicilio</option>
                <option value="Ducursal">Retiro en Sucursal</option>
              </select>
            </div>

            {datosEnvio.tipoEntrega === 'domicilio' && (
              <>
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección completa"
                  value={datosEnvio.direccion}
                  onChange={handleEnvioChange}
                  required
                />
                <input
                  type="text"
                  name="codigoPostal"
                  placeholder="Código Postal"
                  value={datosEnvio.codigoPostal}
                  onChange={handleEnvioChange}
                  required
                />
              </>
            )}

            {datosEnvio.tipoEntrega === 'sucursal' && (
              <div className="sucursal-selection">
                <label>
                  <strong>Sucursal para retiro:</strong>
                </label>
                {cargandoSucursales ? (
                  <p>Cargando sucursales...</p>
                ) : sucursalesFiltradas.length > 0 ? (
                  <select
                    name="sucursalSeleccionada"
                    value={datosEnvio.sucursalSeleccionada || ''}
                    onChange={handleEnvioChange}
                    className="select-sucursal"
                    required
                  >
                    <option value="">Selecciona una sucursal</option>
                    {sucursalesFiltradas.map((sucursal) => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.direccion} - {sucursal.localidades && sucursal.localidades.length > 0 
                          ? sucursal.localidades.map(l => l?.nombre || 'Sin nombre').join(', ')
                          : 'Localidad no especificada'
                        }
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="no-sucursales">
                    No hay sucursales disponibles en tu ciudad. 
                    {datosEnvio.ciudad && ` Intenta con una ciudad cercana o selecciona entrega a domicilio.`}
                  </p>
                )}
                
                {datosEnvio.sucursalSeleccionada && (
                  <div className="sucursal-info">
                    {(() => {
                      const sucursalSeleccionada = sucursalesFiltradas.find(s => s.id === Number(datosEnvio.sucursalSeleccionada));
                      return sucursalSeleccionada ? (
                        <div className="info-sucursal">
                          <p><strong>Dirección:</strong> {sucursalSeleccionada.direccion}</p>
                          <p><strong>Contacto:</strong> {sucursalSeleccionada.contacto}</p>
                          {sucursalSeleccionada.localidades && sucursalSeleccionada.localidades.length > 0 && (
                            <p><strong>Localidades:</strong> {sucursalSeleccionada.localidades.map(l => l?.nombre || 'Sin nombre').join(', ')}</p>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setPaso(2)}
            disabled={!validarPaso1()}
            className="btn-siguiente"
          >
            Continuar
          </button>
        </div>
      )}

      {paso === 2 && (
        <div className="paso-contenido">
          <h3>Método de pago</h3>
          <div className="form-grupo">
            <div className="metodos-pago">
              <label className="metodo-pago">
                <input
                  type="radio"
                  name="metodoPago"
                  value="transferencia"
                  checked={datosPago.metodoPago === "transferencia"}
                  onChange={handlePagoChange}
                />
                <span>Transferencia Bancaria</span>
                <small>Recibirás los datos de transferencia por email</small>
              </label>
              <label className="metodo-pago">
                <input
                  type="radio"
                  name="metodoPago"
                  value="tarjeta"
                  checked={datosPago.metodoPago === "tarjeta"}
                  onChange={handlePagoChange}
                />
                <span>Tarjeta de Crédito/Débito</span>
              </label>
            </div>

            {datosPago.metodoPago === "tarjeta" && (
              <div className="datos-tarjeta">
                <input
                  type="text"
                  name="numeroTarjeta"
                  placeholder="Número de tarjeta"
                  value={datosPago.numeroTarjeta || ""}
                  onChange={handlePagoChange}
                  maxLength={16}
                  required
                />
                <input
                  type="text"
                  name="nombreTitular"
                  placeholder="Nombre del titular"
                  value={datosPago.nombreTitular || ""}
                  onChange={handlePagoChange}
                  required
                />
                <div className="form-fila">
                  <input
                    type="text"
                    name="fechaVencimiento"
                    placeholder="MM/AA"
                    value={datosPago.fechaVencimiento || ""}
                    onChange={handlePagoChange}
                    maxLength={5}
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={datosPago.cvv || ""}
                    onChange={handlePagoChange}
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            )}
          </div>
          <div className="botones-navegacion">
            <button onClick={() => setPaso(1)} className="btn-anterior">
              Anterior
            </button>
            <button
              onClick={() => setPaso(3)}
              disabled={!validarPaso2()}
              className="btn-siguiente"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="paso-contenido">
          <h3>Confirmación de pedido</h3>
          
          <div className="resumen-pedido">
            <div className="datos-confirmacion">
              <div className="seccion-confirmacion">
                <h4>Datos de envío</h4>
                <p><strong>{datosEnvio.nombre} {datosEnvio.apellido}</strong></p>
                <p><strong>Tipo de entrega:</strong> {datosEnvio.tipoEntrega === 'domicilio' ? 'Entrega a domicilio' : 'Retiro en sucursal'}</p>
                
                {datosEnvio.tipoEntrega === 'domicilio' ? (
                  <>
                    <p>{datosEnvio.direccion}</p>
                    <p>{datosEnvio.ciudad}, {datosEnvio.codigoPostal}</p>
                  </>
                ) : (
                  (() => {
                    const sucursalSeleccionada = sucursalesFiltradas.find(s => s.id === Number(datosEnvio.sucursalSeleccionada));
                    return sucursalSeleccionada ? (
                      <>
                        <p><strong>Sucursal:</strong> {sucursalSeleccionada.direccion}</p>
                        {sucursalSeleccionada.localidades && sucursalSeleccionada.localidades.length > 0 && (
                          <p><strong>Localidad:</strong> {sucursalSeleccionada.localidades.map(l => l?.nombre || 'Sin nombre').join(', ')}</p>
                        )}
                        <p><strong>Contacto:</strong> {sucursalSeleccionada.contacto}</p>
                      </>
                    ) : (
                      <p>Sucursal no encontrada</p>
                    );
                  })()
                )}
                
                <p>{datosEnvio.telefono}</p>
                <p>{datosEnvio.email}</p>
              </div>

              <div className="seccion-confirmacion">
                <h4>Método de pago</h4>
                <p>
                  {datosPago.metodoPago === "transferencia" 
                    ? "Transferencia Bancaria" 
                    : `Tarjeta terminada en ${datosPago.numeroTarjeta?.slice(-4)}`
                  }
                </p>
              </div>
            </div>

            <div className="productos-confirmacion">
              <h4>Productos</h4>
              {carrito.map((producto) => (
                <div key={producto.id} className="producto-confirmacion">
                  <img src={producto.imagen} alt={producto.nombre} />
                  <div className="info-producto">
                    <h5>{producto.nombre}</h5>
                    <p>Cantidad: {producto.cantidad}</p>
                    <p>Precio: ${producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio}</p>
                  </div>
                  <div className="subtotal-producto">
                    ${(producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio) * producto.cantidad}
                  </div>
                </div>
              ))}
            </div>

            <div className="total-confirmacion">
              <h3>Total: ${calcularTotal().toFixed(2)}</h3>
            </div>
          </div>

          <div className="botones-navegacion">
            <button onClick={() => setPaso(2)} className="btn-anterior">
              Anterior
            </button>
            <button
              onClick={procesarCompra}
              disabled={loading}
              className="btn-finalizar"
            >
              {loading ? 'Procesando...' : 'Confirmar pedido'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalizarPedido;
