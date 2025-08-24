// Product/ingredient form
import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import styles from './ProductForm.module.css';

/**
 * Form component for creating/editing products and ingredients
 */
const ProductForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isLoading = false,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    ingredients: [],
    isActive: true,
    ...initialData
  });

  const [errors, setErrors] = useState({});

  // Available categories
  const categories = [
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'main-course', label: 'Main Course' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'side', label: 'Side Dish' }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid number greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const processedData = {
      ...formData,
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim()
    };

    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.productForm} noValidate>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {mode === 'create' ? 'Create New Product' : 'Edit Product'}
        </h2>
      </div>

      <div className={styles.formBody}>
        <div className={styles.row}>
          <Input
            type="text"
            name="name"
            label="Product Name"
            placeholder="e.g., Pizza Margherita"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
            autoFocus
          />

          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>
              Category
              <span className={styles.required}>*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={styles.select}
              required
              aria-invalid={errors.category ? 'true' : 'false'}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className={styles.errorMessage} role="alert">
                {errors.category}
              </span>
            )}
          </div>
        </div>

        <Input
          type="number"
          name="price"
          label="Price ($)"
          placeholder="0.00"
          value={formData.price}
          onChange={handleInputChange}
          error={errors.price}
          required
          min="0"
          step="0.01"
        />

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the product..."
            className={styles.textarea}
            rows="3"
          />
        </div>

        <Checkbox
          name="isActive"
          checked={formData.isActive}
          onChange={handleInputChange}
        >
          Product is active (available in menu)
        </Checkbox>
      </div>

      <div className={styles.formActions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading 
            ? (mode === 'create' ? 'Creating...' : 'Updating...') 
            : (mode === 'create' ? 'Create Product' : 'Update Product')
          }
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;