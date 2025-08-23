import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';

/**
 * Configuración principal de rutas de la aplicación
 */
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* Rutas futuras se agregarán aquí */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;