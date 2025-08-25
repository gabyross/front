import React from "react";
import { Edit, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import { formatQuantity, formatShortDate } from "../../utils/format.js";

const IngredientsTable = ({
  styles,
  data,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table} role="table">
        <thead>
          <tr>
            <th scope="col">
              <button
                className={styles.sortButton}
                onClick={() => onSort("nombre")}
                aria-label="Ordenar por nombre"
              >
                Nombre
                {sortColumn === "nombre" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col">
              <button
                className={styles.sortButton}
                onClick={() => onSort("unidadMedida")}
                aria-label="Ordenar por unidad"
              >
                Unidad
                {sortColumn === "unidadMedida" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col" data-align="right">
              <button
                className={styles.sortButton}
                onClick={() => onSort("cantidadEnStock")}
                aria-label="Ordenar por stock"
              >
                Stock
                {sortColumn === "cantidadEnStock" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col" data-align="right">
              <button
                className={styles.sortButton}
                onClick={() => onSort("cantidadMinima")}
                aria-label="Ordenar por mínimo"
              >
                Mín
                {sortColumn === "cantidadMinima" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col">
              <button
                className={styles.sortButton}
                onClick={() => onSort("status")}
                aria-label="Ordenar por estado"
              >
                Estado
                {sortColumn === "status" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col">
              <button
                className={styles.sortButton}
                onClick={() => onSort("updatedAt")}
                aria-label="Ordenar por fecha de actualización"
              >
                Actualizado
                {sortColumn === "updatedAt" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ingredient) => (
            <tr key={ingredient._id}>
              <td className={styles.nameCell}>{ingredient.nombre}</td>
              <td className={styles.unitCell}>{ingredient.unidadMedida}</td>
              <td className={styles.numCell}>
                {formatQuantity(
                  ingredient.cantidadEnStock,
                  ingredient.unidadMedida
                )}
              </td>
              <td className={styles.numCell}>
                {formatQuantity(
                  ingredient.cantidadMinima,
                  ingredient.unidadMedida
                )}
              </td>
              <td>
                <StatusBadge ingredient={ingredient} styles={styles} />
              </td>
              <td className={styles.dateCell}>
                {formatShortDate(ingredient.updatedAt)}
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => onEdit(ingredient._id)}
                    aria-label={`Editar ${ingredient.nombre}`}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDelete(ingredient._id)}
                    aria-label={`Eliminar ${ingredient.nombre}`}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientsTable;
