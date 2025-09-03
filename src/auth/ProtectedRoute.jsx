import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isDevAuthed } from './devAuth.js';

export default function ProtectedRoute() {
  // No hay auth real, así que no hay "loading": sólo miramos el flag dev.
  const authed = isDevAuthed();
  const location = useLocation();

  if (!authed) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
