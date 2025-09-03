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

import ProtectedRoute from '../auth/ProtectedRoute.jsx';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-password" element={<RecoverPassword />} />

        {/* Protegidas (dev-auth) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/nuevo-ingrediente" element={<NewIngredient />} />
          <Route path="/nuevo-item-menu" element={<NewMenuItem />} />
          <Route path="/ingredients" element={<ViewIngredients />} />
          <Route path="/menu-items" element={<ViewMenuItems />} />
        </Route>

      </Routes>
    </Router>
  );
};

export default AppRoutes;
