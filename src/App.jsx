import React from 'react';
import AppRoutes from './routes/AppRoutes';
import './assets/styles/globals.css';

/**
 * Componente principal de la aplicación SmartStocker
 * Nota: El routing y providers se manejan en main.jsx
 */
const App = () => {
  return (
    <AppRoutes />
  );
};

export default App;