const API_BASE_URL = 'http://localhost:3000/api/transportista';

export const transportistaService = {
  async obtenerTransportistas() {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener transportistas');
      }

      const result = await response.json();
      console.log('Transportistas obtenidos:', result);
      
      return result.data || [];
    } catch (error) {
      console.error('Error al obtener transportistas:', error);
      throw error;
    }
  }
};
