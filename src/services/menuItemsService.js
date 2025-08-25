import { apiGet } from '../api/client.js';

/**
 * Obtiene ítems de menú del usuario.
 * @param {{ userId: string, signal?: AbortSignal }} opts
 * @returns {Promise<Array>}
 */
export async function getMenuItems({ userId, signal }) {
  return apiGet('/items-menu', { params: { userId }, signal });
}
