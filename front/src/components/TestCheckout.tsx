import React, { useState } from "react";
import { pedidoService } from "../services/pedidoService";
import EmailTest from "./EmailTest";

const TestCheckout: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (step: string, data: any) => {
    setResults(prev => [...prev, { step, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const usuario = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');

      addResult('Usuario y Token', { 
        usuario: usuario, 
        token: token ? 'Presente' : 'Ausente',
        userId: usuario.id 
      });

      if (!token || !usuario.id) {
        addResult('Error', 'No hay usuario logueado');
        return;
      }

      // Test 1: Verificar conectividad general del backend
      try {
        const response = await fetch('http://localhost:3000/api/test-backend', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        addResult('Test Backend', { status: response.status, ok: response.ok });
      } catch (error) {
        addResult('Test Backend', { error: 'No se pudo conectar al backend' });
      }

      // Test 2: Crear pedido de prueba
      const pedidoData = {
        fecha_pedido: new Date().toISOString(),
        total: 100,
        tipo_entrega: "domicilio",
        estado: "pendiente",
        usuarios: [usuario.id] // Array para ManyToMany
      };

      addResult('Datos de pedido a enviar', pedidoData);

      try {
        const pedidoCreado = await pedidoService.crearPedido(pedidoData, token);
        addResult('Pedido creado exitosamente', pedidoCreado);

        // Test 3: Crear línea de pedido de prueba
        const lineaPedData = {
          cantidad: "1",
          precio_unitario: 100,
          productos: [1], // Array para ManyToMany
          pedido: pedidoCreado.data.id
        };

        addResult('Datos de línea de pedido a enviar', lineaPedData);

        try {
          const lineaCreada = await pedidoService.crearLineaPedido(lineaPedData, token);
          addResult('Línea de pedido creada exitosamente', lineaCreada);

          // Test 4: Crear pago de prueba
          const pagoData = {
            estado: "pendiente",
            metodo_pago: 1,
            pedidos: [pedidoCreado.data.id], // Array para ManyToMany
            usuarios: [usuario.id] // Array para ManyToMany
          };

          addResult('Datos de pago a enviar', pagoData);

          try {
            const pagoCreado = await pedidoService.crearPago(pagoData, token);
            addResult('Pago creado exitosamente', pagoCreado);
          } catch (error) {
            addResult('Error al crear pago', error);
          }
        } catch (error) {
          addResult('Error al crear línea de pedido', error);
        }
      } catch (error) {
        addResult('Error al crear pedido', error);
      }

    } catch (error) {
      addResult('Error general', error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Test de Checkout</h2>
      
      {/* Componente de prueba de email */}
      <EmailTest token={localStorage.getItem('token') || ''} />
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testBackendConnection}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            marginRight: '10px'
          }}
        >
          {loading ? 'Probando...' : 'Probar Flujo de Checkout'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px'
          }}
        >
          Limpiar Resultados
        </button>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px' }}>
        <h3>Resultados del Test:</h3>
        {results.length === 0 ? (
          <p>No hay resultados aún. Haz clic en "Probar Flujo de Checkout" para comenzar.</p>
        ) : (
          results.map((result, index) => (
            <div key={index} style={{ 
              marginBottom: '15px', 
              padding: '10px', 
              backgroundColor: 'white', 
              borderRadius: '3px',
              border: '1px solid #dee2e6'
            }}>
              <strong>{result.step}</strong> - {result.timestamp}
              <pre style={{ 
                marginTop: '5px', 
                fontSize: '12px', 
                backgroundColor: '#f1f3f4', 
                padding: '10px',
                borderRadius: '3px',
                overflow: 'auto'
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestCheckout;
