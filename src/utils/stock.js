export const getStockStatus = (ingredient) => {
    if (ingredient.cantidadEnStock === 0) return "Crítico";
    if (ingredient.cantidadEnStock < ingredient.cantidadMinima) return "Bajo";
    return "OK";
  };
  