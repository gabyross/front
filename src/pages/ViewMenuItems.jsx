import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { Plus, Search, Edit, Trash2, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';
import styles from './ViewMenuItems.module.css';

/**
 * Helper para resolver nombre de ingrediente por ID
 */
const resolveIngredientName = (id, index) => {
  const ingredient = index.get(id);
  return ingredient ? ingredient.nombre : '(desconocido)';
};

/**
 * Helper para resolver unidad de medida de ingrediente por ID
 */
const resolveIngredientUnit = (id, index) => {
  const ingredient = index.get(id);
  return ingredient ? ingredient.unidadMedida : undefined;
};

/**
 * Helper para verificar si un ítem tiene ingredientes faltantes
 */
const hasMissingIngredients = (item, index) => {
  return item.ingredientes.some(ref => {
    const ingredient = index.get(ref.ingrediente_id);
    return !ingredient || ingredient.cantidadEnStock === 0;
  });
};

/**
 * Helper para obtener estado de una referencia de ingrediente
 */
const getIngredientRefStatus = (ref, index) => {
  const ingredient = index.get(ref.ingrediente_id);
  if (!ingredient) return 'NOT_FOUND';
  if (ingredient.cantidadEnStock === 0) return 'OUT_OF_STOCK';
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
 * Helper para ordenar datos por columna
 */
const sortByColumn = (data, column, direction) => {
  return [...data].sort((a, b) => {
    let aValue, bValue;

    switch (column) {
      case 'codigo':
        aValue = a.codigo.toLowerCase();
        bValue = b.codigo.toLowerCase();
        break;
      case 'nombre':
        aValue = a.nombre.toLowerCase();
        bValue = b.nombre.toLowerCase();
        break;
      case 'activo':
        aValue = a.activo;
        bValue = b.activo;
        break;
      case 'fecha_actualizacion':
        aValue = new Date(a.fecha_actualizacion);
        bValue = new Date(b.fecha_actualizacion);
        break;
      case 'ingredientsCount':
        aValue = a.ingredientes.length;
        bValue = b.ingredientes.length;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Índice mock de ingredientes disponibles
 */
const ingredientsIndexMock = new Map([
  ['507f1f77bcf86cd799439011', { nombre: 'Tomate', unidadMedida: 'kilogramos', cantidadEnStock: 5.5 }],
  ['507f1f77bcf86cd799439012', { nombre: 'Cebolla', unidadMedida: 'kilogramos', cantidadEnStock: 0 }],
  ['507f1f77bcf86cd799439013', { nombre: 'Aceite de oliva', unidadMedida: 'mililitros', cantidadEnStock: 2500 }],
  ['507f1f77bcf86cd799439014', { nombre: 'Sal', unidadMedida: 'gramos', cantidadEnStock: 800 }],
  ['507f1f77bcf86cd799439015', { nombre: 'Pimienta negra', unidadMedida: 'gramos', cantidadEnStock: 150 }],
  ['507f1f77bcf86cd799439016', { nombre: 'Queso mozzarella', unidadMedida: 'kilogramos', cantidadEnStock: 3.2 }],
  ['507f1f77bcf86cd799439017', { nombre: 'Harina 0000', unidadMedida: 'kilogramos', cantidadEnStock: 25 }],
  ['507f1f77bcf86cd799439018', { nombre: 'Leche entera', unidadMedida: 'mililitros', cantidadEnStock: 4000 }],
  ['507f1f77bcf86cd799439019', { nombre: 'Huevos', unidadMedida: 'unidades', cantidadEnStock: 24 }],
  ['507f1f77bcf86cd799439020', { nombre: 'Manteca', unidadMedida: 'gramos', cantidadEnStock: 500 }],
]);

/**
 * Datos mock de ítems del menú que replican exactamente el modelo del backend
 */
const menuItemsMock = [
  {
    _id: '607f1f77bcf86cd799439101',
    codigo: 'PIZZA-MARG',
    nombre: 'Pizza Margherita',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439017', cantidad_requerida: 0.3, _id: '607f1f77bcf86cd799439201' },
      { ingrediente_id: '507f1f77bcf86cd799439011', cantidad_requerida: 0.2, _id: '607f1f77bcf86cd799439202' },
      { ingrediente_id: '507f1f77bcf86cd799439016', cantidad_requerida: 0.15, _id: '607f1f77bcf86cd799439203' },
      { ingrediente_id: '507f1f77bcf86cd799439013', cantidad_requerida: 30, _id: '607f1f77bcf86cd799439204' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-15T10:30:00.000Z',
    fecha_actualizacion: '2024-01-20T14:22:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439102',
    codigo: 'PASTA-CARB',
    nombre: 'Pasta Carbonara',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439017', cantidad_requerida: 0.1, _id: '607f1f77bcf86cd799439205' },
      { ingrediente_id: '507f1f77bcf86cd799439019', cantidad_requerida: 2, _id: '607f1f77bcf86cd799439206' },
      { ingrediente_id: '507f1f77bcf86cd799439020', cantidad_requerida: 50, _id: '607f1f77bcf86cd799439207' },
      { ingrediente_id: '507f1f77bcf86cd799439016', cantidad_requerida: 0.08, _id: '607f1f77bcf86cd799439208' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-12T08:15:00.000Z',
    fecha_actualizacion: '2024-01-19T16:45:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439103',
    codigo: 'ENSALADA-CESAR',
    nombre: 'Ensalada César',
    activo: false,
    ingredientes: [
      { ingrediente_id: 'INEXISTENTE_001', cantidad_requerida: 0.2, _id: '607f1f77bcf86cd799439209' },
      { ingrediente_id: '507f1f77bcf86cd799439016', cantidad_requerida: 0.05, _id: '607f1f77bcf86cd799439210' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-10T12:00:00.000Z',
    fecha_actualizacion: '2024-01-18T09:30:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439104',
    codigo: '0',
    nombre: 'Sopa del día',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439011', cantidad_requerida: 0.3, _id: '607f1f77bcf86cd799439211' },
      { ingrediente_id: '507f1f77bcf86cd799439012', cantidad_requerida: 0.1, _id: '607f1f77bcf86cd799439212' },
      { ingrediente_id: '507f1f77bcf86cd799439014', cantidad_requerida: 10, _id: '607f1f77bcf86cd799439213' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-08T14:20:00.000Z',
    fecha_actualizacion: '2024-01-17T11:15:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439105',
    codigo: 'RISOTTO-HONGOS',
    nombre: 'Risotto de Hongos',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439017', cantidad_requerida: 0.15, _id: '607f1f77bcf86cd799439214' },
      { ingrediente_id: '507f1f77bcf86cd799439018', cantidad_requerida: 200, _id: '607f1f77bcf86cd799439215' },
      { ingrediente_id: 'INEXISTENTE_002', cantidad_requerida: 0.1, _id: '607f1f77bcf86cd799439216' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-05T16:45:00.000Z',
    fecha_actualizacion: '2024-01-16T13:20:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439106',
    codigo: 'MILANESA-NAPO',
    nombre: 'Milanesa Napolitana',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439011', cantidad_requerida: 0.15, _id: '607f1f77bcf86cd799439217' },
      { ingrediente_id: '507f1f77bcf86cd799439016', cantidad_requerida: 0.1, _id: '607f1f77bcf86cd799439218' },
      { ingrediente_id: '507f1f77bcf86cd799439019', cantidad_requerida: 1, _id: '607f1f77bcf86cd799439219' },
      { ingrediente_id: '507f1f77bcf86cd799439017', cantidad_requerida: 0.05, _id: '607f1f77bcf86cd799439220' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-14T09:10:00.000Z',
    fecha_actualizacion: '2024-01-21T15:30:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439107',
    codigo: 'EMPANADAS-CARNE',
    nombre: 'Empanadas de Carne',
    activo: false,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439017', cantidad_requerida: 0.2, _id: '607f1f77bcf86cd799439221' },
      { ingrediente_id: '507f1f77bcf86cd799439012', cantidad_requerida: 0.05, _id: '607f1f77bcf86cd799439222' },
      { ingrediente_id: '507f1f77bcf86cd799439014', cantidad_requerida: 5, _id: '607f1f77bcf86cd799439223' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-11T11:25:00.000Z',
    fecha_actualizacion: '2024-01-20T10:40:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439108',
    codigo: 'LOCRO',
    nombre: 'Locro Tradicional',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439012', cantidad_requerida: 0.1, _id: '607f1f77bcf86cd799439224' },
      { ingrediente_id: '507f1f77bcf86cd799439014', cantidad_requerida: 8, _id: '607f1f77bcf86cd799439225' },
      { ingrediente_id: 'INEXISTENTE_003', cantidad_requerida: 0.3, _id: '607f1f77bcf86cd799439226' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-13T07:50:00.000Z',
    fecha_actualizacion: '2024-01-19T12:15:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439109',
    codigo: 'FLAN-CASERO',
    nombre: 'Flan Casero',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439018', cantidad_requerida: 500, _id: '607f1f77bcf86cd799439227' },
      { ingrediente_id: '507f1f77bcf86cd799439019', cantidad_requerida: 4, _id: '607f1f77bcf86cd799439228' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-09T13:35:00.000Z',
    fecha_actualizacion: '2024-01-18T08:20:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439110',
    codigo: 'CAFE-CORTADO',
    nombre: 'Café Cortado',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439018', cantidad_requerida: 100, _id: '607f1f77bcf86cd799439229' },
      { ingrediente_id: 'INEXISTENTE_004', cantidad_requerida: 10, _id: '607f1f77bcf86cd799439230' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-07T15:40:00.000Z',
    fecha_actualizacion: '2024-01-17T14:55:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439111',
    codigo: 'TARTA-ESPINACA',
    nombre: 'Tarta de Espinaca',
    activo: false,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439017', cantidad_requerida: 0.25, _id: '607f1f77bcf86cd799439231' },
      { ingrediente_id: '507f1f77bcf86cd799439019', cantidad_requerida: 3, _id: '607f1f77bcf86cd799439232' },
      { ingrediente_id: '507f1f77bcf86cd799439016', cantidad_requerida: 0.12, _id: '607f1f77bcf86cd799439233' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-06T10:15:00.000Z',
    fecha_actualizacion: '2024-01-16T16:30:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439112',
    codigo: 'PROVOLETA',
    nombre: 'Provoleta a la Parrilla',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439016', cantidad_requerida: 0.2, _id: '607f1f77bcf86cd799439234' },
      { ingrediente_id: '507f1f77bcf86cd799439013', cantidad_requerida: 20, _id: '607f1f77bcf86cd799439235' },
      { ingrediente_id: '507f1f77bcf86cd799439015', cantidad_requerida: 2, _id: '607f1f77bcf86cd799439236' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-04T12:30:00.000Z',
    fecha_actualizacion: '2024-01-15T09:45:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439113',
    codigo: 'CHORIPAN',
    nombre: 'Choripán Completo',
    activo: true,
    ingredientes: [
      { ingrediente_id: 'INEXISTENTE_005', cantidad_requerida: 1, _id: '607f1f77bcf86cd799439237' },
      { ingrediente_id: '507f1f77bcf86cd799439011', cantidad_requerida: 0.1, _id: '607f1f77bcf86cd799439238' },
      { ingrediente_id: '507f1f77bcf86cd799439012', cantidad_requerida: 0.05, _id: '607f1f77bcf86cd799439239' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-03T14:20:00.000Z',
    fecha_actualizacion: '2024-01-14T11:10:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439114',
    codigo: 'MEDIALUNAS',
    nombre: 'Medialunas de Manteca',
    activo: true,
    ingredientes: [
      { ingrediente_id: '507f1f77bcf86cd799439017', cantidad_requerida: 0.15, _id: '607f1f77bcf86cd799439240' },
      { ingrediente_id: '507f1f77bcf86cd799439020', cantidad_requerida: 80, _id: '607f1f77bcf86cd799439241' },
      { ingrediente_id: '507f1f77bcf86cd799439018', cantidad_requerida: 150, _id: '607f1f77bcf86cd799439242' }
    ],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-02T16:45:00.000Z',
    fecha_actualizacion: '2024-01-13T13:25:00.000Z',
    __v: 0
  },
  {
    _id: '607f1f77bcf86cd799439115',
    codigo: 'AGUA-MINERAL',
    nombre: 'Agua Mineral',
    activo: true,
    ingredientes: [],
    userId: '507f1f77bcf86cd799439001',
    fecha_creacion: '2024-01-01T18:00:00.000Z',
    fecha_actualizacion: '2024-01-12T15:40:00.000Z',
    __v: 0
  }
];

/**
 * Página para visualizar la lista de ítems del menú
 */
const ViewMenuItems = () => {
  const navigate = useNavigate();

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [ingredientsFilter, setIngredientsFilter] = useState('Todos');
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const itemsPerPage = 10;

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Datos filtrados, ordenados y paginados
  const processedData = useMemo(() => {
    let filtered = menuItemsMock;

    // Filtro por búsqueda (código o nombre)
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(item =>
        item.codigo.toLowerCase().includes(term) ||
        item.nombre.toLowerCase().includes(term)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'Todos') {
      const isActive = statusFilter === 'Activo';
      filtered = filtered.filter(item => item.activo === isActive);
    }

    // Filtro por ingredientes
    if (ingredientsFilter !== 'Todos') {
      if (ingredientsFilter === 'Con faltantes') {
        filtered = filtered.filter(item => hasMissingIngredients(item, ingredientsIndexMock));
      } else if (ingredientsFilter === 'Completo') {
        filtered = filtered.filter(item => !hasMissingIngredients(item, ingredientsIndexMock));
      }
    }

    // Ordenamiento
    filtered = sortByColumn(filtered, sortColumn, sortDirection);

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
  }, [searchTerm, statusFilter, ingredientsFilter, sortColumn, sortDirection, currentPage]);

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

  // Manejar expansión de filas
  const handleToggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Handlers stub para acciones
  const handleCreate = () => {
    console.log('Navegando a crear ítem del menú...');
    navigate('/nuevo-item-menu');
  };

  const handleEdit = (id) => {
    console.log('Editar ítem del menú:', id);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ítem del menú?')) {
      console.log('Eliminar ítem del menú:', id);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Obtener clase CSS para el badge de estado
  const getStatusBadgeClass = (active) => {
    return active ? styles.statusActive : styles.statusInactive;
  };

  // Obtener clase CSS para el badge de estado de ingrediente
  const getIngredientStatusClass = (status) => {
    switch (status) {
      case 'OK': 
        return styles.ingredientStatusOk;
      case 'OUT_OF_STOCK': 
        return styles.ingredientStatusOutOfStock;
      case 'NOT_FOUND': 
        return styles.ingredientStatusNotFound;
      default: return '';
    }
  };

  // Renderizar preview de ingredientes
  const renderIngredientsPreview = (item) => {
    const total = item.ingredientes.length;
    if (total === 0) return 'Sin ingredientes';

    const preview = item.ingredientes.slice(0, 3).map(ref => 
      resolveIngredientName(ref.ingrediente_id, ingredientsIndexMock)
    );

    const previewText = preview.join(', ');
    const hasMore = total > 3;

    return (
      <span>
        <strong>{total}</strong> ingrediente{total !== 1 ? 's' : ''}: {previewText}
        {hasMore && '...'}
      </span>
    );
  };

  // Renderizar fila expandida con detalles de ingredientes
  const renderExpandedRow = (item) => {
    if (!expandedRows.has(item._id)) return null;

    return (
      <tr key={`${item._id}-expanded`} className={styles.expandedRow}>
        <td colSpan="6" className={styles.expandedContent}>
          <div className={styles.ingredientDetails}>
            <h4 className={styles.detailsTitle}>Ingredientes requeridos:</h4>
            {item.ingredientes.length === 0 ? (
              <p className={styles.noIngredients}>Este ítem no requiere ingredientes.</p>
            ) : (
              <div className={styles.ingredientsList}>
                {item.ingredientes.map((ref) => {
                  const name = resolveIngredientName(ref.ingrediente_id, ingredientsIndexMock);
                  const unit = resolveIngredientUnit(ref.ingrediente_id, ingredientsIndexMock);
                  const status = getIngredientRefStatus(ref, ingredientsIndexMock);
                  
                  return (
                    <div key={ref._id} className={styles.ingredientItem}>
                      <div className={styles.ingredientInfo}>
                        <span className={styles.ingredientName}>{name}</span>
                        <span className={styles.ingredientQuantity}>
                          {ref.cantidad_requerida} {unit || 'unidad(es)'}
                        </span>
                      </div>
                      <span className={`${styles.ingredientStatusBadge} ${getIngredientStatusClass(status)}`}>
                        {status === 'OK' && 'OK'}
                        {status === 'OUT_OF_STOCK' && 'Sin stock'}
                        {status === 'NOT_FOUND' && 'No encontrado'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </td>
      </tr>
    );
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
        </div>
      ))}
    </div>
  );

  // Renderizar estado de error
  const renderError = () => (
    <div className={styles.errorState}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3 className={styles.errorTitle}>Error al cargar ítems del menú</h3>
      <p className={styles.errorDescription}>
        Hubo un problema al obtener la lista de ítems del menú. Inténtalo de nuevo.
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
      <div className={styles.emptyIcon}>🍽️</div>
      <h3 className={styles.emptyTitle}>No se encontraron ítems del menú</h3>
      <p className={styles.emptyDescription}>
        {searchTerm || statusFilter !== 'Todos' || ingredientsFilter !== 'Todos'
          ? 'Intenta ajustar los filtros de búsqueda.'
          : 'Comienza agregando tu primer ítem al menú.'
        }
      </p>
      {!searchTerm && statusFilter === 'Todos' && ingredientsFilter === 'Todos' && (
        <Button variant="primary" onClick={handleCreate}>
          <Plus size={16} />
          Agregar ítem
        </Button>
      )}
    </div>
  );

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
                    handleFilterChange();
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
                    handleFilterChange();
                  }}
                  className={styles.filterSelect}
                  aria-label="Filtrar por estado del ítem"
                >
                  <option value="Todos">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="ingredientsFilter" className={styles.filterLabel}>
                  Ingredientes:
                </label>
                <select
                  id="ingredientsFilter"
                  value={ingredientsFilter}
                  onChange={(e) => {
                    setIngredientsFilter(e.target.value);
                    handleFilterChange();
                  }}
                  className={styles.filterSelect}
                  aria-label="Filtrar por estado de ingredientes"
                >
                  <option value="Todos">Todos</option>
                  <option value="Con faltantes">Con faltantes</option>
                  <option value="Completo">Completo</option>
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
                        <th scope="col" className={styles.expandColumn}></th>
                        <th scope="col">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('codigo')}
                            aria-label="Ordenar por código"
                          >
                            Código
                            {sortColumn === 'codigo' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
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
                            onClick={() => handleSort('ingredientsCount')}
                            aria-label="Ordenar por cantidad de ingredientes"
                          >
                            Ingredientes
                            {sortColumn === 'ingredientsCount' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th scope="col">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('activo')}
                            aria-label="Ordenar por estado activo"
                          >
                            Activo
                            {sortColumn === 'activo' && (
                              <span className={styles.sortIndicator}>
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                        <th scope="col">
                          <button
                            className={styles.sortButton}
                            onClick={() => handleSort('fecha_actualizacion')}
                            aria-label="Ordenar por fecha de actualización"
                          >
                            Actualizado
                            {sortColumn === 'fecha_actualizacion' && (
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
                      {processedData.data.map((item) => (
                        <React.Fragment key={item._id}>
                          <tr>
                            <td className={styles.expandCell}>
                              <button
                                className={styles.expandButton}
                                onClick={() => handleToggleRow(item._id)}
                                aria-label={`${expandedRows.has(item._id) ? 'Contraer' : 'Expandir'} detalles de ${item.nombre}`}
                                title={expandedRows.has(item._id) ? 'Contraer detalles' : 'Ver detalles'}
                              >
                                {expandedRows.has(item._id) ? (
                                  <ChevronDown size={16} />
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                              </button>
                            </td>
                            <td className={styles.codeCell}>
                              {item.codigo}
                            </td>
                            <td className={styles.nameCell}>
                              {item.nombre}
                            </td>
                            <td className={styles.ingredientsCell}>
                              {renderIngredientsPreview(item)}
                            </td>
                            <td>
                              <span className={`${styles.statusBadge} ${getStatusBadgeClass(item.activo)}`}>
                                {item.activo ? 'Sí' : 'No'}
                              </span>
                            </td>
                            <td className={styles.dateCell}>
                              {formatShortDate(item.fecha_actualizacion)}
                            </td>
                            <td>
                              <div className={styles.actions}>
                                <button
                                  className={styles.actionButton}
                                  onClick={() => handleEdit(item._id)}
                                  aria-label={`Editar ${item.nombre}`}
                                  title="Editar"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  className={`${styles.actionButton} ${styles.deleteButton}`}
                                  onClick={() => handleDelete(item._id)}
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

export default ViewMenuItems;