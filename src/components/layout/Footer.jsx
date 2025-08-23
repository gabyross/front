import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

/**
 * Componente Footer con enlaces y información de copyright
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: '/terminos', label: 'Términos de Servicio' },
    { path: '/privacidad', label: 'Política de Privacidad' },
    { path: '/contacto', label: 'Contacto' },
    { path: '/ayuda', label: 'Ayuda' },
  ];

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Marca y descripción */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo} aria-label="SmartStocker - Inicio">
              SmartStocker
            </Link>
            <p className={styles.description}>
              Plataforma inteligente para la predicción de ventas y optimización de inventario en restaurantes.
            </p>
          </div>

          {/* Enlaces del footer */}
          <nav aria-label="Enlaces del pie de página">
            <ul className={styles.links}>
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Separador */}
        <div className={styles.separator}></div>

        {/* Copyright */}
        <p className={styles.copyright}>
          © {currentYear} SmartStocker. Todos los derechos reservados. 
          Desarrollado con ❤️ para restaurantes en CABA.
        </p>
      </div>
    </footer>
  );
};

export default Footer;