import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';
import styles from './ViewIngredients.module.css';

/** Base de API; usa .env y normaliza la barra final. Fallback al endpoint de Postman. (ESP) */
const RAW_API_BASE =
  import.meta.env.VITE_API_URL
const API_BASE = typeof RAW_API_BASE === 'string' ? RAW_API_BASE.replace(/\/+$/, '') : '';
const USER_ID = 'ulises'; // TODO: reemplazar cuando exista autenticación real

/** Utilidades (ESP) */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatQuantity = (value, unit) => {
  const needsDecimals = unit === 'kilogramos' || unit === 'litros';
  return new Intl.NumberFormat('es-AR', {
    useGrouping: true,
    minimumFractionDigits: needsDecimals ? 2 : 0,
    maximumFractionDigits: needsDecimals ? 2 : 0,
  }).format(value);
};

const getStockStatus = (ingredient) => {
  if (ingredient.cantidadEnStock === 0) return 'Crítico';
  if (ingredient.cantidadEnStock < ingredient.cantidadMinima) return 'Bajo';
  return 'OK';
};

const formatShortDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const buildUrl = (path, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return `${API_BASE}${path}${qs ? `?${qs}` : ''}`;
};

const ViewIngredients = () => {
  const navigate = useNavigate();

  /** Datos reales */
  const [ingredients, setIngredients] = useState([]);

  /** Filtros/estado UI */
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const itemsPerPage = 10;

  /** Fetch real con abort y delay mínimo; evita bajar isLoading si fue abortado (ESP) */
  const fetchIngredients = useCallback(
    async (signal, { minDelayMs = 0 } = {}) => {
      setIsLoading(true);
      setHasError(false);

      let aborted = false;
      const onAbort = () => { aborted = true; };
      signal?.addEventListener?.('abort', onAbort);

      try {
        const url = buildUrl('/ingredientes', { userId: USER_ID });

        // Ejecutar fetch y delay en paralelo para garantizar tiempo mínimo de carga
        const resPromise = fetch(url, { method: 'GET', signal });
        const delayPromise = minDelayMs > 0 ? sleep(minDelayMs) : Promise.resolve();

        const [res] = await Promise.all([resPromise, delayPromise]);
        if (aborted) return; // si se abortó, no toques estado

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); // se espera un array

        const normalized = Array.isArray(json)
          ? json.map((it) => ({
              ...it,
              cantidadEnStock:
                typeof it.cantidadEnStock === 'string'
                  ? parseFloat(it.cantidadEnStock)
                  : it.cantidadEnStock,
              cantidadMinima:
                typeof it.cantidadMinima === 'string'
                  ? parseFloat(it.cantidadMinima)
                  : it.cantidadMinima,
            }))
          : [];

        setIngredients(normalized);
      } catch (err) {
        if (!aborted) setHasError(true);
      } finally {
        if (!aborted) setIsLoading(false);
        signal?.removeEventListener?.('abort', onAbort);
      }
    },
    []
  );

  /** Carga inicial: garantiza al menos 2s de “Cargando…” (ESP) */
  useEffect(() => {
    const controller = new AbortController();
    fetchIngredients(controller.signal, { minDelayMs: 2000 });
    return () => controller.abort();
  }, [fetchIngredients]);

  /** Procesamiento: filtros + orden + paginación en memoria (ESP) */
  const processedData = useMemo(() => {
    let filtered = ingredients;

    // Búsqueda por nombre
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((ing) => ing.nombre?.toLowerCase().includes(term));
    }

    // Filtro por unidad
    if (unitFilter !== 'Todas') {
      filtered = filtered.filter((ing) => ing.unidadMedida === unitFilter);
    }

    // Filtro por estado
    if (statusFilter !== 'Todos') {
      filtered = filtered.filter((ing) => getStockStatus(ing) === statusFilter);
    }

    // Ordenamiento (copiar antes de sort para no mutar estado)
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

    // Paginación
    const totalItems = toSort.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    const data = toSort.slice(startIndex, startIndex + itemsPerPage);

    return { data, totalItems, totalPages, hasResults: totalItems > 0, page: safePage };
  }, [
    ingredients,
    searchTerm,
    unitFilter,
    statusFilter,
    sortColumn,
    sortDirection,
    currentPage,
  ]);

  /** Ordenar columnas (ESP) */
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  /** Cambios de filtros/búsqueda (ESP) */
  const handleFilterChange = () => setCurrentPage(1);

  /** Acciones (stubs) */
  const handleCreate = () => navigate('/nuevo-ingrediente');
  const handleEdit = (id) => console.log('Editar ingrediente:', id);
  const handleDelete = (id) => console.log('Eliminar ingrediente:', id);

  /** Reintentar sin delay extra (ESP) */
  const handleRetry = () => {
    const controller = new AbortController();
    fetchIngredients(controller.signal);
  };

  /** Clase para badge de estado (ESP) */
  const getStatusClass = (ingredient) => {
    switch (getStockStatus(ingredient)) {
      case 'Crítico':
        return styles.statusCritical;
      case 'Bajo':
        return styles.statusLow;
      case 'OK':
        return styles.statusOk;
      default:
        return '';
    }
  };

  /** Skeleton (ESP) */
  const renderLoadingSkeleton = () => (
    <div className={styles.skeletonContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={styles.skeletonRow}>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
          <div className={styles.skeletonCell}></div>
        </div>
      ))}
    </div>
  );

  /** Error (ESP) */
  const renderError = () => (
    <div className={styles.errorState}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3 className={styles.errorTitle}>Error al cargar ingredientes</h3>
      <p className={styles.errorDescription}>
        Hubo un problema al obtener la lista de ingredientes. Inténtalo de nuevo.
      </p>
      <Button variant="primary" onClick={handleRetry}>
        <RefreshCw size={16} />
        Reintentar
      </Button>
    </div>
  );

  /** Empty (ESP) */
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📦</div>
      <h3 className={styles.emptyTitle}>No se encontraron ingredientes</h3>
      <p className={styles.emptyDescription}>
        {searchTerm || unitFilter !== 'Todas' || statusFilter !== 'Todos'
          ? 'Intenta ajustar los filtros de búsqueda.'
          : 'Comienza agregando tu primer ingrediente al inventario.'}
      </p>
      {!searchTerm && unitFilter === 'Todas' && statusFilter === 'Todos' && (
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={16} />
          Agregar ingrediente
        </Button>
      )}
    </div>
  );

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
                    handleFilterChange();
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
                    handleFilterChange();
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
                    handleFilterChange();
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

          {/* Contador de resultados */}
          <div className={styles.resultsInfo} aria-live="polite">
            {!isLoading && !hasError && (
              <span>
                {processedData.totalItems} resultado{processedData.totalItems !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Contenido principal */}
          <div className={styles.content}>
            {isLoading ? (
              renderLoadingSkeleton()
            ) : hasError ? (
              renderError()
            ) : !processedData.hasResults ? (
              renderEmptyState()
            ) : (
              <>
                {/* Tabla */}
                <div className={styles.tableContainer}>
                  <table className={styles.table} role="table">
                    <thead>
                      <tr>
                        <th scope="col">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('nombre')}
                            aria-label="Ordenar por nombre"
                          >
                            Nombre
                            {sortColumn === 'nombre' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th scope="col">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('unidadMedida')}
                            aria-label="Ordenar por unidad"
                          >
                            Unidad
                            {sortColumn === 'unidadMedida' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th scope="col" data-align="right">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('cantidadEnStock')}
                            aria-label="Ordenar por stock"
                          >
                            Stock
                            {sortColumn === 'cantidadEnStock' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th scope="col" data-align="right">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('cantidadMinima')}
                            aria-label="Ordenar por mínimo"
                          >
                            Mín
                            {sortColumn === 'cantidadMinima' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th scope="col">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('status')}
                            aria-label="Ordenar por estado"
                          >
                            Estado
                            {sortColumn === 'status' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th scope="col">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('updatedAt')}
                            aria-label="Ordenar por fecha de actualización"
                          >
                            Actualizado
                            {sortColumn === 'updatedAt' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedData.data.map((ingredient) => (
                        <tr key={ingredient._id}>
                          <td className={styles.nameCell}>{ingredient.nombre}</td>
                          <td className={styles.unitCell}>{ingredient.unidadMedida}</td>
                          <td className={styles.numCell}>
                            {formatQuantity(ingredient.cantidadEnStock, ingredient.unidadMedida)}
                          </td>
                          <td className={styles.numCell}>
                            {formatQuantity(ingredient.cantidadMinima, ingredient.unidadMedida)}
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${getStatusClass(ingredient)}`}>
                              {getStockStatus(ingredient)}
                            </span>
                          </td>
                          <td className={styles.dateCell}>{formatShortDate(ingredient.updatedAt)}</td>
                          <td>
                            <div className={styles.actions}>
                              <button
                                className={styles.actionButton}
                                onClick={() => handleEdit(ingredient._id)}
                                aria-label={`Editar ${ingredient.nombre}`}
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                onClick={() => handleDelete(ingredient._id)}
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

                {/* Paginación */}
                {processedData.totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      className={styles.paginationButton}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={processedData.page === 1}
                      aria-label="Página anterior"
                    >
                      Anterior
                    </button>

                    <div className={styles.paginationInfo}>
                      Página {processedData.page} de {processedData.totalPages}
                    </div>

                    <button
                      className={styles.paginationButton}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(processedData.totalPages, p + 1))
                      }
                      disabled={processedData.page === processedData.totalPages}
                      aria-label="Página siguiente"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ViewIngredients;
