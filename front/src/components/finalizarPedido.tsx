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
  const [errorSucursales, setErrorSucursales] = useState<string>("");
  const [erroresPago, setErroresPago] = useState<{[key: string]: string}>({});

  // Cargar sucursales al montar el componente
  useEffect(() => {
    const cargarSucursales = async () => {
      try {
        console.log('🚀 Iniciando carga de sucursales...');
        setCargandoSucursales(true);
        setErrorSucursales("");
        
        const sucursalesData = await sucursalService.obtenerSucursales();
        
        console.log('📥 Sucursales recibidas:', sucursalesData);
        setSucursales(sucursalesData || []);
        
        if (!sucursalesData || sucursalesData.length === 0) {
          setErrorSucursales("No se encontraron sucursales disponibles");
        }
        
      } catch (error) {
        console.error('❌ Error al cargar sucursales:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar sucursales';
        setErrorSucursales(errorMessage);
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
      console.log('🔄 Filtrando sucursales - Ciudad:', datosEnvio.ciudad, 'Sucursales disponibles:', sucursales.length);
      
      if (datosEnvio.ciudad && sucursales && sucursales.length > 0) {
        const filtradas = sucursalService.filtrarSucursalesPorCiudad(sucursales, datosEnvio.ciudad);
        console.log('📋 Sucursales filtradas:', filtradas.length);
        setSucursalesFiltradas(filtradas || []);
      } else {
        console.log('📋 Mostrando todas las sucursales');
        setSucursalesFiltradas(sucursales || []);
      }
    } catch (error) {
      console.error('❌ Error al filtrar sucursales:', error);
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

  // Función para validar número de tarjeta
  const validarNumeroTarjeta = (numero: string) => {
    // Eliminar espacios y caracteres no numéricos
    const numeroLimpio = numero.replace(/\D/g, '');
    
    if (numeroLimpio.length < 13 || numeroLimpio.length > 19) {
      return 'El número de tarjeta debe tener entre 13 y 19 dígitos';
    }
    
    // Algoritmo de Luhn para validar número de tarjeta
    let suma = 0;
    let alternar = false;
    
    for (let i = numeroLimpio.length - 1; i >= 0; i--) {
      let digito = parseInt(numeroLimpio.charAt(i));
      
      if (alternar) {
        digito *= 2;
        if (digito > 9) {
          digito = (digito % 10) + 1;
        }
      }
      
      suma += digito;
      alternar = !alternar;
    }
    
    if (suma % 10 !== 0) {
      return 'Número de tarjeta inválido';
    }
    
    return '';
  };

  // Función para validar fecha de vencimiento
  const validarFechaVencimiento = (fecha: string) => {
    if (!/^\d{2}\/\d{2}$/.test(fecha)) {
      return 'Formato inválido. Use MM/AA';
    }
    
    const [mes, año] = fecha.split('/').map(num => parseInt(num));
    
    if (mes < 1 || mes > 12) {
      return 'Mes inválido';
    }
    
    const fechaActual = new Date();
    const añoCompleto = 2000 + año;
    const fechaVencimiento = new Date(añoCompleto, mes - 1);
    
    if (fechaVencimiento <= fechaActual) {
      return 'La tarjeta está vencida';
    }
    
    return '';
  };

  // Función para validar CVV
  const validarCVV = (cvv: string) => {
    if (!/^\d{3,4}$/.test(cvv)) {
      return 'CVV debe tener 3 o 4 dígitos';
    }
    return '';
  };

  // Función para formatear número de tarjeta con espacios
  const formatearNumeroTarjeta = (numero: string) => {
    const numeroLimpio = numero.replace(/\D/g, '');
    const grupos = numeroLimpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : numeroLimpio;
  };

  // Función para formatear fecha MM/AA
  const formatearFechaVencimiento = (fecha: string) => {
    const numerosSolo = fecha.replace(/\D/g, '');
    if (numerosSolo.length >= 2) {
      return numerosSolo.substring(0, 2) + '/' + numerosSolo.substring(2, 4);
    }
    return numerosSolo;
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, producto) => {
      const precioUnitario = producto.precio_oferta > 0 ? producto.precio_oferta : producto.precio;
      return acc + precioUnitario * producto.cantidad;
    }, 0);
  };

  const handleEnvioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si cambia el tipo de entrega, manejar la lógica especial
    if (name === 'tipoEntrega') {
      setDatosEnvio({
        ...datosEnvio,
        tipoEntrega: value as 'domicilio' | 'sucursal',
        // Limpiar sucursal seleccionada cuando cambia a domicilio
        // y mantener undefined cuando cambia a sucursal hasta que se seleccione una
        sucursalSeleccionada: value === 'domicilio' ? undefined : datosEnvio.sucursalSeleccionada
      });
    } else {
      setDatosEnvio({
        ...datosEnvio,
        [name]: value
      });
    }

    // Validar email en tiempo real
    if (name === 'email') {
      validarEmail(value);
    }
  };

  const handlePagoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let valorProcesado = value;
    
    // Limpiar errores previos del campo
    setErroresPago(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Procesar según el tipo de campo
    if (name === 'numeroTarjeta') {
      // Solo permitir números y formatear con espacios
      const numerosSolo = value.replace(/\D/g, '');
      if (numerosSolo.length <= 19) {
        valorProcesado = formatearNumeroTarjeta(numerosSolo);
      } else {
        return; // No actualizar si excede la longitud máxima
      }
    } else if (name === 'fechaVencimiento') {
      // Formatear automáticamente como MM/AA
      valorProcesado = formatearFechaVencimiento(value);
    } else if (name === 'cvv') {
      // Solo permitir números, máximo 4 dígitos
      const numerosSolo = value.replace(/\D/g, '');
      if (numerosSolo.length <= 4) {
        valorProcesado = numerosSolo;
      } else {
        return; // No actualizar si excede la longitud máxima
      }
    } else if (name === 'nombreTitular') {
      // Solo permitir letras y espacios
      valorProcesado = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }
    
    setDatosPago({
      ...datosPago,
      [name]: valorProcesado
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
    
    // Validar todos los campos de tarjeta
    const errores: {[key: string]: string} = {};
    
    if (!datosPago.numeroTarjeta) {
      errores.numeroTarjeta = 'Número de tarjeta requerido';
    } else {
      const errorNumero = validarNumeroTarjeta(datosPago.numeroTarjeta);
      if (errorNumero) errores.numeroTarjeta = errorNumero;
    }
    
    if (!datosPago.nombreTitular) {
      errores.nombreTitular = 'Nombre del titular requerido';
    }
    
    if (!datosPago.fechaVencimiento) {
      errores.fechaVencimiento = 'Fecha de vencimiento requerida';
    } else {
      const errorFecha = validarFechaVencimiento(datosPago.fechaVencimiento);
      if (errorFecha) errores.fechaVencimiento = errorFecha;
    }
    
    if (!datosPago.cvv) {
      errores.cvv = 'CVV requerido';
    } else {
      const errorCVV = validarCVV(datosPago.cvv);
      if (errorCVV) errores.cvv = errorCVV;
    }
    
    setErroresPago(errores);
    
    return Object.keys(errores).length === 0;
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
                <option value="domicilio">Entrega a Domicilio</option>
                <option value="sucursal">Retiro en Sucursal</option>
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
                
                {/* Estado de carga */}
                {cargandoSucursales && (
                  <div className="cargando-sucursales">
                    <p>🔄 Cargando sucursales...</p>
                  </div>
                )}
                
                {/* Error al cargar sucursales */}
                {errorSucursales && !cargandoSucursales && (
                  <div className="error-sucursales" style={{ 
                    color: 'red', 
                    backgroundColor: '#ffe6e6', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    margin: '10px 0' 
                  }}>
                    <p>❌ Error: {errorSucursales}</p>
                    <button 
                      type="button" 
                      onClick={() => window.location.reload()}
                      style={{ 
                        marginTop: '5px', 
                        padding: '5px 10px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px', 
                        cursor: 'pointer' 
                      }}
                    >
                      Reintentar
                    </button>
                  </div>
                )}
                
                {/* Información de debug */}
                {!cargandoSucursales && !errorSucursales && (
                  <div className="debug-info" style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
                    📊 Total sucursales: {sucursales.length} | Filtradas: {sucursalesFiltradas.length}
                    {datosEnvio.ciudad && ` | Filtro: "${datosEnvio.ciudad}"`}
                  </div>
                )}
                
                {/* Selector de sucursales */}
                {!cargandoSucursales && !errorSucursales && sucursalesFiltradas.length > 0 ? (
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
                ) : !cargandoSucursales && !errorSucursales ? (
                  <div className="no-sucursales">
                    {sucursales.length === 0 ? (
                      <p>❌ No hay sucursales disponibles en el sistema.</p>
                    ) : (
                      <div>
                        <p>⚠️ No hay sucursales disponibles en "{datosEnvio.ciudad}".</p>
                        <p>💡 Sugerencias:</p>
                        <ul style={{ marginLeft: '20px' }}>
                          <li>Intenta con una ciudad cercana</li>
                          <li>Verifica la ortografía de la ciudad</li>
                          <li>Selecciona entrega a domicilio</li>
                        </ul>
                        {sucursales.length > 0 && (
                          <details style={{ marginTop: '10px' }}>
                            <summary style={{ cursor: 'pointer', color: '#007bff' }}>
                              Ver todas las sucursales disponibles
                            </summary>
                            <ul style={{ marginTop: '10px' }}>
                              {sucursales.map(s => (
                                <li key={s.id}>
                                  {s.direccion} - {s.localidades.map(l => l.nombre).join(', ')}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
                
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
                <div className="campo-tarjeta">
                  <input
                    type="text"
                    name="numeroTarjeta"
                    placeholder="Número de tarjeta (1234 5678 9012 3456)"
                    value={datosPago.numeroTarjeta || ""}
                    onChange={handlePagoChange}
                    className={erroresPago.numeroTarjeta ? 'error' : ''}
                    required
                  />
                  {erroresPago.numeroTarjeta && (
                    <span className="error-mensaje">{erroresPago.numeroTarjeta}</span>
                  )}
                </div>
                
                <div className="campo-tarjeta">
                  <input
                    type="text"
                    name="nombreTitular"
                    placeholder="Nombre del titular (como aparece en la tarjeta)"
                    value={datosPago.nombreTitular || ""}
                    onChange={handlePagoChange}
                    className={erroresPago.nombreTitular ? 'error' : ''}
                    required
                  />
                  {erroresPago.nombreTitular && (
                    <span className="error-mensaje">{erroresPago.nombreTitular}</span>
                  )}
                </div>
                
                <div className="form-fila">
                  <div className="campo-tarjeta">
                    <input
                      type="text"
                      name="fechaVencimiento"
                      placeholder="MM/AA"
                      value={datosPago.fechaVencimiento || ""}
                      onChange={handlePagoChange}
                      className={erroresPago.fechaVencimiento ? 'error' : ''}
                      maxLength={5}
                      required
                    />
                    {erroresPago.fechaVencimiento && (
                      <span className="error-mensaje">{erroresPago.fechaVencimiento}</span>
                    )}
                  </div>
                  
                  <div className="campo-tarjeta">
                    <input
                      type="password"
                      name="cvv"
                      placeholder="CVV"
                      value={datosPago.cvv || ""}
                      onChange={handlePagoChange}
                      className={erroresPago.cvv ? 'error' : ''}
                      maxLength={4}
                      required
                    />
                    {erroresPago.cvv && (
                      <span className="error-mensaje">{erroresPago.cvv}</span>
                    )}
                  </div>
                </div>
                
                <div className="info-seguridad">
                  <small>
                    🔒 Tus datos están protegidos. El CVV es el código de 3 o 4 dígitos 
                    que aparece en el reverso de tu tarjeta.
                  </small>
                </div>
              </div>
            )}
          </div>
          <div className="botones-navegacion">
            <button onClick={() => setPaso(1)} className="btn-anterior">
              Anterior
            </button>
            <button
              onClick={() => {
                if (validarPaso2()) {
                  setPaso(3);
                }
              }}
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
