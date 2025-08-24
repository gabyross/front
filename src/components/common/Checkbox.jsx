import React, { useId } from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

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
  const autoId = useId();
  const checkboxId = id || name || autoId;

  const checkboxClasses = [
    styles.checkboxContainer,
    error && styles.error,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={checkboxClasses}>
      <label htmlFor={checkboxId} className={styles.checkboxWrapper}>
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={styles.hiddenCheckbox}
          aria-invalid={!!error}
          aria-describedby={error ? `${checkboxId}-error` : undefined}
          {...props}
        />

        {/* cuadrito visual (sin onClick) */}
        <span className={styles.customCheckbox} aria-hidden="true">
          <Check size={14} className={styles.checkIcon} />
        </span>

        {/* texto */}
        <span className={styles.label}>
          {label || children}
          {required && <span className={styles.required} aria-label="obligatorio">*</span>}
        </span>
      </label>

      {error && (
        <span id={`${checkboxId}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Checkbox;
