import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Checkbox from '../components/common/Checkbox';
import { Plus, Trash2, Package, ArrowRight } from 'lucide-react';
import styles from './NewMenuItem.module.css';

/**
 * Página para crear un nuevo item del menú
 */
const NewMenuItem = () => {
  const navigate = useNavigate();
  
  // Mock data - índice de ingredientes disponibles
  const ingredientsIndex = {
    '1': { name: 'Tomate', unit: 'gramos' },
    '2': { name: 'Cebolla', unit: 'gramos' },
    '3': { name: 'Ajo', unit: 'gramos' },
    '4': { name: 'Aceite de oliva', unit: 'mililitros' },
    '5': { name: 'Sal', unit: 'gramos' },
    '6': { name: 'Pimienta', unit: 'gramos' },
    '7': { name: 'Queso mozzarella', unit: 'gramos' },
    '8': { name: 'Harina', unit: 'kilogramos' }
  };

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    active: true,
    ingredients: [{ ingredientId: '', requiredQty: '' }]
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Verificar si hay ingredientes disponibles
  const hasIngredients = Object.keys(ingredientsIndex).length > 0;

  // Manejar cambios en campos básicos
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
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

  // Manejar cambios en ingredientes
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));

    // Limpiar errores de ingredientes
    if (errors.ingredients) {
      setErrors(prev => ({
        ...prev,
        ingredients: ''
      }));
    }

    if (showSuccess) {
      setShowSuccess(false);
    }
  };

  // Agregar nueva fila de ingrediente
  const addIngredientRow = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredientId: '', requiredQty: '' }]
    }));
  };

  // Eliminar fila de ingrediente
  const removeIngredientRow = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  // Validar un campo específico
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'code':
        if (!value.trim()) {
          return 'El código es obligatorio';
        }
        return '';

      case 'name':
        if (!value.trim()) {
          return 'El nombre es obligatorio';
        }
        return '';

      case 'ingredients':
        if (!formData.ingredients.length) {
          return 'Debe agregar al menos un ingrediente';
        }
        
        for (let i = 0; i < formData.ingredients.length; i++) {
          const ingredient = formData.ingredients[i];
          if (!ingredient.ingredientId) {
            return `Seleccione un ingrediente en la fila ${i + 1}`;
          }
          if (!ingredient.requiredQty || isNaN(parseFloat(ingredient.requiredQty)) || parseFloat(ingredient.requiredQty) <= 0) {
            return `Ingrese una cantidad válida mayor a 0 en la fila ${i + 1}`;
          }
        }
        return '';

      default:
        return '';
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const newErrors = {};
    
    // Validar campos básicos
    ['code', 'name', 'ingredients'].forEach(field => {
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
    // Verificar campos básicos
    if (!formData.code.trim() || !formData.name.trim()) {
      return false;
    }

    // Verificar que hay al menos un ingrediente
    if (!formData.ingredients.length) {
      return false;
    }

    // Verificar que todos los ingredientes están completos
    return formData.ingredients.every(ingredient => 
      ingredient.ingredientId && 
      ingredient.requiredQty && 
      !isNaN(parseFloat(ingredient.requiredQty)) && 
      parseFloat(ingredient.requiredQty) > 0
    );
  };

  // Limpiar formulario
  const clearForm = () => {
    setFormData({
      code: '',
      name: '',
      active: true,
      ingredients: [{ ingredientId: '', requiredQty: '' }]
    });
    setErrors({});
  };

  // Handler para crear item (stub)
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implementar lógica de creación real
      console.log('Nuevo item del menú:', {
        ...formData,
        code: formData.code.trim(),
        name: formData.name.trim(),
        ingredients: formData.ingredients.map(ing => ({
          ingredientId: ing.ingredientId,
          requiredQty: parseFloat(ing.requiredQty)
        }))
      });
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Limpiar formulario
      clearForm();
      
    } catch (error) {
      console.error('Error al crear item del menú:', error);
      setErrors({
        general: 'Error al crear el item. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler para ir a ingredientes (stub)
  const handleGoToIngredients = () => {
    // TODO: Implementar navegación real
    console.log('Navegando a ingredientes...');
    navigate('/ingredients');
  };

  // Si no hay ingredientes, mostrar empty state
  if (!hasIngredients) {
    return (
      <Layout isInternal={true}>
        <main className={styles.newMenuItemPage}>
          <div className={styles.container}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Package size={64} />
              </div>
              <h1 className={styles.emptyTitle}>
                No hay ingredientes disponibles
              </h1>
              <p className={styles.emptyDescription}>
                Para crear items del menú, primero necesitas agregar ingredientes a tu inventario.
              </p>
              <Button
                variant="primary"
                size="large"
                onClick={handleGoToIngredients}
              >
                <ArrowRight size={20} />
                Ir a Ingredientes
              </Button>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout isInternal={true}>
      <main className={styles.newMenuItemPage}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.title}>Nuevo Item del Menú</h1>
              <p className={styles.subtitle}>
                Crea un nuevo plato o bebida para tu menú
              </p>
            </div>

            {/* Formulario */}
            <div className={styles.formContainer}>
              <form onSubmit={handleCreate} className={styles.form} noValidate>
                {errors.general && (
                  <div className={styles.generalError} role="alert">
                    {errors.general}
                  </div>
                )}

                {showSuccess && (
                  <div className={styles.successMessage} role="alert">
                    ✓ Item del menú creado exitosamente
                  </div>
                )}

                {/* Información básica */}
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Información básica</h2>
                  
                  <div className={styles.row}>
                    <Input
                      type="text"
                      name="code"
                      label="Código"
                      placeholder="Ej: PIZZA-MARG, PASTA-CARB"
                      value={formData.code}
                      onChange={handleInputChange}
                      error={errors.code}
                      required
                      autoComplete="off"
                      autoFocus
                    />

                    <Input
                      type="text"
                      name="name"
                      label="Nombre del plato"
                      placeholder="Ej: Pizza Margherita, Pasta Carbonara"
                      value={formData.name}
                      onChange={handleInputChange}
                      error={errors.name}
                      required
                      autoComplete="off"
                    />
                  </div>

                  <Checkbox
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                  >
                    Item activo (disponible en el menú)
                  </Checkbox>
                </div>

                {/* Ingredientes */}
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Ingredientes</h2>
                    <Button
                      type="button"
                      variant="secondary"
                      size="medium"
                      onClick={addIngredientRow}
                    >
                      <Plus size={16} />
                      Agregar ingrediente
                    </Button>
                  </div>

                  {errors.ingredients && (
                    <div className={styles.sectionError} role="alert">
                      {errors.ingredients}
                    </div>
                  )}

                  <div className={styles.ingredientsList}>
                    {formData.ingredients.map((ingredient, index) => (
                      <div key={index} className={styles.ingredientRow}>
                        <div className={styles.ingredientSelect}>
                          <label 
                            htmlFor={`ingredient-${index}`}
                            className={styles.label}
                          >
                            Ingrediente
                            <span className={styles.required} aria-label="obligatorio">*</span>
                          </label>
                          <select
                            id={`ingredient-${index}`}
                            value={ingredient.ingredientId}
                            onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                            className={styles.select}
                            required
                          >
                            <option value="">Seleccionar ingrediente</option>
                            {Object.entries(ingredientsIndex).map(([id, data]) => (
                              <option key={id} value={id}>
                                {data.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={styles.quantityInput}>
                          <label 
                            htmlFor={`quantity-${index}`}
                            className={styles.label}
                          >
                            Cantidad
                            {ingredient.ingredientId && (
                              <span className={styles.unit}>
                                ({ingredientsIndex[ingredient.ingredientId]?.unit})
                              </span>
                            )}
                            <span className={styles.required} aria-label="obligatorio">*</span>
                          </label>
                          <input
                            type="number"
                            id={`quantity-${index}`}
                            value={ingredient.requiredQty}
                            onChange={(e) => handleIngredientChange(index, 'requiredQty', e.target.value)}
                            placeholder="0"
                            min="0"
                            step="0.01"
                            className={styles.input}
                            required
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeIngredientRow(index)}
                          className={styles.removeButton}
                          disabled={formData.ingredients.length === 1}
                          aria-label={`Eliminar ingrediente ${index + 1}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className={styles.formActions}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    disabled={!isFormValid() || isLoading}
                  >
                    {isLoading ? 'Creando item...' : 'Crear item'}
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
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default NewMenuItem;