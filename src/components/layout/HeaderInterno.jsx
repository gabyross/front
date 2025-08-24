import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, Plus, Package, TrendingUp, BarChart3, Settings } from 'lucide-react';
import Button from '../common/Button';
import styles from './HeaderInterno.module.css';

/**
 * Header interno para pantallas autenticadas con navegación del dashboard
 */
const HeaderInterno = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // TODO: Implementar lógica de logout real
    console.log('Cerrando sesión...');
    navigate('/');
  };

  const navItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <BarChart3 size={18} />
    },
    { 
      path: '/nuevo-ingrediente', 
      label: 'Nuevo Ingrediente', 
      icon: <Plus size={18} />
    },
    { 
      path: '/ingredientes', 
      label: 'Ingredientes', 
      icon: <Package size={18} />
    },
    { 
      path: '/prediccion', 
      label: 'Predicción', 
      icon: <TrendingUp size={18} />
    },
    { 
      path: '/reportes', 
      label: 'Reportes', 
      icon: <BarChart3 size={18} />
    }
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/dashboard" className={styles.logo} aria-label="SmartStocker - Dashboard">
          SmartStocker
        </Link>

        {/* Navegación desktop */}
        <nav className={styles.nav} role="navigation" aria-label="Navegación principal">
          <ul className={styles.navLinks}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`${styles.navLink} ${isActiveLink(item.path) ? styles.active : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Menú de usuario desktop */}
        <div className={styles.userSection}>
          <div className={styles.userMenu}>
            <button
              className={styles.userButton}
              onClick={toggleUserMenu}
              aria-label="Menú de usuario"
              aria-expanded={isUserMenuOpen}
            >
              <User size={20} />
              <span className={styles.userName}>Usuario</span>
            </button>

            {isUserMenuOpen && (
              <div className={styles.userDropdown}>
                <Link to="/configuracion" className={styles.dropdownItem}>
                  <Settings size={16} />
                  Configuración
                </Link>
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Botón menú móvil */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          <nav aria-label="Navegación móvil">
            <ul className={styles.mobileNavLinks}>
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`${styles.mobileNavLink} ${isActiveLink(item.path) ? styles.active : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className={styles.mobileUserSection}>
              <Link to="/configuracion" className={styles.mobileNavLink}>
                <Settings size={18} />
                <span>Configuración</span>
              </Link>
              <button onClick={handleLogout} className={styles.mobileNavLink}>
                <LogOut size={18} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderInterno;