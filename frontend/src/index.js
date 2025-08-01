import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home'; // Importamos a Home diretamente
import { BrowserRouter } from 'react-router-dom'; // O useNavigate dentro da Home precisa disso

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Envolvemos a Home com o BrowserRouter para o 'navigate' não quebrar */}
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  </React.StrictMode>
);