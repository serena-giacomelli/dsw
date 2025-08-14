import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa createRoot desde react-dom/client
import App from './app.tsx';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './Context/cartContext.tsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
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


