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
      console.log('🔍 Iniciando obtención de sucursales...');
      console.log('🌐 URL del API:', 'https://dswback.onrender.com/api/sucursal (proxy -> https://dswback.onrender.com/api/sucursal)');
      
      const response = await fetch('https://dswback.onrender.com/api/sucursal', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error al obtener sucursales: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Datos raw del API de sucursales:', result);
      
      const sucursales = result.data || result || [];
      console.log('🏢 Sucursales parseadas:', sucursales);
      
      if (!Array.isArray(sucursales)) {
        console.error('❌ Los datos recibidos no son un array:', typeof sucursales);
        return [];
      }
      
      // Validar y normalizar los datos
      const sucursalesNormalizadas = sucursales.map((sucursal: any) => {
        console.log('🔧 Procesando sucursal:', sucursal);
        
        return {
          id: sucursal.id || 0,
          direccion: sucursal.direccion || 'Dirección no especificada',
          contacto: sucursal.contacto || 'Contacto no disponible',
          localidades: Array.isArray(sucursal.localidades) 
            ? sucursal.localidades.map((loc: any) => {
                console.log('📍 Procesando localidad:', loc);
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
      
      console.log('✅ Sucursales normalizadas finales:', sucursalesNormalizadas);
      return sucursalesNormalizadas;
    } catch (error) {
      console.error('❌ Error en obtenerSucursales:', error);
      
      // Mostrar información adicional del error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error('🔌 Error de conectividad: No se puede conectar al servidor');
        console.error('💡 Verifica que el servidor backend esté ejecutándose en https://dswback.onrender.com');
      }
      
      // Retornar array vacío en caso de error para evitar crashes
      return [];
    }
  },

  // Filtrar sucursales por ciudad/localidad
  filtrarSucursalesPorCiudad(sucursales: Sucursal[], ciudad: string): Sucursal[] {
    if (!sucursales || sucursales.length === 0) {
      console.log('⚠️ No hay sucursales para filtrar');
      return [];
    }
    
    if (!ciudad || ciudad.trim() === '') {
      console.log('ℹ️ No hay ciudad especificada, devolviendo todas las sucursales');
      return sucursales;
    }
    
    console.log('🔍 Filtrando sucursales por ciudad:', ciudad);
    console.log('🏢 Sucursales disponibles para filtrar:', sucursales.length);
    
    const ciudadLower = ciudad.toLowerCase().trim();
    
    const filtradas = sucursales.filter(sucursal => {
      // Verificar que la sucursal y sus localidades existan
      if (!sucursal || !sucursal.localidades || !Array.isArray(sucursal.localidades)) {
        console.log('⚠️ Sucursal sin localidades válidas:', sucursal);
        return false;
      }
      
      if (sucursal.localidades.length === 0) {
        console.log('⚠️ Sucursal sin localidades:', sucursal.direccion);
        return false;
      }
      
      // Buscar en nombres de localidades y provincias
      const coincide = sucursal.localidades.some(localidad => {
        if (!localidad || !localidad.nombre) {
          console.log('⚠️ Localidad sin datos válidos:', localidad);
          return false;
        }
        
        const nombreLocalidad = localidad.nombre.toLowerCase();
        const nombreProvincia = localidad.provincia?.nombre?.toLowerCase() || '';
        
        const coincideLocalidad = nombreLocalidad.includes(ciudadLower);
        const coincideProvincia = nombreProvincia.includes(ciudadLower);
        
        console.log(`🔄 Comparando "${ciudadLower}" con:`, {
          localidad: nombreLocalidad,
          provincia: nombreProvincia,
          coincideLocalidad,
          coincideProvincia
        });
        
        return coincideLocalidad || coincideProvincia;
      });
      
      console.log(`${coincide ? '✅' : '❌'} Sucursal "${sucursal.direccion}" ${coincide ? 'coincide' : 'no coincide'}`);
      return coincide;
    });
    
    console.log(`📊 Resultado del filtrado: ${filtradas.length} de ${sucursales.length} sucursales`);
    
    // Si no se encontraron coincidencias exactas, intentar búsqueda más flexible
    if (filtradas.length === 0 && ciudadLower.length > 2) {
      console.log('🔄 Intentando búsqueda más flexible...');
      
      const filtroFlexible = sucursales.filter(sucursal => {
        if (!sucursal?.localidades) return false;
        
        return sucursal.localidades.some(localidad => {
          if (!localidad?.nombre) return false;
          
          const nombreLocalidad = localidad.nombre.toLowerCase();
          const nombreProvincia = localidad.provincia?.nombre?.toLowerCase() || '';
          
          // Búsqueda más flexible: contiene palabras parciales
          const palabrasCiudad = ciudadLower.split(' ');
          return palabrasCiudad.some(palabra => 
            palabra.length > 2 && (
              nombreLocalidad.includes(palabra) || 
              nombreProvincia.includes(palabra)
            )
          );
        });
      });
      
      if (filtroFlexible.length > 0) {
        console.log(`✅ Búsqueda flexible encontró ${filtroFlexible.length} sucursales`);
        return filtroFlexible;
      }
    }
    
    console.log('📋 Sucursales filtradas finales:', filtradas);
    return filtradas;
  }
};
