const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export interface PedidoData {
  fecha_pedido: string;
  total: number;
  tipo_entrega: string;
  estado: string;
  usuarios: number[]; // Array para ManyToMany
}

export interface LineaPedidoData {
  cantidad: string;
  precio_unitario: number;
  productos: number[]; // Array para ManyToMany
  pedido: number; // Solo ID para ManyToOne
}

export interface PagoData {
  estado: string;
  metodo_pago: number;
  pedidos: number[]; // Array para ManyToMany
  usuarios: number[]; // Array para ManyToMany
}

export interface ProductoPedido {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface CompraCompleta {
  datosEnvio: {
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    email: string;
    ciudad: string;
    codigoPostal: string;
    tipoEntrega: 'domicilio' | 'sucursal';
    sucursalSeleccionada?: number;
  };
  datosPago: {
    metodoPago: string;
    numeroTarjeta?: string;
    nombreTitular?: string;
    fechaVencimiento?: string;
    cvv?: string;
  };
  productos: ProductoPedido[];
  total: number;
  tipoEntrega?: string;
  sucursalId?: number;
}

export const pedidoService = {
  // Crear un nuevo pedido
  async crearPedido(pedidoData: PedidoData, token: string) {
    try {
      console.log('Enviando pedido a:', `https://dswback.onrender.comhttps://dswback.onrender.com/api/pedido`);
      console.log('Datos del pedido:', pedidoData);
      
      const response = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/pedido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pedidoData)
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del servidor:', errorData);
        
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        
        throw new Error(`Error al crear el pedido: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Pedido creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error en crearPedido:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('No se puede conectar al servidor. Verifica que esté funcionando.');
      }
      throw error;
    }
  },

  // Crear línea de pedido
  async crearLineaPedido(lineaPedidoData: LineaPedidoData, token: string) {
    try {
      console.log('Enviando línea de pedido a:', `https://dswback.onrender.comhttps://dswback.onrender.com/api/lineaPed`);
      console.log('Datos de la línea:', lineaPedidoData);
      
      const response = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/lineaPed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(lineaPedidoData)
      });

      console.log('Respuesta del servidor (línea):', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del servidor (línea):', errorData);
        
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        
        throw new Error(`Error al crear la línea de pedido: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Línea de pedido creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error en crearLineaPedido:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('No se puede conectar al servidor. Verifica que esté funcionando.');
      }
      throw error;
    }
  },

  // Crear pago
  async crearPago(pagoData: PagoData, token: string) {
    try {
      console.log('Enviando pago a:', `https://dswback.onrender.comhttps://dswback.onrender.com/api/pago`);
      console.log('Datos del pago:', pagoData);
      
      const response = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/pago`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pagoData)
      });

      console.log('Respuesta del servidor (pago):', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del servidor (pago):', errorData);
        
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        
        throw new Error(`Error al crear el pago: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Pago creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error en crearPago:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('No se puede conectar al servidor. Verifica que esté funcionando.');
      }
      throw error;
    }
  },

  async finalizarCompraCompleta(compraData: CompraCompleta, token: string) {
    try {
      console.log('Enviando pedido completo a:', `api/pedido/finalizar`);
      console.log('Datos del pedido:', compraData);
      
      // Formatear los datos según las entidades del backend
      const datosFormateados = {
        datosEnvio: compraData.datosEnvio,
        datosPago: compraData.datosPago,
        productos: compraData.productos,
        total: compraData.total,
        tipoEntrega: compraData.tipoEntrega || compraData.datosEnvio.tipoEntrega,
        sucursalId: compraData.sucursalId || compraData.datosEnvio.sucursalSeleccionada
      };
      
      const response = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/pedido/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosFormateados)
      });

      console.log('Respuesta del servidor (pedido completo):', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error del servidor (pedido completo):', errorData);
        
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        
        throw new Error(`Error al procesar el pedido: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Pedido procesado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error en finalizarCompraCompleta:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('No se puede conectar al servidor. Verifica que esté funcionando.');
      }
      throw error;
    }
  },

  // Obtener pedidos del usuario
  async obtenerPedidosUsuario(token: string) {
    try {
      const response = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/pedido`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al obtener los pedidos: ${response.status} - ${errorData}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error en obtenerPedidosUsuario:', error);
      throw error;
    }
  },

  // Cancelar un pedido (solo usuarios)
  async cancelarPedido(pedidoId: number, motivo: string, token: string) {
    try {
      const response = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/pedido/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'cancelado', motivo_cancelacion: motivo })
      });

      if (!response.ok) {
        throw new Error('Error al cancelar el pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al cancelar pedido:', error);
      throw error;
    }
  },

  // Marcar pedido como recibido (solo usuarios)
  async marcarComoRecibido(pedidoId: number, token: string) {
    try {
      const response = await fetch(`https://dswback.onrender.comhttps://dswback.onrender.com/api/pedido/${pedidoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'completado' })
      });

      if (!response.ok) {
        throw new Error('Error al marcar pedido como recibido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al marcar como recibido:', error);
      throw error;
    }
  }
};
