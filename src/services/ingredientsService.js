// Servicio focalizado en Ingredientes.
// Por ahora sólo lectura. Más adelante podés sumar create/update/delete.

import { apiGet } from '../api/client.js';

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

/** Ejemplos para futuro (cuando querramos agregar CRUD):
import { apiPost, apiPut, apiDelete } from '../api/client.js';

export function createIngredient({ userId, data, signal }) {
  return apiPost('/ingredientes', { body: { userId, ...data }, signal });
}

export function updateIngredient({ id, data, signal }) {
  return apiPut(`/ingredientes/${id}`, { body: data, signal });
}

export function deleteIngredient({ id, signal }) {
  return apiDelete(`/ingredientes/${id}`, { signal });
}
*/
