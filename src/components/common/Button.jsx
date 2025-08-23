import React from 'react';
import styles from './Button.module.css';

/**
 * Componente Button reutilizable con diferentes variantes y tamaños
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  as: Component = 'button',
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className
  ].filter(Boolean).join(' ');

  const buttonProps = {
    className: buttonClasses,
    disabled,
    onClick,
    ...props
  };

  if (Component !== 'button') {
    return (
      <Component {...buttonProps}>
        {children}
      </Component>
    );
  }

  return (
    <button
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;