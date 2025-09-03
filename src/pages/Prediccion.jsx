import React, { useState, useMemo, useEffect } from 'react';
import { Leaf, Carrot, Apple, Coffee, TrendingUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Checkbox from '../components/common/Checkbox';
import { useMenuItems } from '../hooks/useMenuItems.js';
import { usePredicciones } from '../hooks/usePredicciones.js';
import { DEFAULT_USER_ID } from '../config/env.js';

// Reutilizar estilos de NewIngredient para la carcasa
import styles from './NewIngredient.module.css';
// Reutilizar estilos de ViewIngredients para la tabla
import tableStyles from './ViewIngredients.module.css';

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
    isLoading,
    error,
    success,
    setItemMenuIds,
    setFechaDesde,
    setFechaHasta,
    setTurnos,
    fetchPredicciones
  } = usePredicciones();

  // Estado para la tabla
  const [sortColumn, setSortColumn] = useState('fecha');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

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
  const processedResults = useMemo(() => {
    if (!predicciones.length) return { data: [], totalPages: 0, totalItems: 0 };

    // Ordenar
    const sorted = [...predicciones].sort((a, b) => {
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
        case 'fecha':
          aValue = new Date(a.fecha.split('/').reverse().join('-')).getTime();
          bValue = new Date(b.fecha.split('/').reverse().join('-')).getTime();
          break;
        case 'turno':
          aValue = a.turno;
          bValue = b.turno;
          break;
        case 'demanda':
          aValue = a.demandaPredicha;
          bValue = b.demandaPredicha;
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
                {predicciones.length > 0 && (
                  <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-primary)' }}>
                      Resultados de Predicción
                    </h3>
                    
                    {/* Información de resultados */}
                    <div className={tableStyles.resultsInfo} aria-live="polite">
                      <span>{processedResults.totalItems} resultado{processedResults.totalItems !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Tabla de resultados */}
                    <div className={tableStyles.content}>
                      <div className={tableStyles.tableContainer}>
                        <table className={tableStyles.table} role="table">
                          <thead>
                            <tr>
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
                                  onClick={() => handleSort('fecha')}
                                  aria-label="Ordenar por fecha"
                                >
                                  Fecha
                                  {sortColumn === 'fecha' && (
                                    <span className={tableStyles.sortIndicator}>
                                      {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </button>
                              </th>
                              <th scope="col">
                                <button
                                  className={tableStyles.sortButton}
                                  onClick={() => handleSort('turno')}
                                  aria-label="Ordenar por turno"
                                >
                                  Turno
                                  {sortColumn === 'turno' && (
                                    <span className={tableStyles.sortIndicator}>
                                      {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </button>
                              </th>
                              <th scope="col" data-align="right">
                                <button
                                  className={tableStyles.sortButton}
                                  onClick={() => handleSort('demanda')}
                                  aria-label="Ordenar por demanda"
                                >
                                  Demanda
                                  {sortColumn === 'demanda' && (
                                    <span className={tableStyles.sortIndicator}>
                                      {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </button>
                              </th>
                              <th scope="col">Feriado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {processedResults.data.map((prediccion, index) => (
                              <tr key={`${prediccion.itemMenu?.id}-${prediccion.fecha}-${prediccion.turno}-${index}`}>
                                <td className={tableStyles.nameCell}>
                                  {prediccion.itemMenu?.codigo || 'N/A'}
                                </td>
                                <td className={tableStyles.nameCell}>
                                  {prediccion.itemMenu?.nombre || 'N/A'}
                                </td>
                                <td className={tableStyles.dateCell}>
                                  {prediccion.fecha}
                                </td>
                                <td>
                                  {renderTurnoBadge(prediccion.turno)}
                                </td>
                                <td className={tableStyles.numCell}>
                                  {prediccion.demandaPredicha.toFixed(2)}
                                </td>
                                <td>
                                  <span className={`${tableStyles.statusBadge} ${prediccion.contexto?.esFeriado ? tableStyles.statusLow : tableStyles.statusOk}`}>
                                    {prediccion.contexto?.esFeriado ? 'Sí' : 'No'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Paginación */}
                      {processedResults.totalPages > 1 && (
                        <div className={tableStyles.pagination} role="navigation" aria-label="Paginación de predicciones">
                          <button
                            type="button"
                            className={tableStyles.paginationButton}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={processedResults.page === 1}
                            aria-label="Página anterior"
                          >
                            Anterior
                          </button>

                          <div className={tableStyles.paginationInfo} aria-live="polite">
                            Página {processedResults.page} de {processedResults.totalPages}
                          </div>

                          <button
                            type="button"
                            className={tableStyles.paginationButton}
                            onClick={() => setCurrentPage(prev => Math.min(processedResults.totalPages, prev + 1))}
                            disabled={processedResults.page === processedResults.totalPages}
                            aria-label="Página siguiente"
                          >
                            Siguiente
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Estado vacío */}
                {success && predicciones.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--color-text-secondary)' }}>
                    <p>No se encontraron predicciones para los parámetros seleccionados.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Prediccion;