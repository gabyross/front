import { apiPost } from '../api/client.js';

/**
 * Servicio para predicciones de ventas
 */

/**
 * Realiza inferencia en tiempo real para predicción de ventas
 * @param {Object} opts
 * @param {string[]} opts.itemMenuIds - Array de IDs de items del menú
 * @param {string[]} opts.fechas - Array de fechas en formato dd/mm/aaaa
 * @param {string[]} opts.turnos - Array de turnos ["M", "T", "N"]
 * @param {AbortSignal} [opts.signal] - Para abortar la request
 * @returns {Promise<Array>}
 */
export async function postRealtimeInference({ itemMenuIds, fechas, turnos, signal }) {
  const body = {
    itemMenuIds,
    fechas,
    turnos
  };
  
  return apiPost('/realtime-inference', { body, signal });
}