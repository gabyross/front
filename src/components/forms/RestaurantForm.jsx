// Restaurant data form
import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import styles from './RestaurantForm.module.css';

/**
 * Form component for restaurant information
 */
const RestaurantForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isLoading = false,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cuisineType: '',
    operatingHours: {
      open: '',
      close: ''
    },
    capacity: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});

  // Available cuisine types
  const cuisineTypes = [
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'american', label: 'American' },
    { value: 'french', label: 'French' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'indian', label: 'Indian' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'other', label: 'Other' }
  ];

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

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.cuisineType) {
      newErrors.cuisineType = 'Cuisine type is required';
    }

    if (!formData.operatingHours.open) {
      newErrors['operatingHours.open'] = 'Opening time is required';
    }

    if (!formData.operatingHours.close) {
      newErrors['operatingHours.close'] = 'Closing time is required';
    }

    if (formData.capacity && (isNaN(parseInt(formData.capacity)) || parseInt(formData.capacity) <= 0)) {
      newErrors.capacity = 'Capacity must be a valid number greater than 0';
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
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      capacity: formData.capacity ? parseInt(formData.capacity) : null
    };

    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.restaurantForm} noValidate>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {mode === 'create' ? 'Restaurant Information' : 'Edit Restaurant Information'}
        </h2>
      </div>

      <div className={styles.formBody}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Basic Information</h3>
          
          <div className={styles.row}>
            <Input
              type="text"
              name="name"
              label="Restaurant Name"
              placeholder="e.g., La Bella Vista"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              required
              autoFocus
            />

            <div className={styles.formGroup}>
              <label htmlFor="cuisineType" className={styles.label}>
                Cuisine Type
                <span className={styles.required}>*</span>
              </label>
              <select
                id="cuisineType"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleInputChange}
                className={styles.select}
                required
                aria-invalid={errors.cuisineType ? 'true' : 'false'}
              >
                <option value="">Select cuisine type</option>
                {cuisineTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.cuisineType && (
                <span className={styles.errorMessage} role="alert">
                  {errors.cuisineType}
                </span>
              )}
            </div>
          </div>

          <Input
            type="text"
            name="address"
            label="Address"
            placeholder="e.g., 123 Main St, Buenos Aires"
            value={formData.address}
            onChange={handleInputChange}
            error={errors.address}
            required
          />

          <div className={styles.row}>
            <Input
              type="tel"
              name="phone"
              label="Phone Number"
              placeholder="e.g., +54 11 1234-5678"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              required
            />

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="e.g., info@restaurant.com"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Operating Information</h3>
          
          <div className={styles.row}>
            <Input
              type="time"
              name="operatingHours.open"
              label="Opening Time"
              value={formData.operatingHours.open}
              onChange={handleInputChange}
              error={errors['operatingHours.open']}
              required
            />

            <Input
              type="time"
              name="operatingHours.close"
              label="Closing Time"
              value={formData.operatingHours.close}
              onChange={handleInputChange}
              error={errors['operatingHours.close']}
              required
            />
          </div>

          <Input
            type="number"
            name="capacity"
            label="Seating Capacity (optional)"
            placeholder="e.g., 50"
            value={formData.capacity}
            onChange={handleInputChange}
            error={errors.capacity}
            min="1"
          />
        </div>
      </div>

      <div className={styles.formActions}>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
        >
          {isLoading 
            ? (mode === 'create' ? 'Saving...' : 'Updating...') 
            : (mode === 'create' ? 'Save Information' : 'Update Information')
          }
        </Button>
      </div>
    </form>
  );
};

export default RestaurantForm;