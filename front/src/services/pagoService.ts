const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export interface Pago {
  id: number;
  estado: string; // 'pendiente', 'aprobado', 'rechazado'
  metodo_pago: number; // 1 = transferencia, 2 = tarjeta
  monto?: number;
  fecha_pago?: string;
  comprobante_transferencia?: string;
  numero_referencia?: string;
  comentarios_admin?: string;
  fecha_aprobacion?: string;
  pedidos: any[];
  usuarios: any[];
}

export const pagoService = {
  // Obtener todos los pagos (solo admin)
  async obtenerTodosLosPagos(token: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/pago`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error('Error al obtener los pagos');
      }

      return response.json();
    } catch (error) {
      console.error('Error en obtenerTodosLosPagos:', error);
      throw error;
    }
  },

  // Obtener pagos pendientes (solo admin)
  async obtenerPagosPendientes(token: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/pago/pendientes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error('Error al obtener pagos pendientes');
      }

      return response.json();
    } catch (error) {
      console.error('Error en obtenerPagosPendientes:', error);
      throw error;
    }
  },

  // Aprobar un pago (solo admin)
  async aprobarPago(pagoId: number, comentarios: string, token: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/pago/${pagoId}/aprobar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comentarios })
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error('Error al aprobar el pago');
      }

      return response.json();
    } catch (error) {
      console.error('Error en aprobarPago:', error);
      throw error;
    }
  },

  // Rechazar un pago (solo admin)
  async rechazarPago(pagoId: number, comentarios: string, token: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/pago/${pagoId}/rechazar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comentarios })
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error('Error al rechazar el pago');
      }

      return response.json();
    } catch (error) {
      console.error('Error en rechazarPago:', error);
      throw error;
    }
  },

  // Obtener detalles de un pago específico
  async obtenerPago(pagoId: number, token: string) {
    try {
      const response = await fetch(`http://localhost:3000/api/pago/${pagoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleAuthError();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        throw new Error('Error al obtener el pago');
      }

      return response.json();
    } catch (error) {
      console.error('Error en obtenerPago:', error);
      throw error;
    }
  }
};
