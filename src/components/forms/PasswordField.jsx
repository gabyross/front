import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import TextField from './TextField';
import styles from './PasswordField.module.css';

/**
 * Componente PasswordField con toggle para mostrar/ocultar contraseña
 */
const PasswordField = React.forwardRef(({
  label = 'Contraseña',
  placeholder = 'Ingresa tu contraseña',
  showToggle = true,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.passwordField}>
      <TextField
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        label={label}
        placeholder={placeholder}
        {...props}
      />
      
      {showToggle && (
        <button
          type="button"
          className={styles.toggleButton}
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          tabIndex={0}
        >
          {showPassword ? (
            <EyeOff size={20} aria-hidden="true" />
          ) : (
            <Eye size={20} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
});

PasswordField.displayName = 'PasswordField';

export default PasswordField;