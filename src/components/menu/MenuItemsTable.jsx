import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { formatShortDate } from "../../utils/format.js";

const MenuItemsTable = ({
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
                onClick={() => onSort("codigo")}
                aria-label="Ordenar por código"
              >
                Código
                {sortColumn === "codigo" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
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
                onClick={() => onSort("ingredientsCount")}
                aria-label="Ordenar por cantidad de ingredientes"
              >
                Ingredientes
                {sortColumn === "ingredientsCount" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col">
              <button
                className={styles.sortButton}
                onClick={() => onSort("activo")}
                aria-label="Ordenar por estado activo"
              >
                Activo
                {sortColumn === "activo" && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </button>
            </th>
            <th scope="col">
              <button
                className={styles.sortButton}
                onClick={() => onSort("fecha_actualizacion")}
                aria-label="Ordenar por fecha de actualización"
              >
                Actualizado
                {sortColumn === "fecha_actualizacion" && (
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
          {data.map((item) => (
            <tr key={item._id}>
              <td className={styles.codeCell}>{item.codigo}</td>
              <td className={styles.nameCell}>{item.nombre}</td>
              <td className={styles.ingredientsCell}>
                <strong>{item.ingredientes?.length ?? 0}</strong>
              </td>
              <td>
                <span className={`${styles.statusBadge} ${item.activo ? styles.statusActive : styles.statusInactive}`}>
                  {item.activo ? "Sí" : "No"}
                </span>
              </td>
              <td className={styles.dateCell}>
                {formatShortDate(item.fecha_actualizacion)}
              </td>
              <td>
                <div className={styles.actions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => onEdit(item._id)}
                    aria-label={`Editar ${item.nombre}`}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => onDelete(item._id)}
                    aria-label={`Eliminar ${item.nombre}`}
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

export default MenuItemsTable;
