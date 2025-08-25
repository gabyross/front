import React from "react";
import { Search } from "lucide-react";

const MenuItemsToolbar = ({
  styles,
  searchTerm,
  setSearchTerm,
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
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onFilterChange();
            }}
            className={styles.searchInput}
            aria-label="Buscar ítems del menú por código o nombre"
          />
        </div>
      </div>

      <div className={styles.filters}>
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
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MenuItemsToolbar;
