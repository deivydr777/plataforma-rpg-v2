import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // AQUI ESTÁ A MUDANÇA: Importamos o App.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Renderizamos o componente App, que controla toda a aplicação */}
    <App />
  </React.StrictMode>
);