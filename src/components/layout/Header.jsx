import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import styles from './Header.module.css';

/**
 * Componente de encabezado con navegación responsive y efectos de scroll
 * Cambia de apariencia al hacer scroll y muestra estado de autenticación
 */
const Encabezado = () => {
  const [seHizoScroll, establecerSeHizoScroll] = useState(false);
  const [menuMovilAbierto, establecerMenuMovilAbierto] = useState(false);
  const { usuarioAutenticado, usuario, cerrarSesion } = useAuth();
  const ubicacionActual = useLocation();

  // Detectar scroll para cambiar el estilo del encabezado
  useEffect(() => {
    const manejarScroll = () => {
      const posicionScroll = window.scrollY;
      establecerSeHizoScroll(posicionScroll > 10);
    };

    window.addEventListener('scroll', manejarScroll);
    return () => window.removeEventListener('scroll', manejarScroll);
  }, []);

  // Cerrar menú móvil automáticamente al cambiar de ruta
  useEffect(() => {
    establecerMenuMovilAbierto(false);
  }, [ubicacionActual]);

  // Alternar visibilidad del menú móvil
  const alternarMenuMovil = () => {
    establecerMenuMovilAbierto(!menuMovilAbierto);
  };

  // Manejar el cierre de sesión del usuario
  const manejarCierreDeSesion = async () => {
    await cerrarSesion();
  };

  // Elementos de navegación principal
  const elementosNavegacion = [
    { path: '/', label: 'Inicio' },
    { path: '#caracteristicas', label: 'Características' },
    { path: '#precios', label: 'Precios' },
  ];

  return (
    <header className={`${styles.encabezado} ${seHizoScroll ? styles.conScroll : ''}`}>
      <div className={styles.contenedor}>
        {/* Logo de la aplicación */}
        <Link to="/" className={styles.logo} aria-label="SmartStocker - Inicio">
          SmartStocker
        </Link>

        {/* Navegación para escritorio */}
        <nav className={styles.navegacion} role="navigation" aria-label="Navegación principal">
          <ul className={styles.enlacesNavegacion}>
            {elementosNavegacion.map((elemento) => (
              <li key={elemento.path}>
                {elemento.path.startsWith('#') ? (
                  <a
                    href={elemento.path}
                    className={styles.enlaceNavegacion}
                    onClick={(e) => {
                      e.preventDefault();
                      // Desplazamiento suave a la sección correspondiente
                      const seccion = document.querySelector(elemento.path);
                      if (seccion) {
                        seccion.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {elemento.label}
                  </a>
                ) : (
                  <NavLink
                    to={elemento.path}
                    className={({ isActive }) => 
                      `${styles.enlaceNavegacion} ${isActive ? styles.activo : ''}`
                    }
                  >
                    {elemento.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
          
          {/* Sección de autenticación o información de usuario */}
          <div className={styles.seccionAutenticacion}>
            {usuarioAutenticado ? (
              <div className={styles.informacionUsuario}>
                <span className={styles.nombreUsuario}>Hola, {usuario?.nombre}</span>
                <Button 
                  variant="secondary" 
                  size="medium"
                  onClick={manejarCierreDeSesion}
                >
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Button as={Link} to="/login" variant="primary" size="medium">
                Iniciar sesión
              </Button>
            )}
          </div>
        </nav>

        {/* Botón para menú móvil */}
        <button
          className={styles.botonMenuMovil}
          onClick={alternarMenuMovil}
          aria-label={menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuMovilAbierto}
        >
          <div className={`${styles.hamburguesa} ${menuMovilAbierto ? styles.abierto : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Menú desplegable para móviles */}
      <div className={`${styles.menuMovil} ${menuMovilAbierto ? styles.abierto : ''}`}>
        <div className={styles.contenidoMenuMovil}>
          <nav aria-label="Navegación móvil">
            <ul className={styles.enlacesNavegacionMovil}>
              {elementosNavegacion.map((elemento) => (
                <li key={elemento.path}>
                  {elemento.path.startsWith('#') ? (
                    <a
                      href={elemento.path}
                      className={styles.enlaceNavegacionMovil}
                      onClick={(e) => {
                        e.preventDefault();
                        // Desplazamiento suave y cierre del menú móvil
                        const seccion = document.querySelector(elemento.path);
                        if (seccion) {
                          seccion.scrollIntoView({ behavior: 'smooth' });
                        }
                        establecerMenuMovilAbierto(false);
                      }}
                    >
                      {elemento.label}
                    </a>
                  ) : (
                    <NavLink
                      to={elemento.path}
                      className={({ isActive }) => 
                        `${styles.enlaceNavegacionMovil} ${isActive ? styles.activo : ''}`
                      }
                      onClick={() => establecerMenuMovilAbierto(false)}
                    >
                      {elemento.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
            
            {/* Sección de autenticación en menú móvil */}
            <div className={styles.seccionAutenticacionMovil}>
              {usuarioAutenticado ? (
                <div className={styles.informacionUsuarioMovil}>
                  <span className={styles.nombreUsuarioMovil}>Hola, {usuario?.nombre}</span>
                  <Button 
                    variant="secondary" 
                    size="medium" 
                    fullWidth
                    onClick={() => {
                      manejarCierreDeSesion();
                      establecerMenuMovilAbierto(false);
                    }}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              ) : (
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="primary" 
                  size="medium" 
                  fullWidth
                  onClick={() => establecerMenuMovilAbierto(false)}
                >
                  Iniciar sesión
                </Button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Encabezado;