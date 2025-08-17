import React from 'react';
import styles from './Card.module.css';

/**
 * Componente Card reutilizable para mostrar contenido agrupado
 */
const Card = ({
  children,
  title,
  icon,
  padding = 'comfortable',
  variant = 'default',
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  const cardClasses = [
    styles.card,
    styles[padding],
    styles[variant],
    clickable && styles.clickable,
    className
  ].filter(Boolean).join(' ');

  const CardComponent = clickable ? 'button' : 'div';

  return (
    <CardComponent
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {(title || icon) && (
        <div className={styles.header}>
          {icon && <div className={styles.icon}>{icon}</div>}
          {title && <h3 className={styles.title}>{title}</h3>}
        </div>
      )}
      <div className={styles.content}>
        {children}
      </div>
    </CardComponent>
  );
};

export default Card;