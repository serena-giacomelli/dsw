import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Especificamos que 'root' puede ser un elemento HTML o null
const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

