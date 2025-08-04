import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  precio_oferta: number;
  imagen: string;
  cantidad: number;
}

interface CartContextType {
  carrito: ProductoCarrito[];
  agregarAlCarrito: (producto: ProductoCarrito) => boolean;
  quitarDelCarrito: (id: number) => void;
  vaciarCarrito: () => void;
  finalizarPedido: () => void;
  cargarCarrito: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};

// Función para obtener el ID del usuario actual
const getCurrentUserId = (): string | null => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.id ? userData.id.toString() : null;
    }
  } catch (error) {
    console.error('Error al obtener ID del usuario:', error);
  }
  return null;
};

// Función para obtener la clave del carrito específica del usuario
const getCartKey = (userId: string | null): string => {
  return userId ? `carrito_${userId}` : 'carrito_guest';
};

// Función para cargar el carrito desde localStorage
const loadCartFromStorage = (): ProductoCarrito[] => {
  try {
    const userId = getCurrentUserId();
    const cartKey = getCartKey(userId);
    const savedCart = localStorage.getItem(cartKey);
    
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error al cargar carrito desde localStorage:', error);
  }
  return [];
};

// Función para guardar el carrito en localStorage
const saveCartToStorage = (carrito: ProductoCarrito[]): void => {
  try {
    const userId = getCurrentUserId();
    const cartKey = getCartKey(userId);
    localStorage.setItem(cartKey, JSON.stringify(carrito));
  } catch (error) {
    console.error('Error al guardar carrito en localStorage:', error);
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);

  // Cargar carrito al inicializar o cuando cambie el usuario
  useEffect(() => {
    const carritoGuardado = loadCartFromStorage();
    setCarrito(carritoGuardado);
  }, []);

  // Guardar carrito cada vez que cambie
  useEffect(() => {
    if (carrito.length > 0) {
      saveCartToStorage(carrito);
    }
  }, [carrito]);

  const cargarCarrito = () => {
    const carritoGuardado = loadCartFromStorage();
    setCarrito(carritoGuardado);
  };

  const agregarAlCarrito = (producto: ProductoCarrito): boolean => {
    // Ya no requerimos que esté logueado para agregar al carrito
    // El carrito se guardará con el ID de usuario cuando esté disponible
    
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      let nuevoCarrito;
      
      if (existe) {
        nuevoCarrito = prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + producto.cantidad } : p
        );
      } else {
        nuevoCarrito = [...prev, producto];
      }
      
      // Guardar inmediatamente en localStorage
      saveCartToStorage(nuevoCarrito);
      return nuevoCarrito;
    });

    return true;
  };

  const quitarDelCarrito = (id: number) => {
    setCarrito((prev) => {
      const nuevoCarrito = prev.filter((p) => p.id !== id);
      saveCartToStorage(nuevoCarrito);
      return nuevoCarrito;
    });
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    // Limpiar también del localStorage
    const userId = getCurrentUserId();
    const cartKey = getCartKey(userId);
    localStorage.removeItem(cartKey);
  };

  const finalizarPedido = () => {
    // Esta función será llamada desde el componente FinalizarPedido
    // después de procesar exitosamente la pedido
    vaciarCarrito();
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, quitarDelCarrito, vaciarCarrito, finalizarPedido, cargarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
