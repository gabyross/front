import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as authService from '../services/auth.mock';

/**
 * Estados del contexto de autenticación
 */
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        loading: false 
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        loading: false,
        error: null 
      };
    
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const AuthContext = createContext();

/**
 * Provider del contexto de autenticación
 */
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Rehidratar sesión al cargar la app
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          dispatch({ type: 'SET_USER', payload: currentUser });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  /**
   * Iniciar sesión
   */
  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const result = await authService.login(credentials);
      
      if (result.ok) {
        dispatch({ type: 'SET_USER', payload: result.user });
        return { ok: true };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.message });
        return { ok: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { ok: false, message: errorMessage };
    }
  };

  /**
   * Registrar usuario
   */
  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const result = await authService.register(userData);
      
      if (result.ok) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return { ok: true, message: result.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.message });
        return { ok: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = 'Error al crear la cuenta. Intenta nuevamente.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { ok: false, message: errorMessage };
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      return { ok: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar logout local aunque falle
      dispatch({ type: 'LOGOUT' });
      return { ok: true };
    }
  };

  /**
   * Solicitar recuperación de contraseña
   */
  const requestPasswordReset = async (email) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const result = await authService.requestPasswordReset(email);
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return result;
    } catch (error) {
      const errorMessage = 'Error al procesar la solicitud. Intenta nuevamente.';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { ok: false, message: errorMessage };
    }
  };

  /**
   * Limpiar errores
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    requestPasswordReset,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;