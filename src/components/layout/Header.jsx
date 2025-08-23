import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../common/Button';
import styles from './Header.module.css';

/**
 * Componente Header con navegación responsive y efectos de scroll
 */
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '#caracteristicas', label: 'Características' },
    { path: '#precios', label: 'Precios' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="SmartStocker - Inicio">
          SmartStocker
        </Link>

        {/* Navegación desktop */}
        <nav className={styles.nav} role="navigation" aria-label="Navegación principal">
          <ul className={styles.navLinks}>
            {navItems.map((item) => (
              <li key={item.path}>
                {item.path.startsWith('#') ? (
                  <button
                    href={item.path}
                   type="button"
                    className={styles.navLink}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(item.path);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`${styles.navLink} ${isActiveLink(item.path) ? styles.active : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          <div className={styles.loginButton}>
            <Button as={Link} to="/login" variant="primary" size="medium">
              Iniciar sesión
            </Button>
          </div>
        </nav>

        {/* Botón menú móvil */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
        >
          <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Menú móvil */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          <nav aria-label="Navegación móvil">
            <ul className={styles.mobileNavLinks}>
              {navItems.map((item) => (
                <li key={item.path}>
                  {item.path.startsWith('#') ? (
                    <a
                      href={item.path}
                      className={styles.mobileNavLink}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.querySelector(item.path);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className={`${styles.mobileNavLink} ${isActiveLink(item.path) ? styles.active : ''}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            <div className={styles.mobileLoginButton}>
              <Button as={Link} to="/login" variant="primary" size="medium" fullWidth>
                Iniciar sesión
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;