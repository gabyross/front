import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as authService from '../services/auth.mock';

/**
 * Reducer para manejar los estados del contexto de autenticación
 */
const reductorAutenticacion = (state, action) => {
  switch (action.type) {
    case 'ESTABLECER_CARGA':
      return { ...state, cargandoAutenticacion: action.payload };
    
    case 'ESTABLECER_USUARIO':
      return { 
        ...state, 
        usuario: action.payload, 
        usuarioAutenticado: !!action.payload,
        cargandoAutenticacion: false 
      };
    
    case 'ESTABLECER_ERROR':
      return { ...state, error: action.payload, cargandoAutenticacion: false };
    
    case 'LIMPIAR_ERROR':
      return { ...state, error: null };
    
    case 'CERRAR_SESION':
      return { 
        ...state, 
        usuario: null, 
        usuarioAutenticado: false, 
        cargandoAutenticacion: false,
        error: null 
      };
    
    default:
      return state;
  }
};

// Estado inicial del contexto de autenticación
const initialState = {
  usuario: null,
  usuarioAutenticado: false,
  cargandoAutenticacion: true,
  error: null
};

const ContextoAutenticacion = createContext();

/**
 * Proveedor del contexto de autenticación
 * Maneja el estado global de autenticación y rehidrata desde localStorage
 */
export const ProveedorAutenticacion = ({ children }) => {
  const [estado, despachar] = useReducer(reductorAutenticacion, initialState);

  // Rehidratar sesión desde localStorage al cargar la aplicación
  // Esto permite mantener la sesión entre recargas de página
  useEffect(() => {
    const inicializarAutenticacion = () => {
      try {
        const usuarioActual = authService.getCurrentUser();
        if (usuarioActual) {
          despachar({ type: 'ESTABLECER_USUARIO', payload: usuarioActual });
        } else {
          despachar({ type: 'ESTABLECER_CARGA', payload: false });
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        despachar({ type: 'ESTABLECER_CARGA', payload: false });
      }
    };

    inicializarAutenticacion();
  }, []);

  /**
   * Función para iniciar sesión de usuario
   */
  const iniciarSesion = async (credenciales) => {
    try {
      despachar({ type: 'ESTABLECER_CARGA', payload: true });
      despachar({ type: 'LIMPIAR_ERROR' });
      
      const resultado = await authService.login(credenciales);
      
      if (resultado.ok) {
        despachar({ type: 'ESTABLECER_USUARIO', payload: resultado.user });
        return { ok: true };
      } else {
        despachar({ type: 'ESTABLECER_ERROR', payload: resultado.message });
        return { ok: false, message: resultado.message };
      }
    } catch (error) {
      const mensajeError = 'Error al iniciar sesión. Intenta nuevamente.';
      despachar({ type: 'ESTABLECER_ERROR', payload: mensajeError });
      return { ok: false, message: mensajeError };
    }
  };

  /**
   * Función para registrar nuevo usuario
   */
  const registrarUsuario = async (datosUsuario) => {
    try {
      despachar({ type: 'ESTABLECER_CARGA', payload: true });
      despachar({ type: 'LIMPIAR_ERROR' });
      
      const resultado = await authService.register(datosUsuario);
      
      if (resultado.ok) {
        despachar({ type: 'ESTABLECER_CARGA', payload: false });
        return { ok: true, message: resultado.message };
      } else {
        despachar({ type: 'ESTABLECER_ERROR', payload: resultado.message });
        return { ok: false, message: resultado.message };
      }
    } catch (error) {
      const mensajeError = 'Error al crear la cuenta. Intenta nuevamente.';
      despachar({ type: 'ESTABLECER_ERROR', payload: mensajeError });
      return { ok: false, message: mensajeError };
    }
  };

  /**
   * Función para cerrar sesión de usuario
   */
  const cerrarSesion = async () => {
    try {
      await authService.logout();
      despachar({ type: 'CERRAR_SESION' });
      return { ok: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar cierre de sesión local aunque falle el servicio
      despachar({ type: 'CERRAR_SESION' });
      return { ok: true };
    }
  };

  /**
   * Función para solicitar recuperación de contraseña
   */
  const solicitarRecuperacionContrasena = async (email) => {
    try {
      despachar({ type: 'ESTABLECER_CARGA', payload: true });
      despachar({ type: 'LIMPIAR_ERROR' });
      
      const resultado = await authService.requestPasswordReset(email);
      despachar({ type: 'ESTABLECER_CARGA', payload: false });
      
      return resultado;
    } catch (error) {
      const mensajeError = 'Error al procesar la solicitud. Intenta nuevamente.';
      despachar({ type: 'ESTABLECER_ERROR', payload: mensajeError });
      return { ok: false, message: mensajeError };
    }
  };

  /**
   * Función para limpiar mensajes de error
   */
  const limpiarError = () => {
    despachar({ type: 'LIMPIAR_ERROR' });
  };

  // Valor del contexto con estado y funciones
  const valorContexto = {
    ...estado,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    solicitarRecuperacionContrasena,
    limpiarError
  };

  return (
    <ContextoAutenticacion.Provider value={valorContexto}>
      {children}
    </ContextoAutenticacion.Provider>
  );
};

// Mantener compatibilidad con el nombre anterior
export const AuthProvider = ProveedorAutenticacion;

/**
 * Hook para usar el contexto de autenticación
 * Proporciona acceso al estado y funciones de autenticación
 */
export const useAuth = () => {
  const contexto = useContext(ContextoAutenticacion);
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de ProveedorAutenticacion');
  }
  return contexto;
};
