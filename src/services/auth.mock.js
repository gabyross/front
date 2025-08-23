/**
 * Servicio de autenticación mockeado usando localStorage
 * Simula operaciones de backend sin servidor real
 */

const USERS_KEY = 'smartstocker_users';
const AUTH_KEY = 'smartstocker_auth';

// Simular delay de red
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtener usuarios del localStorage
 */
const getUsers = () => {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error al leer usuarios:', error);
    return [];
  }
};

/**
 * Guardar usuarios en localStorage
 */
const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
  }
};

/**
 * Obtener sesión actual del localStorage
 */
const getCurrentAuth = () => {
  try {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  } catch (error) {
    console.error('Error al leer autenticación:', error);
    return null;
  }
};

/**
 * Guardar sesión en localStorage
 */
const saveAuth = (authData) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error al guardar autenticación:', error);
  }
};

/**
 * Registrar nuevo usuario
 */
export const register = async ({ nombre, email, password }) => {
  await delay();
  
  const users = getUsers();
  
  // Verificar si el email ya existe
  const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return {
      ok: false,
      message: 'Ya existe una cuenta con este email'
    };
  }
  
  // Crear nuevo usuario
  const newUser = {
    id: Date.now().toString(),
    nombre: nombre.trim(),
    email: email.toLowerCase().trim(),
    password, // En producción esto estaría hasheado
    createdAt: new Date().toISOString(),
    resetToken: null
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return {
    ok: true,
    message: 'Cuenta creada exitosamente'
  };
};

/**
 * Iniciar sesión
 */
export const login = async ({ email, password }) => {
  await delay();
  
  const users = getUsers();
  
  // Buscar usuario por email
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  
  if (!user || user.password !== password) {
    return {
      ok: false,
      message: 'Email o contraseña incorrectos'
    };
  }
  
  // Crear sesión
  const authData = {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    token: `mock-token-${Date.now()}`,
    loginAt: new Date().toISOString()
  };
  
  saveAuth(authData);
  
  return {
    ok: true,
    user: authData
  };
};

/**
 * Cerrar sesión
 */
export const logout = async () => {
  await delay(200);
  
  try {
    localStorage.removeItem(AUTH_KEY);
    return { ok: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { ok: false, message: 'Error al cerrar sesión' };
  }
};

/**
 * Solicitar recuperación de contraseña
 */
export const requestPasswordReset = async (email) => {
  await delay();
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
  
  // Siempre mostrar mensaje genérico por seguridad
  // pero internamente generar token si el usuario existe
  if (userIndex !== -1) {
    users[userIndex].resetToken = `reset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    users[userIndex].resetTokenExpiry = Date.now() + (60 * 60 * 1000); // 1 hora
    saveUsers(users);
  }
  
  return {
    ok: true,
    message: 'Si el email está registrado, recibirás instrucciones para recuperar tu contraseña'
  };
};

/**
 * Restablecer contraseña (opcional para futuro)
 */
export const resetPassword = async ({ email, token, newPassword }) => {
  await delay();
  
  const users = getUsers();
  const userIndex = users.findIndex(u => 
    u.email.toLowerCase() === email.toLowerCase().trim() &&
    u.resetToken === token &&
    u.resetTokenExpiry > Date.now()
  );
  
  if (userIndex === -1) {
    return {
      ok: false,
      message: 'Token inválido o expirado'
    };
  }
  
  // Actualizar contraseña y limpiar token
  users[userIndex].password = newPassword;
  users[userIndex].resetToken = null;
  users[userIndex].resetTokenExpiry = null;
  saveUsers(users);
  
  return {
    ok: true,
    message: 'Contraseña actualizada exitosamente'
  };
};

/**
 * Obtener usuario actual
 */
export const getCurrentUser = () => {
  return getCurrentAuth();
};

/**
 * Verificar si hay sesión activa
 */
export const isAuthenticated = () => {
  const auth = getCurrentAuth();
  return auth && auth.token;
};