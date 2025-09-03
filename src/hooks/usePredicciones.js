import { useState, useCallback } from 'react';
import { postRealtimeInference } from '../services/predictionsService.js';

/**
 * Hook para manejar el estado y lógica de predicciones de ventas
 */
export function usePredicciones() {
  const [state, setState] = useState({
    itemMenuIds: [],
    fechaDesde: '',
    fechaHasta: '',
    turnos: ['M', 'T', 'N'], // Por defecto todos los turnos
    predicciones: [],
    isLoading: false,
    error: null,
    success: false
  });

  // Expandir rango de fechas a array de fechas individuales
  const expandirFechas = useCallback((fechaDesde, fechaHasta) => {
    if (!fechaDesde || !fechaHasta) return [];
    
    const fechas = [];
    const inicio = new Date(fechaDesde);
    const fin = new Date(fechaHasta);
    
    // Validar que la fecha de inicio no sea posterior a la de fin
    if (inicio > fin) return [];
    
    const fechaActual = new Date(inicio);
    while (fechaActual <= fin) {
      // Formatear a dd/mm/aaaa
      const dia = fechaActual.getDate().toString().padStart(2, '0');
      const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
      const año = fechaActual.getFullYear();
      fechas.push(`${dia}/${mes}/${año}`);
      
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    return fechas;
  }, []);

  // Setters para actualizar el estado
  const setItemMenuIds = useCallback((itemMenuIds) => {
    setState(prev => ({ ...prev, itemMenuIds, success: false, error: null }));
  }, []);

  const setFechaDesde = useCallback((fechaDesde) => {
    setState(prev => ({ ...prev, fechaDesde, success: false, error: null }));
  }, []);

  const setFechaHasta = useCallback((fechaHasta) => {
    setState(prev => ({ ...prev, fechaHasta, success: false, error: null }));
  }, []);

  const setTurnos = useCallback((turnos) => {
    setState(prev => ({ ...prev, turnos, success: false, error: null }));
  }, []);

  // Función principal para obtener predicciones
  const fetchPredicciones = useCallback(async () => {
    const { itemMenuIds, fechaDesde, fechaHasta, turnos } = state;
    
    // Validaciones básicas
    if (!itemMenuIds.length) {
      setState(prev => ({ ...prev, error: 'Selecciona al menos un ítem del menú' }));
      return;
    }
    
    if (!fechaDesde || !fechaHasta) {
      setState(prev => ({ ...prev, error: 'Selecciona el rango de fechas' }));
      return;
    }
    
    if (!turnos.length) {
      setState(prev => ({ ...prev, error: 'Selecciona al menos un turno' }));
      return;
    }

    const fechas = expandirFechas(fechaDesde, fechaHasta);
    if (!fechas.length) {
      setState(prev => ({ ...prev, error: 'Rango de fechas inválido' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      success: false,
      predicciones: []
    }));

    try {
      const predicciones = await postRealtimeInference({
        itemMenuIds,
        fechas,
        turnos
      });

      setState(prev => ({
        ...prev,
        isLoading: false,
        predicciones,
        success: true,
        error: null
      }));
    } catch (error) {
      console.error('Error al obtener predicciones:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Error al obtener las predicciones. Inténtalo de nuevo.',
        success: false
      }));
    }
  }, [state, expandirFechas]);

  return {
    ...state,
    setItemMenuIds,
    setFechaDesde,
    setFechaHasta,
    setTurnos,
    fetchPredicciones
  };
}