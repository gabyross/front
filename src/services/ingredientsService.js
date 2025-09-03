// Servicio focalizado en Ingredientes.
// Por ahora sólo lectura. Más adelante podés sumar create/update/delete.

import { apiGet, apiPost } from '../api/client.js';

/**
 * Obtiene la lista de ingredientes del usuario.
 * @param {Object} opts
 * @param {string} opts.userId - id de usuario (por ahora viene de .env)
 * @param {AbortSignal} [opts.signal] - para abortar la request
 * @returns {Promise<Array>}
 */
export async function getIngredients({ userId, signal }) {
  return apiGet('/ingredientes', { params: { userId }, signal });
}

/**
 * Crea un ingrediente
 * data debe venir con shape de API: { nombre, unidadMedida, cantidadEnStock, cantidadMinima }
 * Por ahora se envía userId desde .env; luego lo tomaremos del token.
 */
export async function createIngredient({ userId, data, signal }) {
  const body = { ...data, userId }; // backend espera userId en el body
  return apiPost('/ingredientes', { body, signal });
}