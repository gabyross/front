import React, { useState, useMemo, useEffect } from 'react';
import { Leaf, Carrot, Apple, Coffee, TrendingUp, ChevronDown, ChevronRight } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Checkbox from '../components/common/Checkbox';
import { useMenuItems } from '../hooks/useMenuItems.js';
import { usePredicciones } from '../hooks/usePredicciones.js';
import { DEFAULT_USER_ID } from '../config/env.js';

// Reutilizar estilos de NewIngredient para la carcasa
import styles from './NewIngredient.module.css';
// Reutilizar estilos de ViewMenuItems para las tablas expandibles
import tableStyles from './ViewMenuItems.module.css';

const ITEMS_PER_PAGE = 10;

/**
 * Página de predicción de ventas
 */
const Prediccion = () => {
  // Cargar items del menú disponibles
  const { items: menuItems, isLoading: loadingItems } = useMenuItems();
  
  // Hook de predicciones
  const {
    itemMenuIds,
    fechaDesde,
    fechaHasta,
    turnos,
    predicciones,
    ingredientesNecesarios,
    isLoading,
    error,
    success,
    setItemMenuIds,
    setFechaDesde,
    setFechaHasta,
    setTurnos,
    fetchPredicciones
  } = usePredicciones();

  // Estado para las tablas expandibles
  const [sortColumn, setSortColumn] = useState('fecha');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState(new Set());     // para productos
  const [expandedIngr, setExpandedIngr] = useState(new Set());     // para ingredientes

  const toggleRow = (k) => { 
    const n = new Set(expandedRows); 
    n.has(k) ? n.delete(k) : n.add(k); 
    setExpandedRows(n); 
  };
  
  const toggleIngr = (k) => { 
    const n = new Set(expandedIngr); 
    n.has(k) ? n.delete(k) : n.add(k); 
    setExpandedIngr(n); 
  };

  // Manejar selección múltiple de items del menú
  const handleItemMenuChange = (itemId, checked) => {
    if (checked) {
      setItemMenuIds([...itemMenuIds, itemId]);
    } else {
      setItemMenuIds(itemMenuIds.filter(id => id !== itemId));
    }
  };

  // Manejar cambio de turnos
  const handleTurnoChange = (turno, checked) => {
    if (checked) {
      setTurnos([...turnos, turno]);
    } else {
      setTurnos(turnos.filter(t => t !== turno));
    }
  };

  // Manejar ordenamiento de tabla
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Procesar y paginar resultados
  const processedPredicciones = useMemo(() => {
    if (!predicciones.length) return { data: [], totalPages: 0, totalItems: 0 };

    // Agrupar por itemMenu.id
    const grupos = {};
    predicciones.forEach(pred => {
      const key = pred.itemMenu?.id || 'unknown';
      if (!grupos[key]) {
        grupos[key] = {
          key,
          itemMenu: pred.itemMenu,
          predicciones: []
        };
      }
      grupos[key].predicciones.push(pred);
    });

    // Procesar cada grupo
    const gruposArray = Object.values(grupos).map(grupo => {
      // Ordenar predicciones internas por fecha asc y turno M<T<N
      const turnoOrder = { 'M': 1, 'T': 2, 'N': 3 };
      grupo.predicciones.sort((a, b) => {
        const dateA = new Date(a.fecha.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.fecha.split('/').reverse().join('-')).getTime();
        if (dateA !== dateB) return dateA - dateB;
        return (turnoOrder[a.turno] || 4) - (turnoOrder[b.turno] || 4);
      });

      // Calcular métricas del grupo
      const count = grupo.predicciones.length;
      const totalDemanda = grupo.predicciones.reduce((sum, p) => sum + (p.demandaPredicha || 0), 0);
      const fechas = grupo.predicciones.map(p => new Date(p.fecha.split('/').reverse().join('-')));
      const minDate = new Date(Math.min(...fechas));
      const maxDate = new Date(Math.max(...fechas));
      
      const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
      };

      return {
        ...grupo,
        count,
        totalDemanda,
        rangoFechas: count === 1 ? formatDate(minDate) : `${formatDate(minDate)} - ${formatDate(maxDate)}`
      };
    });

    // Ordenar grupos
    const sorted = [...gruposArray].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortColumn) {
        case 'codigo':
          aValue = a.itemMenu?.codigo || '';
          bValue = b.itemMenu?.codigo || '';
          break;
        case 'nombre':
          aValue = a.itemMenu?.nombre || '';
          bValue = b.itemMenu?.nombre || '';
          break;
        case 'count':
          aValue = a.count;
          bValue = b.count;
          break;
        case 'total':
          aValue = a.totalDemanda;
          bValue = b.totalDemanda;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginar
    const totalItems = sorted.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const pageData = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return { data: pageData, totalPages, totalItems, page: safePage };
  }, [predicciones, sortColumn, sortDirection, currentPage]);

  // Procesar ingredientes necesarios
  const processedIngredientes = useMemo(() => {
    if (!ingredientesNecesarios || typeof ingredientesNecesarios !== 'object') {
      return [];
    }

    return Object.entries(ingredientesNecesarios).map(([nombre, data]) => ({
      key: data.id || nombre,
      nombre,
      id: data.id,
      cantidadTotal: data.cantidadTotal || 0,
      detallesPorItem: Array.isArray(data.detallesPorItem) ? data.detallesPorItem : []
    })).sort((a, b) => b.cantidadTotal - a.cantidadTotal); // Orden por cantidad total descendente
  }, [ingredientesNecesarios]);

  // Renderizar badge de turno
  const renderTurnoBadge = (turno) => {
    const turnoColors = {
      'M': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }, // Azul
      'T': { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }, // Amarillo
      'N': { bg: 'rgba(139, 69, 19, 0.1)', color: '#8B4513' }   // Marrón
    };
    
    const colors = turnoColors[turno] || turnoColors['M'];
    
    return (
      <span 
        style={{ 
          backgroundColor: colors.bg, 
          color: colors.color,
          padding: '0.25rem 0.5rem',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase'
        }}
      >
        {turno}
      </span>
    );
  };

  // Validar si el formulario está completo
  const isFormValid = () => {
    return itemMenuIds.length > 0 && fechaDesde && fechaHasta && turnos.length > 0;
  };

  // Limpiar formulario
  const clearForm = () => {
    setItemMenuIds([]);
    setFechaDesde('');
    setFechaHasta('');
    setTurnos(['M', 'T', 'N']);
    setCurrentPage(1);
  };

  return (
    <Layout isInternal={true}>
      <main className={styles.newIngredientPage}>
        {/* Elementos decorativos flotantes */}
        <div className={styles.floatingElements}>
          <div className={`${styles.floatingIcon} ${styles.icon1}`}><TrendingUp size={32} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon2}`}><Carrot size={28} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon3}`}><Apple size={30} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon4}`}><Coffee size={26} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon5}`}><Leaf size={24} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon6}`}><TrendingUp size={22} /></div>
        </div>

        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {/* Columna izquierda - Visual */}
            <div className={styles.visualColumn}>
              <div className={styles.visualContent}>
                <div className={styles.mainIcon}>
                  <div className={styles.iconCircle}><TrendingUp size={48} /></div>
                </div>
                <h2 className={styles.visualTitle}>Predicción Inteligente</h2>
                <p className={styles.visualDescription}>
                  Utiliza inteligencia artificial para predecir la demanda de tus platos y optimizar tu operación.
                </p>

                <div className={styles.benefitsList}>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon}><TrendingUp size={16} /></div>
                    <span>Predicciones precisas por turno</span>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon}><Carrot size={16} /></div>
                    <span>Optimización de inventario</span>
                  </div>
                  <div className={styles.benefitItem}>
                    <div className={styles.benefitIcon}><Apple size={16} /></div>
                    <span>Reducción de desperdicios</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Formulario y Resultados */}
            <div className={styles.formColumn}>
              <div className={styles.header}>
                <h1 className={styles.title}>Predicción de Ventas</h1>
                <p className={styles.subtitle}>Genera predicciones inteligentes para tus platos</p>
              </div>

              <div className={styles.formContainer}>
                {/* Mensajes de estado */}
                {error && (
                  <div className={styles.generalError} role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className={styles.successMessage} role="alert">
                    ✓ Predicciones generadas exitosamente
                  </div>
                )}

                {/* Formulario */}
                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); fetchPredicciones(); }}>
                  {/* Selección de ítems del menú */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Ítems del menú <span className={styles.required}>*</span>
                    </label>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
                      {loadingItems ? (
                        <p>Cargando ítems del menú...</p>
                      ) : menuItems.length === 0 ? (
                        <p>No hay ítems disponibles</p>
                      ) : (
                        menuItems.map(item => (
                          <Checkbox
                            key={item._id}
                            name={`item-${item._id}`}
                            checked={itemMenuIds.includes(item._id)}
                            onChange={(e) => handleItemMenuChange(item._id, e.target.checked)}
                          >
                            {item.codigo} - {item.nombre}
                          </Checkbox>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Rango de fechas */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                    <Input
                      type="date"
                      name="fechaDesde"
                      label="Fecha desde"
                      value={fechaDesde}
                      onChange={(e) => setFechaDesde(e.target.value)}
                      required
                    />
                    
                    <Input
                      type="date"
                      name="fechaHasta"
                      label="Fecha hasta"
                      value={fechaHasta}
                      onChange={(e) => setFechaHasta(e.target.value)}
                      required
                    />
                  </div>

                  {/* Turnos */}
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Turnos <span className={styles.required}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                      <Checkbox
                        name="turno-m"
                        checked={turnos.includes('M')}
                        onChange={(e) => handleTurnoChange('M', e.target.checked)}
                      >
                        Mañana (M)
                      </Checkbox>
                      <Checkbox
                        name="turno-t"
                        checked={turnos.includes('T')}
                        onChange={(e) => handleTurnoChange('T', e.target.checked)}
                      >
                        Tarde (T)
                      </Checkbox>
                      <Checkbox
                        name="turno-n"
                        checked={turnos.includes('N')}
                        onChange={(e) => handleTurnoChange('N', e.target.checked)}
                      >
                        Noche (N)
                      </Checkbox>
                    </div>
                  </div>

                  {/* Acciones del formulario */}
                  <div className={styles.formActions}>
                    <Button
                      type="submit"
                      variant="primary"
                      size="large"
                      disabled={!isFormValid() || isLoading}
                    >
                      {isLoading ? 'Generando predicciones...' : 'Traer predicciones'}
                    </Button>

                    <Button
                      type="button"
                      variant="tertiary"
                      size="large"
                      onClick={clearForm}
                      disabled={isLoading}
                    >
                      Limpiar formulario
                    </Button>
                  </div>
                </form>

                {/* Resultados */}
              </div>
            </div>
          </div>
        </div>

        {/* Resultados - Sección separada debajo del formulario */}
        {processedPredicciones.totalItems > 0 && (
          <div className={styles.container} style={{ marginTop: 'var(--spacing-2xl)' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h2 style={{ 
                fontSize: '1.875rem', 
                fontWeight: '700', 
                color: 'var(--color-text-primary)', 
                marginBottom: 'var(--spacing-sm)',
                textAlign: 'center'
              }}>
                Resultados de Predicción
              </h2>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                textAlign: 'center',
                margin: '0'
              }}>
                Predicciones generadas para el período seleccionado
              </p>
            </div>
            
            {/* Información de resultados */}
            <div className={tableStyles.resultsInfo} aria-live="polite">
              <span>{processedPredicciones.totalItems} grupo{processedPredicciones.totalItems !== 1 ? 's' : ''}</span>
            </div>

            {/* Tabla 1 - Resultados de Predicción (agrupada + expandible) */}
            <div className={tableStyles.content}>
              <div className={tableStyles.tableContainer}>
                <table className={tableStyles.table} role="table">
                  <thead>
                    <tr>
                      <th scope="col" className={tableStyles.expandColumn}></th>
                      <th scope="col">
                        <button
                          className={tableStyles.sortButton}
                          onClick={() => handleSort('codigo')}
                          aria-label="Ordenar por código"
                        >
                          Código
                          {sortColumn === 'codigo' && (
                            <span className={tableStyles.sortIndicator}>
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>
                      <th scope="col">
                        <button
                          className={tableStyles.sortButton}
                          onClick={() => handleSort('nombre')}
                          aria-label="Ordenar por nombre"
                        >
                          Nombre
                          {sortColumn === 'nombre' && (
                            <span className={tableStyles.sortIndicator}>
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>
                      <th scope="col">
                        <button
                          className={tableStyles.sortButton}
                          onClick={() => handleSort('count')}
                          aria-label="Ordenar por cantidad de predicciones"
                        >
                          Predicciones
                          {sortColumn === 'count' && (
                            <span className={tableStyles.sortIndicator}>
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>
                      <th scope="col">
                        <button
                          className={tableStyles.sortButton}
                          onClick={() => handleSort('total')}
                          aria-label="Ordenar por demanda total"
                        >
                          Demanda total
                          {sortColumn === 'total' && (
                            <span className={tableStyles.sortIndicator}>
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>
                      <th scope="col">Rango fechas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedPredicciones.data.map((grupo) => (
                      <React.Fragment key={grupo.key}>
                        <tr>
                          <td className={tableStyles.expandCell}>
                            <button
                              className={tableStyles.expandButton}
                              onClick={() => toggleRow(grupo.key)}
                              aria-label={`${expandedRows.has(grupo.key) ? 'Contraer' : 'Expandir'} detalles de ${grupo.itemMenu?.nombre}`}
                              title={expandedRows.has(grupo.key) ? 'Contraer detalles' : 'Ver detalles'}
                            >
                              {expandedRows.has(grupo.key) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </td>
                          <td className={tableStyles.codeCell}>
                            {grupo.itemMenu?.codigo || 'N/A'}
                          </td>
                          <td className={tableStyles.nameCell}>
                            {grupo.itemMenu?.nombre || 'N/A'}
                          </td>
                          <td className={tableStyles.ingredientsCell}>
                            <strong>{grupo.count}</strong>
                          </td>
                          <td className={tableStyles.numCell}>
                            {grupo.totalDemanda.toFixed(2)}
                          </td>
                          <td className={tableStyles.dateCell}>
                            {grupo.rangoFechas}
                          </td>
                        </tr>
                        
                        {/* Fila expandida con subtabla */}
                        {expandedRows.has(grupo.key) && (
                          <tr className={tableStyles.expandedRow}>
                            <td colSpan={6} className={tableStyles.expandedContent}>
                              <div className={tableStyles.ingredientDetails}>
                                <h4 className={tableStyles.detailsTitle}>Detalles de predicciones</h4>
                                <table className={tableStyles.subTable} role="table">
                                  <thead>
                                    <tr>
                                      <th>Fecha</th>
                                      <th>Turno</th>
                                      <th>Demanda</th>
                                      <th>Feriado</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {grupo.predicciones.map((pred, idx) => (
                                      <tr key={idx}>
                                        <td>{pred.fecha}</td>
                                        <td>{renderTurnoBadge(pred.turno)}</td>
                                        <td className={tableStyles.subIngQty}>
                                          {pred.demandaPredicha.toFixed(2)}
                                        </td>
                                        <td>
                                          <span className={`${tableStyles.statusBadge} ${pred.contexto?.esFeriado ? tableStyles.statusLow : tableStyles.statusOk}`}>
                                            {pred.contexto?.esFeriado ? 'Sí' : 'No'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {processedPredicciones.totalPages > 1 && (
                <div className={tableStyles.pagination} role="navigation" aria-label="Paginación de grupos de predicciones">
                  <button
                    type="button"
                    className={tableStyles.paginationButton}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={processedPredicciones.page === 1}
                    aria-label="Página anterior"
                  >
                    Anterior
                  </button>

                  <div className={tableStyles.paginationInfo} aria-live="polite">
                    Página {processedPredicciones.page} de {processedPredicciones.totalPages}
                  </div>

                  <button
                    type="button"
                    className={tableStyles.paginationButton}
                    onClick={() => setCurrentPage(prev => Math.min(processedPredicciones.totalPages, prev + 1))}
                    disabled={processedPredicciones.page === processedPredicciones.totalPages}
                    aria-label="Página siguiente"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabla 2 - Ingredientes necesarios */}
        {processedIngredientes.length > 0 && (
          <div className={styles.container} style={{ marginTop: 'var(--spacing-2xl)' }}>
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h2 style={{ 
                fontSize: '1.875rem', 
                fontWeight: '700', 
                color: 'var(--color-text-primary)', 
                marginBottom: 'var(--spacing-sm)',
                textAlign: 'center'
              }}>
                Ingredientes necesarios
              </h2>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                textAlign: 'center',
                margin: '0'
              }}>
                Resumen de ingredientes requeridos para las predicciones
              </p>
            </div>
            
            <div className={tableStyles.content}>
              <div className={tableStyles.tableContainer}>
                <table className={tableStyles.table} role="table">
                  <thead>
                    <tr>
                      <th scope="col" className={tableStyles.expandColumn}></th>
                      <th scope="col">Ingrediente</th>
                      <th scope="col">Cantidad total</th>
                      <th scope="col">Detalles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedIngredientes.map((ingrediente) => (
                      <React.Fragment key={ingrediente.key}>
                        <tr>
                          <td className={tableStyles.expandCell}>
                            <button
                              className={tableStyles.expandButton}
                              onClick={() => toggleIngr(ingrediente.key)}
                              aria-label={`${expandedIngr.has(ingrediente.key) ? 'Contraer' : 'Expandir'} detalles de ${ingrediente.nombre}`}
                              title={expandedIngr.has(ingrediente.key) ? 'Contraer detalles' : 'Ver detalles'}
                            >
                              {expandedIngr.has(ingrediente.key) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                          </td>
                          <td className={tableStyles.nameCell}>
                            {ingrediente.nombre}
                          </td>
                          <td className={tableStyles.numCell}>
                            <strong>{ingrediente.cantidadTotal}</strong>
                          </td>
                          <td className={tableStyles.ingredientsCell}>
                            {ingrediente.detallesPorItem.length} detalle{ingrediente.detallesPorItem.length !== 1 ? 's' : ''}
                          </td>
                        </tr>
                        
                        {/* Fila expandida con subtabla */}
                        {expandedIngr.has(ingrediente.key) && (
                          <tr className={tableStyles.expandedRow}>
                            <td colSpan={4} className={tableStyles.expandedContent}>
                              <div className={tableStyles.ingredientDetails}>
                                <h4 className={tableStyles.detailsTitle}>Detalles por ítem</h4>
                                {ingrediente.detallesPorItem.length === 0 ? (
                                  <p className={tableStyles.noIngredients}>No hay detalles disponibles.</p>
                                ) : (
                                  <table className={tableStyles.subTable} role="table">
                                    <thead>
                                      <tr>
                                        <th>Fecha</th>
                                        <th>Turno</th>
                                        <th>Item</th>
                                        <th>Demanda</th>
                                        <th>Cant. x unidad</th>
                                        <th>Cant. necesaria</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {ingrediente.detallesPorItem.map((detalle, idx) => (
                                        <tr key={idx}>
                                          <td>{detalle.fecha}</td>
                                          <td>{renderTurnoBadge(detalle.turno)}</td>
                                          <td className={tableStyles.subIngName}>
                                            {detalle.itemMenu?.nombre || 'N/A'}
                                          </td>
                                          <td className={tableStyles.subIngQty}>
                                            {detalle.demandaPredicha?.toFixed(2) || '0.00'}
                                          </td>
                                          <td className={tableStyles.subIngQty}>
                                            {detalle.cantidadPorUnidad || 0}
                                          </td>
                                          <td className={tableStyles.subIngQty}>
                                            <strong>{detalle.cantidadNecesaria || 0}</strong>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {success && processedPredicciones.totalItems === 0 && (
          <div className={styles.container} style={{ marginTop: 'var(--spacing-2xl)' }}>
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-secondary)' }}>
              <p>No se encontraron predicciones para los parámetros seleccionados.</p>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Prediccion;