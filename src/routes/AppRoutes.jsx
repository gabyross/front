import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import RecuperarPassword from '../pages/RecuperarPassword';
import NewIngredient from '../pages/NewIngredient';

/**
 * Configuración principal de rutas de la aplicación
 */
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/nuevo-ingrediente" element={<NewIngredient />} />
        {/* Rutas futuras se agregarán aquí */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;