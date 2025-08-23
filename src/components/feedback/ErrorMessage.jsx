import React from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './ErrorMessage.module.css';

/**
 * Componente para mostrar mensajes de error
 */
const ErrorMessage = ({ 
  message, 
  title,
  showIcon = true,
  className = '',
  ...props 
}) => {
  if (!message) return null;

  return (
    <div 
      className={`${styles.errorMessage} ${className}`}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      {showIcon && (
        <div className={styles.icon} aria-hidden="true">
          <AlertCircle size={20} />
        </div>
      )}
      
      <div className={styles.content}>
        {title && (
          <h4 className={styles.title}>{title}</h4>
        )}
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;