import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RecoverPassword from '../pages/RecoverPassword';
import NewIngredient from '../pages/NewIngredient';
import NewMenuItem from '../pages/NewMenuItem';
import ViewIngredients from '../pages/ViewIngredients';
import ViewMenuItems from '../pages/ViewMenuItems';

/**
 * Configuración principal de rutas de la aplicación
 */
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/nuevo-ingrediente" element={<NewIngredient />} />
        <Route path="/nuevo-item-menu" element={<NewMenuItem />} />
        <Route path="/ingredients" element={<ViewIngredients />} />
        <Route path="/menu-items" element={<ViewMenuItems />} />
        {/* Rutas futuras se agregarán aquí */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;