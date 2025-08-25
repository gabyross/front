import { useCallback, useEffect, useState } from 'react';
import { getIngredients } from '../services/ingredientsService.js';
import { DEFAULT_USER_ID } from '../config/env.js';

/** Normaliza tipos numéricos que puedan venir como string */
function normalize(items) {
  if (!Array.isArray(items)) return [];
  return items.map((it) => ({
    ...it,
    cantidadEnStock:
      typeof it.cantidadEnStock === 'string'
        ? parseFloat(it.cantidadEnStock)
        : it.cantidadEnStock,
    cantidadMinima:
      typeof it.cantidadMinima === 'string'
        ? parseFloat(it.cantidadMinima)
        : it.cantidadMinima,
  }));
}

/**
 * Hook para cargar ingredientes del usuario actual (desde .env por ahora).
 *
 * @param {Object} options
 * @param {number} [options.minDelayMs=0] - Retraso mínimo para mostrar skeleton.
 *
 * @returns {{
 *  ingredients: Array,
 *  isLoading: boolean,
 *  hasError: boolean,
 *  refresh: () => void
 * }}
 */
export function useIngredients({ minDelayMs = 0 } = {}) {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchIngredients = useCallback(async (signal, delayMs = 0) => {
    setIsLoading(true);
    setHasError(false);

    let aborted = false;
    const onAbort = () => { aborted = true; };
    signal?.addEventListener?.('abort', onAbort);

    try {
      const [json] = await Promise.all([
        getIngredients({ userId: DEFAULT_USER_ID, signal }),
        Promise.resolve(),
      ]);

      if (aborted) return;
      setIngredients(normalize(json));
    } catch (e) {
      if (!aborted) setHasError(true);
    } finally {
      if (!aborted) setIsLoading(false);
      signal?.removeEventListener?.('abort', onAbort);
    }
  }, []);

  // Carga inicial (con delay opcional para skeleton)
  useEffect(() => {
    const controller = new AbortController();
    fetchIngredients(controller.signal, minDelayMs);
    return () => controller.abort();
  }, [fetchIngredients, minDelayMs]);

  // Reintento/refresh manual sin delay extra
  const refresh = useCallback(() => {
    const controller = new AbortController();
    fetchIngredients(controller.signal, 0);
    return () => controller.abort();
  }, [fetchIngredients]);

  return { ingredients, isLoading, hasError, refresh };
}
