import React from 'react';
import classNames from 'classnames';
import styles from './TextField.module.css';

/**
 * Componente TextField reutilizable con soporte para react-hook-form
 */
const TextField = React.forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  icon: Icon,
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const hasError = !!error;

  const inputClasses = classNames(
    styles.input,
    {
      [styles['input--error']]: hasError,
      [styles['input--disabled']]: disabled,
      [styles['input--with-icon']]: Icon
    },
    className
  );

  return (
    <div className={styles.field}>
      {label && (
        <label 
          htmlFor={fieldId}
          className={styles.label}
        >
          {label}
          {required && <span className={styles.required} aria-label="requerido">*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {Icon && (
          <div className={styles.icon} aria-hidden="true">
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          {...props}
        />
      </div>
      
      {hasError && (
        <div 
          id={errorId}
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
});

TextField.displayName = 'TextField';

export default TextField;