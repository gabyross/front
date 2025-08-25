import React, { useState } from "react";
import { Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { formatShortDate } from "../../utils/format.js";
import {
  resolveIngredientName,
  resolveIngredientUnit,
  getIngredientRefStatus,
} from "../../utils/ingredientsIndex.js";

const MenuItemsTable = ({
  styles,
  data,
  sortColumn,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  ingredientsIndex, // Map<_id, ingrediente>
}) => {
  const [expanded, setExpanded] = useState(new Set());

  const toggleRow = (id) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const getIngredientStatusClass = (status) => {
    if (status === "OK") return styles.ingredientStatusOk;
    if (status === "OUT_OF_STOCK") return styles.ingredientStatusOutOfStock;
    if (status === "NOT_FOUND") return styles.ingredientStatusNotFound;
    return "";
  };

  // Solo número; tooltip con nombres
  const renderIngredientsCount = (item) => {
    const count = item.ingredientes?.length ?? 0;
    const names =
      count > 0
        ? item.ingredientes
            .map((ref) => resolveIngredientName(ref.ingrediente_id, ingredientsIndex))
            .join(", ")
        : "";
    return (
      <span title={names || undefined}>
        <strong>{count}</strong>
      </span>
    );
  };

  const renderExpandedRow = (item) => {
    if (!expanded.has(item._id)) return null;

    const rows = item.ingredientes ?? [];

    return (
      <tr key={`${item._id}-expanded`} className={styles.expandedRow}>
        {/* colSpan = todas las columnas visibles (incluye la de expandir) */}
        <td colSpan={7} className={styles.expandedContent}>
          <div className={styles.ingredientDetails}>
            <h4 className={styles.detailsTitle}>Ingredientes requeridos</h4>

            {rows.length === 0 ? (
              <p className={styles.noIngredients}>Este ítem no requiere ingredientes.</p>
            ) : (
              <table className={styles.subTable} role="table">
                <thead>
                  <tr>
                    <th>Ingrediente</th>
                    <th className={styles.subQtyCol}>Cantidad</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((ref) => {
                    const name = resolveIngredientName(ref.ingrediente_id, ingredientsIndex);
                    const unit =
                      resolveIngredientUnit(ref.ingrediente_id, ingredientsIndex) || "unidad(es)";
                    const status = getIngredientRefStatus(ref, ingredientsIndex);

                    return (
                      <tr key={ref._id}>
                        <td className={styles.subIngName}>{name}</td>
                        <td className={styles.subIngQty}>
                          {ref.cantidad_requerida} {unit}
                        </td>
                        <td>
                          <span
                            className={`${styles.ingredientStatusBadge} ${getIngredientStatusClass(
                              status
                            )}`}
                          >
                            {status === "OK" && "OK"}
                            {status === "OUT_OF_STOCK" && "Sin stock"}
                            {status === "NOT_FOUND" && "No encontrado"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table} role="table">
        <thead>
          <tr>
            <th scope="col" className={styles.expandColumn}></th>
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
            <React.Fragment key={item._id}>
              <tr>
                <td className={styles.expandCell}>
                  <button
                    className={styles.expandButton}
                    onClick={() => toggleRow(item._id)}
                    aria-label={`${expanded.has(item._id) ? "Contraer" : "Expandir"} detalles de ${item.nombre}`}
                    title={expanded.has(item._id) ? "Contraer detalles" : "Ver detalles"}
                  >
                    {expanded.has(item._id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </td>
                <td className={styles.codeCell}>{item.codigo}</td>
                <td className={styles.nameCell}>{item.nombre}</td>
                <td className={styles.ingredientsCell}>
                  {renderIngredientsCount(item)}
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      item.activo ? styles.statusActive : styles.statusInactive
                    }`}
                  >
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

              {renderExpandedRow(item)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuItemsTable;
