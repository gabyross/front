/**
 * Formatea cantidades de stock con decimales si corresponde
 */
export const formatQuantity = (value, unit) => {
    const needsDecimals = unit === "kilogramos" || unit === "litros";
    return new Intl.NumberFormat("es-AR", {
      useGrouping: true,
      minimumFractionDigits: needsDecimals ? 2 : 0,
      maximumFractionDigits: needsDecimals ? 2 : 0,
    }).format(value);
  };
  
  /**
   * Formatea una fecha ISO a dd/mm/aa
   */
  export const formatShortDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };
  