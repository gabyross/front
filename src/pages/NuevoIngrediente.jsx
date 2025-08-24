import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import styles from './NuevoIngrediente.module.css';

/**
 * Página para agregar un nuevo ingrediente al inventario
 */
const NuevoIngrediente = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    unidadMedida: '',
    cantidadEnStock: '',
    cantidadMinima: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Lista de ingredientes existentes (simulado - estado local)
  const [ingredientesExistentes] = useState([
    'tomate', 'cebolla', 'ajo', 'aceite', 'sal', 'pimienta', 'oregano'
  ]);

  // Opciones de unidades de medida
  const unidadesMedida = [
    { value: 'gramos', label: 'Gramos' },
    { value: 'kilogramos', label: 'Kilogramos' },
    { value: 'mililitros', label: 'Mililitros' },
    { value: 'litros', label: 'Litros' },
    { value: 'unidades', label: 'Unidades' }
  ];

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Ocultar mensaje de éxito si está visible
    if (showSuccess) {
      setShowSuccess(false);
    }
  };

  // Validar un campo específico
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          return 'El nombre del ingrediente es obligatorio';
        }
        if (ingredientesExistentes.includes(value.trim().toLowerCase())) {
          return 'Este ingrediente ya existe en el inventario';
        }
        return '';

      case 'unidadMedida':
        if (!value) {
          return 'Selecciona una unidad de medida';
        }
        if (!unidadesMedida.some(u => u.value === value)) {
          return 'Selecciona una unidad de medida válida';
        }
        return '';

      case 'cantidadEnStock':
        if (!value) {
          return 'La cantidad en stock es obligatoria';
        }
        const stockNum = parseFloat(value);
        if (isNaN(stockNum)) {
          return 'Ingresa un número válido';
        }
        if (stockNum < 0) {
          return 'La cantidad no puede ser negativa';
        }
        return '';

      case 'cantidadMinima':
        if (!value) {
          return 'La cantidad mínima es obligatoria';
        }
        const minNum = parseFloat(value);
        if (isNaN(minNum)) {
          return 'Ingresa un número válido';
        }
        if (minNum < 0) {
          return 'La cantidad no puede ser negativa';
        }
        return '';

      default:
        return '';
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si el formulario es válido para habilitar el botón
  const isFormValid = () => {
    return (
      formData.nombre.trim() &&
      formData.unidadMedida &&
      formData.cantidadEnStock &&
      formData.cantidadMinima
    );
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      unidadMedida: '',
      cantidadEnStock: '',
      cantidadMinima: ''
    });
    setErrors({});
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implementar lógica de guardado real
      console.log('Nuevo ingrediente:', {
        ...formData,
        nombre: formData.nombre.trim(),
        cantidadEnStock: parseFloat(formData.cantidadEnStock),
        cantidadMinima: parseFloat(formData.cantidadMinima)
      });
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Limpiar formulario
      limpiarFormulario();
      
    } catch (error) {
      console.error('Error al guardar ingrediente:', error);
      setErrors({
        general: 'Error al guardar el ingrediente. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout isInternal={true}>
      <main className={styles.nuevoIngredientePage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Nuevo Ingrediente</h1>
            <p className={styles.subtitle}>
              Agrega un nuevo ingrediente a tu inventario
            </p>
          </div>

          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {errors.general && (
                <div className={styles.generalError} role="alert">
                  {errors.general}
                </div>
              )}

              {showSuccess && (
                <div className={styles.successMessage} role="alert">
                  ✓ Ingrediente guardado exitosamente
                </div>
              )}

              <Input
                type="text"
                name="nombre"
                label="Nombre del ingrediente"
                placeholder="Ej: Tomate, Cebolla, Aceite de oliva"
                value={formData.nombre}
                onChange={handleInputChange}
                error={errors.nombre}
                required
                autoComplete="off"
                autoFocus
              />

              <div className={styles.inputGroup}>
                <label htmlFor="unidadMedida" className={styles.label}>
                  Unidad de medida
                  <span className={styles.required} aria-label="obligatorio">*</span>
                </label>
                
                <input
                  list="unidades-datalist"
                  id="unidadMedida"
                  name="unidadMedida"
                  value={formData.unidadMedida}
                  onChange={handleInputChange}
                  placeholder="Selecciona una unidad"
                  required
                  className={`${styles.input} ${errors.unidadMedida ? styles.error : ''}`}
                  aria-invalid={errors.unidadMedida ? 'true' : 'false'}
                  aria-describedby={errors.unidadMedida ? 'unidadMedida-error' : undefined}
                />
                
                <datalist id="unidades-datalist">
                  {unidadesMedida.map((unidad) => (
                    <option key={unidad.value} value={unidad.value}>
                      {unidad.label}
                    </option>
                  ))}
                </datalist>
                
                {errors.unidadMedida && (
                  <span 
                    id="unidadMedida-error"
                    className={styles.errorMessage}
                    role="alert"
                  >
                    {errors.unidadMedida}
                  </span>
                )}
              </div>

              <Input
                type="number"
                name="cantidadEnStock"
                label="Cantidad en stock"
                placeholder="0"
                value={formData.cantidadEnStock}
                onChange={handleInputChange}
                error={errors.cantidadEnStock}
                required
                min="0"
                step="0.01"
                autoComplete="off"
              />

              <Input
                type="number"
                name="cantidadMinima"
                label="Cantidad mínima (alerta de stock bajo)"
                placeholder="0"
                value={formData.cantidadMinima}
                onChange={handleInputChange}
                error={errors.cantidadMinima}
                required
                min="0"
                step="0.01"
                autoComplete="off"
              />

              <div className={styles.formActions}>
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? 'Guardando ingrediente...' : 'Guardar ingrediente'}
                </Button>
                
                <Button
                  type="button"
                  variant="tertiary"
                  size="large"
                  onClick={limpiarFormulario}
                  disabled={isLoading}
                >
                  Limpiar formulario
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default NuevoIngrediente;