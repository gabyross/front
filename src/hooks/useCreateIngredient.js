import { useCallback, useState } from 'react';
import { createIngredient as createIngredientService } from '../services/ingredientsService.js';
import { DEFAULT_USER_ID } from '../config/env.js';

// Mapea el shape del formulario → shape de la API
function mapFormToApi(form) {
  const cantidadEnStock = form.stockQuantity?.toString().trim();
  const cantidadMinima = form.minimumQuantity?.toString().trim();

  return {
    nombre: form.name.trim(),
    unidadMedida: form.measurementUnit,
    cantidadEnStock,
    cantidadMinima,
  };
}

export function useCreateIngredient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [created, setCreated] = useState(null);

  const submit = useCallback(async (formData, { signal } = {}) => {
    setIsSubmitting(true);
    setError(null);
    setCreated(null);

    try {
      const payload = mapFormToApi(formData);
      const res = await createIngredientService({
        userId: DEFAULT_USER_ID, // luego se reemplaza por token/usuario del AuthContext
        data: payload,
        signal,
      });
      setCreated(res);
      return res;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submit, isSubmitting, error, created };
}
