import React, { useState, useEffect } from "react";

interface CarritoGuardado {
  userId: string;
  productos: Array<{
    id: number;
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  fechaCreacion: string;
  total: number;
}

const AdminCarritos: React.FC = () => {
  const [carritos, setCarritos] = useState<CarritoGuardado[]>([]);

  useEffect(() => {
    cargarCarritosGuardados();
  }, []);

  const cargarCarritosGuardados = () => {
    const carritosEncontrados: CarritoGuardado[] = [];
    
    // Buscar todos los carritos en localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('carrito_') && key !== 'carrito_guest') {
        try {
          const carritoData = localStorage.getItem(key);
          if (carritoData) {
            const productos = JSON.parse(carritoData);
            if (productos.length > 0) {
              const total = productos.reduce((acc: number, p: any) => {
                const precio = p.precio_oferta > 0 ? p.precio_oferta : p.precio;
                return acc + (precio * p.cantidad);
              }, 0);

              carritosEncontrados.push({
                userId: key.replace('carrito_', ''),
                productos: productos.map((p: any) => ({
                  id: p.id,
                  nombre: p.nombre,
                  cantidad: p.cantidad,
                  precio: p.precio_oferta > 0 ? p.precio_oferta : p.precio
                })),
                fechaCreacion: 'No disponible', 
                total: total
              });
            }
          }
        } catch (error) {
          console.error('Error al cargar carrito:', key, error);
        }
      }
    }
    
    setCarritos(carritosEncontrados);
  };

  const eliminarCarrito = (userId: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el carrito del usuario ${userId}?`)) {
      localStorage.removeItem(`carrito_${userId}`);
      cargarCarritosGuardados();
    }
  };

  const limpiarCarritosVacios = () => {
    let eliminados = 0;
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('carrito_')) {
        try {
          const carritoData = localStorage.getItem(key);
          if (carritoData) {
            const productos = JSON.parse(carritoData);
            if (productos.length === 0) {
              localStorage.removeItem(key);
              eliminados++;
            }
          }
        } catch (error) {
          // Si hay error al parsear, eliminar también
          localStorage.removeItem(key!);
          eliminados++;
        }
      }
    }
    
    alert(`Se eliminaron ${eliminados} carritos vacíos`);
    cargarCarritosGuardados();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Administrar Carritos de Usuarios</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={cargarCarritosGuardados}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer'
          }}
        >
          Actualizar Lista
        </button>
        
        <button 
          onClick={limpiarCarritosVacios}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ffc107', 
            color: 'black', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Limpiar Carritos Vacíos
        </button>
      </div>

      {carritos.length === 0 ? (
        <p>No hay carritos guardados.</p>
      ) : (
        <div>
          <p><strong>Total de carritos:</strong> {carritos.length}</p>
          
          {carritos.map((carrito, index) => (
            <div 
              key={index}
              style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                marginBottom: '15px',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Usuario ID: {carrito.userId}</h3>
                <button
                  onClick={() => eliminarCarrito(carrito.userId)}
                  style={{
                    padding: '5px 15px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Eliminar Carrito
                </button>
              </div>
              
              <p><strong>Total:</strong> ${carrito.total.toFixed(2)}</p>
              <p><strong>Productos ({carrito.productos.length}):</strong></p>
              
              <ul>
                {carrito.productos.map((producto, prodIndex) => (
                  <li key={prodIndex}>
                    {producto.nombre} - Cantidad: {producto.cantidad} - Precio: ${producto.precio.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCarritos;
