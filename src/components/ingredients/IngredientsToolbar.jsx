import React from "react";
import { Search } from "lucide-react";

const IngredientsToolbar = ({
  styles,
  searchTerm,
  setSearchTerm,
  unitFilter,
  setUnitFilter,
  statusFilter,
  setStatusFilter,
  onFilterChange,
}) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onFilterChange();
            }}
            className={styles.searchInput}
            aria-label="Buscar ingredientes por nombre"
          />
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="unitFilter" className={styles.filterLabel}>
            Unidad:
          </label>
          <select
            id="unitFilter"
            value={unitFilter}
            onChange={(e) => {
              setUnitFilter(e.target.value);
              onFilterChange();
            }}
            className={styles.filterSelect}
            aria-label="Filtrar por unidad de medida"
          >
            <option value="Todas">Todas</option>
            <option value="gramos">Gramos</option>
            <option value="kilogramos">Kilogramos</option>
            <option value="mililitros">Mililitros</option>
            <option value="litros">Litros</option>
            <option value="unidades">Unidades</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="statusFilter" className={styles.filterLabel}>
            Estado:
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              onFilterChange();
            }}
            className={styles.filterSelect}
            aria-label="Filtrar por estado del stock"
          >
            <option value="Todos">Todos</option>
            <option value="OK">OK</option>
            <option value="Bajo">Bajo</option>
            <option value="Crítico">Crítico</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default IngredientsToolbar;
