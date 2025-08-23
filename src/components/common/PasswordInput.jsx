import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './PasswordInput.module.css';

/**
 * Componente de input de contraseña con toggle de visibilidad
 */
const PasswordInput = ({
  name,
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  
  const inputClasses = [
    styles.passwordInput,
    error && styles.error,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.passwordGroup}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={styles.label}
        >
          {label}
          {required && <span className={styles.required} aria-label="obligatorio">*</span>}
        </label>
      )}
      
      <div className={styles.passwordContainer}>
        <input
          type={showPassword ? 'text' : 'password'}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        
        <button
          type="button"
          className={styles.toggleButton}
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff size={20} aria-hidden="true" />
          ) : (
            <Eye size={20} aria-hidden="true" />
          )}
        </button>
      </div>
      
      {error && (
        <span 
          id={`${inputId}-error`}
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;