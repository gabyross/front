import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Importar páginas públicas
import LandingPage from '../pages/LandingPage';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Recover from '../pages/auth/Recover';

// Página placeholder para dashboard (próximamente)
const Dashboard = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Dashboard - Próximamente</h1>
    <p>Esta será la página principal del dashboard de SmartStocker</p>
  </div>
);

// Página de error 404 para rutas no encontradas
const NotFound = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 - Página no encontrada</h1>
    <p>La página que buscas no existe</p>
  </div>
);

/**
 * Componente de ruta protegida que requiere autenticación
 * Redirige a login si el usuario no está autenticado
 */
const RutaProtegida = ({ children }) => {
  const { usuarioAutenticado, cargandoAutenticacion } = useAuth();

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (cargandoAutenticacion) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Redirigir a login si el usuario no está autenticado
  return usuarioAutenticado ? children : <Navigate to="/login" replace />;
};

/**
 * Componente de ruta pública que redirige si ya está autenticado
 * Evita que usuarios autenticados accedan a páginas de login/registro
 */
const RutaPublica = ({ children }) => {
  const { usuarioAutenticado, cargandoAutenticacion } = useAuth();

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (cargandoAutenticacion) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  // Redirigir a dashboard si el usuario ya está autenticado
  return !usuarioAutenticado ? children : <Navigate to="/dashboard" replace />;
};

/**
 * Configuración principal de rutas usando React Router v6
 * Define todas las rutas de la aplicación sin condicionales manuales
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Página de inicio - accesible para todos los usuarios */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Rutas de autenticación - solo para usuarios no autenticados */}
      <Route 
        path="/login" 
        element={
          <RutaPublica>
            <Login />
          </RutaPublica>
        } 
      />
      <Route 
        path="/registro" 
        element={
          <RutaPublica>
            <Register />
          </RutaPublica>
        } 
      />
      <Route 
        path="/recuperar" 
        element={
          <RutaPublica>
            <Recover />
          </RutaPublica>
        } 
      />
      
      {/* Rutas protegidas - solo para usuarios autenticados */}
      <Route 
        path="/dashboard" 
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        } 
      />
      
      {/* Ruta de error 404 para páginas no encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;