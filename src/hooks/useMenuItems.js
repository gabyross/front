import { useCallback, useEffect, useState } from 'react';
import { getMenuItems } from '../services/menuItemsService.js';
import { DEFAULT_USER_ID } from '../config/env.js';

// Normalización mínima (por si vinieran strings en números/booleanos en el futuro)
function normalize(items) {
  if (!Array.isArray(items)) return [];
  return items.map((it) => ({
    ...it,
    ingredientes: Array.isArray(it.ingredientes) ? it.ingredientes : [],
  }));
}

/**
 * Carga de ítems de menú (con delay opcional para skeleton)
 */
export function useMenuItems({ minDelayMs = 0 } = {}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchItems = useCallback(async (signal, delayMs = 0) => {
    setIsLoading(true);
    setHasError(false);

    let aborted = false;
    const onAbort = () => { aborted = true; };
    signal?.addEventListener?.('abort', onAbort);

    try {
      const [json] = await Promise.all([
        getMenuItems({ userId: DEFAULT_USER_ID, signal }),
        delayMs > 0 ? new Promise(r => setTimeout(r, delayMs)) : Promise.resolve(),
      ]);
      if (aborted) return;
      setItems(normalize(json));
    } catch (e) {
      if (!aborted) setHasError(true);
    } finally {
      if (!aborted) setIsLoading(false);
      signal?.removeEventListener?.('abort', onAbort);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchItems(controller.signal, minDelayMs);
    return () => controller.abort();
  }, [fetchItems, minDelayMs]);

  const refresh = useCallback(() => {
    const controller = new AbortController();
    fetchItems(controller.signal, 0);
    return () => controller.abort();
  }, [fetchItems]);

  return { items, isLoading, hasError, refresh };
}
