// Utilidades para manejo de autenticación
export const authUtils = {
  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Obtener el token actual
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Obtener el usuario actual
  getUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Limpiar datos de autenticación
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar si el token es válido haciendo una petición al servidor
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch('https://dswback.onrender.comhttps://dswback.onrender.com/api/usuario', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expirado o inválido
        this.logout();
        return false;
      }

      return response.ok;
    } catch (error) {
      console.error('Error verificando token:', error);
      return false;
    }
  },

  // Manejar errores de autenticación
  handleAuthError(): void {
    this.logout();
    // Redirigir al login
    window.location.href = '/login';
  }
};
