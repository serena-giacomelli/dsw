import React, { useState } from 'react';

interface EmailTestProps {
  token: string;
}

const EmailTest: React.FC<EmailTestProps> = ({ token }) => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [emailTest, setEmailTest] = useState('');
  const [sendTestResult, setSendTestResult] = useState<any>(null);
  const [sendingTest, setSendingTest] = useState(false);

  const testEmailConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://dswback.onrender.comhttps://dswback.onrender.com/api/pedido/test-email', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error('Error al probar configuración de email:', error);
      setTestResult({
        configurado: false,
        message: 'Error de conexión con el servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!emailTest) {
      alert('Por favor, ingresa un email para la prueba');
      return;
    }

    setSendingTest(true);
    try {
      const response = await fetch('https://dswback.onrender.comhttps://dswback.onrender.com/api/pedido/test-email-send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailTest })
      });

      const result = await response.json();
      setSendTestResult(result);
    } catch (error) {
      console.error('Error al enviar email de prueba:', error);
      setSendTestResult({
        enviado: false,
        message: 'Error de conexión con el servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      margin: '20px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🧪 Prueba de Configuración de Email</h3>
      
      <button 
        onClick={testEmailConfig}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          marginRight: '10px'
        }}
      >
        {loading ? 'Probando...' : 'Probar Configuración'}
      </button>

      {/* Nuevo: Test de envío */}
      <div style={{ marginTop: '15px' }}>
        <h4>📤 Enviar Email de Prueba</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="tu-email@gmail.com"
            value={emailTest}
            onChange={(e) => setEmailTest(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '200px'
            }}
          />
          <button
            onClick={sendTestEmail}
            disabled={sendingTest || !emailTest}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: sendingTest || !emailTest ? 'not-allowed' : 'pointer',
              opacity: sendingTest || !emailTest ? 0.6 : 1
            }}
          >
            {sendingTest ? 'Enviando...' : 'Enviar Prueba'}
          </button>
        </div>
      </div>

      {testResult && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          borderRadius: '5px',
          backgroundColor: testResult.configurado ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.configurado ? '#c3e6cb' : '#f5c6cb'}`,
          color: testResult.configurado ? '#155724' : '#721c24'
        }}>
          <h4>{testResult.configurado ? '✅ Configuración OK' : '❌ Error de Configuración'}</h4>
          
          <p><strong>Mensaje:</strong> {testResult.message}</p>
          
          {testResult.smtp && (
            <div>
              <p><strong>Servicio:</strong> {testResult.smtp.servicio}</p>
              <p><strong>Usuario:</strong> {testResult.smtp.usuario}</p>
            </div>
          )}

          {testResult.solucion && (
            <div style={{ marginTop: '10px', fontWeight: 'bold' }}>
              <p>💡 <strong>Solución:</strong> {testResult.solucion}</p>
            </div>
          )}

          {testResult.error && (
            <div style={{ marginTop: '10px' }}>
              <p><strong>Error técnico:</strong> {testResult.error}</p>
            </div>
          )}
        </div>
      )}

      {/* Resultado del test de envío */}
      {sendTestResult && (
        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          borderRadius: '5px',
          backgroundColor: sendTestResult.enviado ? '#d4edda' : '#f8d7da',
          border: `1px solid ${sendTestResult.enviado ? '#c3e6cb' : '#f5c6cb'}`,
          color: sendTestResult.enviado ? '#155724' : '#721c24'
        }}>
          <h4>{sendTestResult.enviado ? '✅ Email Enviado' : '❌ Error al Enviar'}</h4>
          <p><strong>Mensaje:</strong> {sendTestResult.message}</p>
          {sendTestResult.destinatario && (
            <p><strong>Destinatario:</strong> {sendTestResult.destinatario}</p>
          )}
          {sendTestResult.error && (
            <p><strong>Error:</strong> {sendTestResult.error}</p>
          )}
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <h4>📋 Para configurar el email:</h4>
        <ol>
          <li>Configura <code>GMAIL_USER</code> y <code>GMAIL_APP_PASSWORD</code> en el archivo <code>.env</code></li>
          <li>Habilita la verificación en 2 pasos en Gmail</li>
          <li>Genera una contraseña de aplicación en Google</li>
          <li>Reinicia el servidor backend</li>
        </ol>
      </div>
    </div>
  );
};

export default EmailTest;
