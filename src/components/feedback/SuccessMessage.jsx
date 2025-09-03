import React from 'react';
import { CheckCircle } from 'lucide-react';
import styles from './SuccessMessage.module.css';

/**
 * Componente para mostrar mensajes de éxito
 */
const SuccessMessage = ({ 
  message, 
  title,
  showIcon = true,
  className = '',
  ...props 
}) => {
  if (!message) return null;

  return (
    <div 
      className={`${styles.successMessage} ${className}`}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {showIcon && (
        <div className={styles.icon} aria-hidden="true">
          <CheckCircle size={20} />
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

export default SuccessMessage;