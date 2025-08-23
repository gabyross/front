import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Recover from '../pages/auth/Recover';

/**
 * Configuración principal de rutas de la aplicación
 */
const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar" element={<Recover />} />
          {/* Rutas futuras se agregarán aquí */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;