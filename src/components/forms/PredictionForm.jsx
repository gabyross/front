// Prediction parameters form
import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import styles from './PredictionForm.module.css';

/**
 * Form component for sales prediction parameters
 */
const PredictionForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    period: '7', // days
    menuItem: 'all',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

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

    if (!formData.period) {
      newErrors.period = 'Period is required';
    }

    if (!formData.menuItem) {
      newErrors.menuItem = 'Menu item selection is required';
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

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.predictionForm} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="period" className={styles.label}>
          Prediction Period
        </label>
        <select
          id="period"
          name="period"
          value={formData.period}
          onChange={handleInputChange}
          className={styles.select}
          aria-invalid={errors.period ? 'true' : 'false'}
        >
          <option value="7">Next 7 days</option>
          <option value="14">Next 14 days</option>
          <option value="30">Next 30 days</option>
        </select>
        {errors.period && (
          <span className={styles.errorMessage} role="alert">
            {errors.period}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="menuItem" className={styles.label}>
          Menu Item
        </label>
        <select
          id="menuItem"
          name="menuItem"
          value={formData.menuItem}
          onChange={handleInputChange}
          className={styles.select}
          aria-invalid={errors.menuItem ? 'true' : 'false'}
        >
          <option value="all">All items</option>
          <option value="pizza-margherita">Pizza Margherita</option>
          <option value="pasta-carbonara">Pasta Carbonara</option>
          <option value="risotto-mushroom">Mushroom Risotto</option>
        </select>
        {errors.menuItem && (
          <span className={styles.errorMessage} role="alert">
            {errors.menuItem}
          </span>
        )}
      </div>

      <div className={styles.dateRange}>
        <Input
          type="date"
          name="dateRange.start"
          label="Start Date (optional)"
          value={formData.dateRange.start}
          onChange={handleInputChange}
          error={errors['dateRange.start']}
        />
        
        <Input
          type="date"
          name="dateRange.end"
          label="End Date (optional)"
          value={formData.dateRange.end}
          onChange={handleInputChange}
          error={errors['dateRange.end']}
        />
      </div>

      <div className={styles.formActions}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isLoading}
        >
          {isLoading ? 'Generating Prediction...' : 'Generate Prediction'}
        </Button>
      </div>
    </form>
  );
};

export default PredictionForm;