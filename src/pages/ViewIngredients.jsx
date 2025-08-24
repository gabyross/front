import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react';
import styles from './ViewIngredients.module.css';

// Base de API con fallback; userId hardcodeado hasta tener auth
const API_BASE = import.meta.env.VITE_API_URL ?? 'https://nwlvr7r0v4.execute-api.us-east-1.amazonaws.com/Prod';
const USER_ID = 'ulises'; // TODO: reemplazar cuando exista autenticación

/**
 * Helper para formatear cantidades según unidad
 */
const formatQuantity = (value, unit) => {
  const needsDecimals = unit === 'kilogramos' || unit === 'litros';
  return new Intl.NumberFormat('es-AR', {
    useGrouping: true,
    minimumFractionDigits: needsDecimals ? 2 : 0,
    maximumFractionDigits: needsDecimals ? 2 : 0,
  }).format(value);
};

/**
 * Helper para determinar el estado del stock
 */
const getStockStatus = (ingredient) => {
  if (ingredient.cantidadEnStock === 0) return 'Crítico';
  if (ingredient.cantidadEnStock < ingredient.cantidadMinima) return 'Bajo';
  return 'OK';
};

/**
 * Helper para formatear fecha en formato corto
 */
const formatShortDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};

/**
 * Página para visualizar la lista de ingredientes
 */
const ViewIngredients = () => {
  const navigate = useNavigate();

  // Estado para datos de ingredientes
  const [ingredients, setIngredients] = useState([]);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const itemsPerPage = 10;

  // Carga inicial desde API real
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const res = await fetch(`${API_BASE}/ingredientes?userId=${encodeURIComponent(USER_ID)}`, { 
          signal: controller.signal 
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); // array
        const normalized = Array.isArray(json) ? json.map(it => ({
          ...it,
          cantidadEnStock: typeof it.cantidadEnStock === 'string' ? parseFloat(it.cantidadEnStock) : it.cantidadEnStock,
          cantidadMinima: typeof it.cantidadMinima === 'string' ? parseFloat(it.cantidadMinima) : it.cantidadMinima,
        })) : [];
        setIngredients(normalized);
      } catch (e) { 
        if (e.name !== 'AbortError') setHasError(true); 
      }
      finally { 
        setIsLoading(false); 
      }
    })();
    return () => controller.abort();
  }, []);

  // Datos filtrados, ordenados y paginados
  const processedData = useMemo(() => {
    let filtered = ingredients;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(ingredient =>
        ingredient.nombre.toLowerCase().includes(term)
      );
    }

    // Filtro por unidad
    if (unitFilter !== 'Todas') {
      filtered = filtered.filter(ingredient =>
        ingredient.unidadMedida === unitFilter
      );
    }

    // Filtro por estado
    if (statusFilter !== 'Todos') {
      filtered = filtered.filter(ingredient => {
        const status = getStockStatus(ingredient);
        return status === statusFilter;
      });
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      // Casos especiales para ordenamiento
      if (sortColumn === 'status') {
        aValue = getStockStatus(a);
        bValue = getStockStatus(b);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginación
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

    return {
      data: paginatedData,
      totalItems: filtered.length,
      totalPages,
      hasResults: filtered.length > 0
    };
  }, [searchTerm, unitFilter, statusFilter, sortColumn, sortDirection, currentPage]);

  // Manejar cambio de ordenamiento
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Manejar cambio de filtros
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handlers stub para acciones
  const handleCreate = () => {
    console.log('Navegando a crear ingrediente...');
    navigate('/nuevo-ingrediente');
  };

  const handleView = (id) => {
    console.log('Ver ingrediente:', id);
  };

  const handleEdit = (id) => {
    console.log('Editar ingrediente:', id);
  };

  const handleAdjustStock = (id) => {
    console.log('Ajustar stock:', id);
  };

  const handleDelete = (id) => {
    console.log('Eliminar ingrediente:', id);
  };

  // Reintentar fetch
  const handleRetry = () => {
    const controller = new AbortController();
    (async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const res = await fetch(`${API_BASE}/ingredientes?userId=${encodeURIComponent(USER_ID)}`, { 
          signal: controller.signal 
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const normalized = Array.isArray(json) ? json.map(it => ({
          ...it,
          cantidadEnStock: typeof it.cantidadEnStock === 'string' ? parseFloat(it.cantidadEnStock) : it.cantidadEnStock,
          cantidadMinima: typeof it.cantidadMinima === 'string' ? parseFloat(it.cantidadMinima) : it.cantidadMinima,
        })) : [];
        setIngredients(normalized);
      } catch (e) { 
        if (e.name !== 'AbortError') setHasError(true); 
      }
      finally { 
        setIsLoading(false); 
      }
    })();
  };

  // Obtener clase CSS para el estado del stock
  const getStatusClass = (ingredient) => {
    const status = getStockStatus(ingredient);
    switch (status) {
      case 'Crítico': 
        return styles.statusCritical;
      case 'Bajo': 
        return styles.statusLow;
      case 'OK': 
        return styles.statusOk;
      default: return '';
    }
  };

  // Renderizar skeleton de carga
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

  // Renderizar estado de error
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

  // Renderizar estado vacío
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📦</div>
      <h3 className={styles.emptyTitle}>No se encontraron ingredientes</h3>
      <p className={styles.emptyDescription}>
        {searchTerm || unitFilter !== 'Todas' || statusFilter !== 'Todos'
          ? 'Intenta ajustar los filtros de búsqueda.'
          : 'Comienza agregando tu primer ingrediente al inventario.'
        }
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
                        <th scope="col">
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
                        <th scope="col">
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
                          <td className={styles.nameCell}>
                            {ingredient.nombre}
                          </td>
                          <td className={styles.unitCell}>
                            {ingredient.unidadMedida}
                          </td>
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
                          <td className={styles.dateCell}>
                            {formatShortDate(ingredient.updatedAt)}
                          </td>
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
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Página anterior"
                    >
                      Anterior
                    </button>
                    
                    <div className={styles.paginationInfo}>
                      Página {currentPage} de {processedData.totalPages}
                    </div>
                    
                    <button
                      className={styles.paginationButton}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === processedData.totalPages}
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