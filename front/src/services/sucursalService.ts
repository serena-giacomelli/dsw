export interface Sucursal {
  id: number;
  direccion: string;
  contacto: string;
  localidades: {
    id: number;
    nombre: string;
    provincia: {
      id: number;
      nombre: string;
    };
  }[];
}

export const sucursalService = {
  // Obtener todas las sucursales
  async obtenerSucursales(): Promise<Sucursal[]> {
    try {
      const response = await fetch('api/sucursal', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al obtener sucursales: ${response.status}`);
      }

      const result = await response.json();
      console.log('Datos raw del API de sucursales:', result);
      
      const sucursales = result.data || result || [];
      console.log('Sucursales parseadas:', sucursales);
      
      // Validar y normalizar los datos
      const sucursalesNormalizadas = sucursales.map((sucursal: any) => {
        console.log('Procesando sucursal:', sucursal);
        
        return {
          id: sucursal.id || 0,
          direccion: sucursal.direccion || 'Dirección no especificada',
          contacto: sucursal.contacto || 'Contacto no disponible',
          localidades: Array.isArray(sucursal.localidades) 
            ? sucursal.localidades.map((loc: any) => {
                console.log('Procesando localidad:', loc);
                return {
                  id: loc?.id || 0,
                  nombre: loc?.nombre || 'Sin nombre',
                  provincia: loc?.provincia ? {
                    id: loc.provincia.id || 0,
                    nombre: loc.provincia.nombre || 'Sin provincia'
                  } : { id: 0, nombre: 'Sin provincia' }
                };
              })
            : []
        };
      });
      
      console.log('Sucursales normalizadas finales:', sucursalesNormalizadas);
      return sucursalesNormalizadas;
    } catch (error) {
      console.error('Error en obtenerSucursales:', error);
      // Retornar array vacío en caso de error para evitar crashes
      return [];
    }
  },

  // Filtrar sucursales por ciudad/localidad
  filtrarSucursalesPorCiudad(sucursales: Sucursal[], ciudad: string): Sucursal[] {
    if (!ciudad || !sucursales || sucursales.length === 0) return sucursales || [];
    
    console.log('Filtrando sucursales por ciudad:', ciudad);
    console.log('Sucursales disponibles para filtrar:', sucursales);
    
    const ciudadLower = ciudad.toLowerCase().trim();
    
    const filtradas = sucursales.filter(sucursal => {
      // Verificar que la sucursal y sus localidades existan
      if (!sucursal || !sucursal.localidades || !Array.isArray(sucursal.localidades)) {
        console.log('Sucursal sin localidades válidas:', sucursal);
        return false;
      }
      
      // Buscar en nombres de localidades y provincias
      const coincide = sucursal.localidades.some(localidad => {
        if (!localidad || !localidad.nombre) return false;
        
        const nombreLocalidad = localidad.nombre.toLowerCase();
        const nombreProvincia = localidad.provincia?.nombre?.toLowerCase() || '';
        
        const coincideLocalidad = nombreLocalidad.includes(ciudadLower);
        const coincideProvincia = nombreProvincia.includes(ciudadLower);
        
        console.log(`Comparando "${ciudadLower}" con localidad "${nombreLocalidad}" y provincia "${nombreProvincia}"`, 
                   { coincideLocalidad, coincideProvincia });
        
        return coincideLocalidad || coincideProvincia;
      });
      
      console.log(`Sucursal ${sucursal.direccion} coincide:`, coincide);
      return coincide;
    });
    
    console.log('Sucursales filtradas:', filtradas);
    return filtradas;
  }
};
