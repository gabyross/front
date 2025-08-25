import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/common/Button";
import { Plus } from "lucide-react";

import { useMenuItems } from "../hooks/useMenuItems.js";
import { useIngredients } from "../hooks/useIngredients.js"; // ← cargamos ingredientes reales
import { makeIngredientsIndex, getIngredientRefStatus } from "../utils/ingredientsIndex.js";

import MenuItemsToolbar from "../components/menu/MenuItemsToolbar.jsx";
import MenuItemsTable from "../components/menu/MenuItemsTable.jsx";
import Pagination from "../components/ingredients/Pagination.jsx";
import { LoadingSkeleton, ErrorState, EmptyState } from "../components/ingredients/States.jsx";

import styles from "./ViewMenuItems.module.css";

const ITEMS_PER_PAGE = 10;

const ViewMenuItems = () => {
  const navigate = useNavigate();

  // Carga datos
  const { items, isLoading: loadingItems, hasError: errorItems, refresh: refreshItems } = useMenuItems({ minDelayMs: 1000 });
  const { ingredients, isLoading: loadingIngs, hasError: errorIngs, refresh: refreshIngs } = useIngredients({ minDelayMs: 0 });

  // Índice de ingredientes para lookups
  const ingIndex = useMemo(() => makeIngredientsIndex(ingredients), [ingredients]);

  // Estado UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [sortColumn, setSortColumn] = useState("nombre");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = loadingItems || loadingIngs;
  const hasError = errorItems || errorIngs;
  const refresh = () => { refreshItems(); refreshIngs(); };

  const handleFilterChange = () => setCurrentPage(1);
  const handleSort = (column) => {
    if (sortColumn === column) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortColumn(column); setSortDirection("asc"); }
    setCurrentPage(1);
  };

  const handleCreate = () => navigate("/nuevo-item-menu");
  const handleEdit = (id) => console.log("Editar ítem del menú:", id);
  const handleDelete = (id) => console.log("Eliminar ítem del menú:", id);

  const processed = useMemo(() => {
    let filtered = items;

    // búsqueda por código o nombre
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (it) =>
          it.codigo?.toLowerCase().includes(term) ||
          it.nombre?.toLowerCase().includes(term)
      );
    }

    // filtro por estado
    if (statusFilter !== "Todos") {
      const mustBeActive = statusFilter === "Activo";
      filtered = filtered.filter((it) => !!it.activo === mustBeActive);
    }

    // sort
    const toSort = [...filtered];
    toSort.sort((a, b) => {
      let av, bv;
      if (sortColumn === "codigo") {
        av = (a.codigo || "").toLowerCase(); bv = (b.codigo || "").toLowerCase();
      } else if (sortColumn === "nombre") {
        av = (a.nombre || "").toLowerCase(); bv = (b.nombre || "").toLowerCase();
      } else if (sortColumn === "ingredientsCount") {
        av = a.ingredientes?.length ?? 0; bv = b.ingredientes?.length ?? 0;
      } else if (sortColumn === "activo") {
        av = a.activo ? 1 : 0; bv = b.activo ? 1 : 0;
      } else if (sortColumn === "fecha_actualizacion") {
        av = new Date(a.fecha_actualizacion || 0).getTime();
        bv = new Date(b.fecha_actualizacion || 0).getTime();
      } else {
        av = 0; bv = 0;
      }

      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    const totalItems = toSort.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const pageData = toSort.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return { data: pageData, totalItems, totalPages, page: safePage, hasResults: totalItems > 0 };
  }, [items, searchTerm, statusFilter, sortColumn, sortDirection, currentPage]);

  return (
    <Layout isInternal={true}>
      <main className={styles.viewMenuItemsPage}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Menú</h1>
            <Button variant="primary" onClick={handleCreate}>
              <Plus size={16} />
              Agregar ítem
            </Button>
          </div>

          {/* Toolbar */}
          <MenuItemsToolbar
            styles={styles}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onFilterChange={handleFilterChange}
          />

          {/* Contador de resultados */}
          <div className={styles.resultsInfo} aria-live="polite">
            {!isLoading && !hasError && (
              <span>
                {processed.totalItems} resultado{processed.totalItems !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Contenido */}
          <div className={styles.content}>
            {isLoading ? (
              <LoadingSkeleton styles={styles} />
            ) : hasError ? (
              <ErrorState styles={styles} onRetry={refresh} />
            ) : !processed.hasResults ? (
              <EmptyState
                styles={styles}
                showCreate={!searchTerm && statusFilter === "Todos"}
                onCreate={handleCreate}
              />
            ) : (
              <>
                <MenuItemsTable
                  styles={styles}
                  data={processed.data}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  ingredientsIndex={ingIndex} // ← aquí pasamos el índice
                />
                <Pagination
                  styles={styles}
                  page={processed.page}
                  totalPages={processed.totalPages}
                  onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  onNext={() => setCurrentPage((p) => Math.min(processed.totalPages, p + 1))}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ViewMenuItems;
