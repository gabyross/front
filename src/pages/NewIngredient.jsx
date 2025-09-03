import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Leaf, Carrot, Apple, Coffee } from 'lucide-react';
import { useCreateIngredient } from '../hooks/useCreateIngredient.js';
import styles from './NewIngredient.module.css';

/**
 * Página para agregar un nuevo ingrediente al inventario
 */
const NewIngredient = () => {
  const { submit, isSubmitting, error: submitError } = useCreateIngredient();

  const [formData, setFormData] = useState({
    name: '',
    measurementUnit: '',
    stockQuantity: '',
    minimumQuantity: ''
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Opciones de unidades de medida (deben coincidir con backend)
  const measurementUnits = [
    { value: 'gramos', label: 'Gramos' },
    { value: 'kilogramos', label: 'Kilogramos' },
    { value: 'mililitros', label: 'Mililitros' },
    { value: 'litros', label: 'Litros' },
    { value: 'unidades', label: 'Unidades' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (showSuccess) setShowSuccess(false);
  };

  // Validaciones básicas
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'name':
        if (!value.trim()) return 'El nombre del ingrediente es obligatorio';
        return '';
      case 'measurementUnit':
        if (!value) return 'Selecciona una unidad de medida';
        if (!measurementUnits.some(u => u.value === value)) return 'Selecciona una unidad de medida válida';
        return '';
      case 'stockQuantity': {
        if (value === '' || value === null) return 'La cantidad en stock es obligatoria';
        const n = Number(value);
        if (Number.isNaN(n)) return 'Ingresa un número válido';
        if (n < 0) return 'La cantidad no puede ser negativa';
        return '';
      }
      case 'minimumQuantity': {
        if (value === '' || value === null) return 'La cantidad mínima es obligatoria';
        const n = Number(value);
        if (Number.isNaN(n)) return 'Ingresa un número válido';
        if (n < 0) return 'La cantidad no puede ser negativa';
        return '';
      }
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    for (const [k, v] of Object.entries(formData)) {
      const err = validateField(k, v);
      if (err) newErrors[k] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () =>
    formData.name.trim() &&
    formData.measurementUnit &&
    formData.stockQuantity !== '' &&
    formData.minimumQuantity !== '';

  const clearForm = () => {
    setFormData({
      name: '',
      measurementUnit: '',
      stockQuantity: '',
      minimumQuantity: '',
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await submit(formData);
      setShowSuccess(true);
      clearForm();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: 'Error al guardar el ingrediente. Inténtalo de nuevo.',
      }));
    }
  };

  return (
    <Layout isInternal={true}>
      <main className={styles.newIngredientPage}>
        {/* Elementos decorativos flotantes */}
        <div className={styles.floatingElements}>
          <div className={`${styles.floatingIcon} ${styles.icon1}`}><Leaf size={32} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon2}`}><Carrot size={28} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon3}`}><Apple size={30} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon4}`}><Coffee size={26} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon5}`}><Leaf size={24} /></div>
          <div className={`${styles.floatingIcon} ${styles.icon6}`}><Carrot size={22} /></div>
        </div>

        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {/* Columna izquierda */}
            <div className={styles.visualColumn}>
              <div className={styles.visualContent}>
                <div className={styles.mainIcon}>
                  <div className={styles.iconCircle}><Leaf size={48} /></div>
                </div>
                <h2 className={styles.visualTitle}>Gestiona tu inventario</h2>
                <p className={styles.visualDescription}>
                  Agrega ingredientes frescos a tu inventario y mantén un control preciso del stock.
                </p>

                <div className={styles.benefitsList}>
                  <div className={styles.benefitItem}><div className={styles.benefitIcon}><Leaf size={16} /></div><span>Control de stock en tiempo real</span></div>
                  <div className={styles.benefitItem}><div className={styles.benefitIcon}><Carrot size={16} /></div><span>Alertas de stock bajo</span></div>
                  <div className={styles.benefitItem}><div className={styles.benefitIcon}><Apple size={16} /></div><span>Optimización de compras</span></div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Formulario */}
            <div className={styles.formColumn}>
              <div className={styles.header}>
                <h1 className={styles.title}>Nuevo Ingrediente</h1>
                <p className={styles.subtitle}>Agrega un nuevo ingrediente a tu inventario</p>
              </div>

              <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  {(errors.general || submitError) && (
                    <div className={styles.generalError} role="alert">
                      {errors.general || 'Error al guardar el ingrediente. Inténtalo de nuevo.'}
                    </div>
                  )}

                  {showSuccess && (
                    <div className={styles.successMessage} role="alert">
                      ✓ Ingrediente guardado exitosamente
                    </div>
                  )}

                  <Input
                    type="text"
                    name="name"
                    label="Nombre del ingrediente"
                    placeholder="Ej: Tomate, Cebolla, Aceite de oliva"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    required
                    autoComplete="off"
                    autoFocus
                  />

                  <div className={styles.inputGroup}>
                    <label htmlFor="measurementUnit" className={styles.label}>
                      Unidad de medida <span className={styles.required} aria-label="obligatorio">*</span>
                    </label>

                    <input
                      list="units-datalist"
                      id="measurementUnit"
                      name="measurementUnit"
                      value={formData.measurementUnit}
                      onChange={handleInputChange}
                      placeholder="Selecciona una unidad"
                      required
                      className={`${styles.input} ${errors.measurementUnit ? styles.error : ''}`}
                      aria-invalid={errors.measurementUnit ? 'true' : 'false'}
                      aria-describedby={errors.measurementUnit ? 'measurementUnit-error' : undefined}
                    />

                    <datalist id="units-datalist">
                      {measurementUnits.map((u) => (
                        <option key={u.value} value={u.value}>{u.label}</option>
                      ))}
                    </datalist>

                    {errors.measurementUnit && (
                      <span id="measurementUnit-error" className={styles.errorMessage} role="alert">
                        {errors.measurementUnit}
                      </span>
                    )}
                  </div>

                  <Input
                    type="number"
                    name="stockQuantity"
                    label="Cantidad en stock"
                    placeholder="0"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    error={errors.stockQuantity}
                    required
                    min="0"
                    step="0.01"
                    autoComplete="off"
                  />

                  <Input
                    type="number"
                    name="minimumQuantity"
                    label="Cantidad mínima (alerta de stock bajo)"
                    placeholder="0"
                    value={formData.minimumQuantity}
                    onChange={handleInputChange}
                    error={errors.minimumQuantity}
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
                      disabled={!isFormValid() || isSubmitting}
                    >
                      {isSubmitting ? 'Guardando ingrediente...' : 'Guardar ingrediente'}
                    </Button>

                    <Button
                      type="button"
                      variant="tertiary"
                      size="large"
                      onClick={clearForm}
                      disabled={isSubmitting}
                    >
                      Limpiar formulario
                    </Button>
                  </div>
                </form>
              </div>
            </div>
            {/* fin columna formulario */}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default NewIngredient;
