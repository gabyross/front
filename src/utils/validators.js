/**
 * Funciones de validación reutilizables
 */

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida longitud mínima de contraseña
 * @param {string} password - Contraseña a validar
 * @param {number} minLength - Longitud mínima (default: 8)
 * @returns {boolean} - True si es válida
 */
export const isValidPassword = (password, minLength = 8) => {
  return password && password.length >= minLength;
};

/**
 * Valida que las contraseñas coincidan
 * @param {string} password - Contraseña original
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} - True si coinciden
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valida nombre completo (al menos 2 palabras)
 * @param {string} fullName - Nombre completo
 * @returns {boolean} - True si es válido
 */
export const isValidFullName = (fullName) => {
  return fullName && fullName.trim().split(' ').length >= 2;
};