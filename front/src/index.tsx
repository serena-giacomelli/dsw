import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa createRoot desde react-dom/client
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './Context/CartContext.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Usa createRoot en lugar de render
  root.render(
    <React.StrictMode>
      <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}


