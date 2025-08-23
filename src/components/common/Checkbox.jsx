import React from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

/**
 * Componente Checkbox reutilizable con estilos personalizados
 */
const Checkbox = ({
  name,
  id,
  checked = false,
  onChange,
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const checkboxId = id || name;
  
  const checkboxClasses = [
    styles.checkboxContainer,
    error && styles.error,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={checkboxClasses}>
      <div className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={styles.hiddenCheckbox}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          {...props}
        />
        
        <div className={styles.customCheckbox} aria-hidden="true">
          {checked && (
            <Check size={14} className={styles.checkIcon} />
          )}
        </div>
        
        {(label || children) && (
          <label 
            htmlFor={checkboxId} 
            className={styles.label}
          >
            {label || children}
            {required && <span className={styles.required} aria-label="obligatorio">*</span>}
          </label>
        )}
      </div>
      
      {error && (
        <span 
          id={`${checkboxId}-error`}
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Checkbox;