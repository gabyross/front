// Crea un índice Map por _id para lookups O(1)
export const makeIngredientsIndex = (ingredients = []) =>
    new Map(ingredients.map((ing) => [ing._id, ing]));
  
  /** Devuelve el nombre del ingrediente o "(desconocido)" */
  export const resolveIngredientName = (id, index) => {
    const ing = index.get(id);
    return ing?.nombre ?? "(desconocido)";
  };
  
  /** Devuelve la unidad del ingrediente (o undefined si no existe) */
  export const resolveIngredientUnit = (id, index) => {
    return index.get(id)?.unidadMedida;
  };
  
  /**
   * Estado de la referencia de ingrediente:
   * - NOT_FOUND: no existe el ingrediente en el índice
   * - OUT_OF_STOCK: existe pero stock <= 0
   * - OK: existe y stock > 0
   * (Si en el futuro querés comparar contra cantidad_requerida, podemos sumar 'LOW')
   */
  export const getIngredientRefStatus = (ref, index) => {
    const ing = index.get(ref.ingrediente_id);
    if (!ing) return "NOT_FOUND";
    if (!ing.cantidadEnStock || ing.cantidadEnStock <= 0) return "OUT_OF_STOCK";
    return "OK";
  };
  