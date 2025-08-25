import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { Plus } from 'lucide-react';

import { useIngredients } from '../hooks/useIngredients.js';
import IngredientsToolbar from '../components/ingredients/IngredientsToolbar.jsx';
import IngredientsTable from '../components/ingredients/IngredientsTable.jsx';
import Pagination from '../components/ingredients/Pagination.jsx';
import { LoadingSkeleton, ErrorState, EmptyState } from '../components/ingredients/States.jsx';
import { getStockStatus } from '../utils/stock.js';

import styles from './ViewIngredients.module.css';

const ITEMS_PER_PAGE = 10;

const ViewIngredients = () => {
  const navigate = useNavigate();

  // Carga de datos (con delay inicial de 2s, como tu versión original)
  const { ingredients, isLoading, hasError, refresh } = useIngredients({ minDelayMs: 2000 });

  // Estado UI
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = () => setCurrentPage(1);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleCreate = () => navigate('/nuevo-ingrediente');
  const handleEdit = (id) => console.log('Editar ingrediente:', id);
  const handleDelete = (id) => console.log('Eliminar ingrediente:', id);

  // Filtros + orden + paginación (memoria)
  const processed = useMemo(() => {
    let filtered = ingredients;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((ing) => ing.nombre?.toLowerCase().includes(term));
    }

    if (unitFilter !== 'Todas') {
      filtered = filtered.filter((ing) => ing.unidadMedida === unitFilter);
    }

    if (statusFilter !== 'Todos') {
      filtered = filtered.filter((ing) => getStockStatus(ing) === statusFilter);
    }

    const toSort = [...filtered];
    toSort.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (sortColumn === 'status') {
        aValue = getStockStatus(a);
        bValue = getStockStatus(b);
      }
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    const totalItems = toSort.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const pageData = toSort.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return { data: pageData, totalItems, totalPages, page: safePage, hasResults: totalItems > 0 };
  }, [ingredients, searchTerm, unitFilter, statusFilter, sortColumn, sortDirection, currentPage]);

  return (
    <Layout isInternal={true}>
      <main className={styles.viewIngredientsPage}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Ingredientes</h1>
            <Button variant="primary" onClick={handleCreate}>
              <Plus size={16} />
              Agregar ingrediente
            </Button>
          </div>

          {/* Toolbar */}
          <IngredientsToolbar
            styles={styles}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            unitFilter={unitFilter}
            setUnitFilter={setUnitFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onFilterChange={handleFilterChange}
          />

          {/* Contador de resultados */}
          <div className={styles.resultsInfo} aria-live="polite">
            {!isLoading && !hasError && (
              <span>
                {processed.totalItems} resultado{processed.totalItems !== 1 ? 's' : ''}
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
                showCreate={!searchTerm && unitFilter === 'Todas' && statusFilter === 'Todos'}
                onCreate={handleCreate}
              />
            ) : (
              <>
                <IngredientsTable
                  styles={styles}
                  data={processed.data}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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

export default ViewIngredients;
