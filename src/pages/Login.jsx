import React, { useState } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import { setDevAuthed } from '../auth/devAuth.js';
import styles from './Login.module.css';

/**
 * Página de inicio de sesión
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    // Validar contraseña
    if (!formData.password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada a API (por ahora solo redirige al home)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Flag de “logueado” (temporal, sin auth real)
      setDevAuthed(true);
      
      // TODO: Implementar lógica de autenticación real
      // Redirección a donde el usuario quería ir, o default
      const params = new URLSearchParams(location.search);
      const redirect = params.get('redirect') || '/nuevo-ingrediente';
      navigate(redirect, { replace: true });
    } catch (error) {
      console.error('Error en login:', error);
      setErrors({ general: 'Error al iniciar sesión. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <main className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            {/* Header */}
            <div className={styles.loginHeader}>
              <Link to="/" className={styles.logoLink} aria-label="Volver al inicio">
                SmartStocker
              </Link>
              <h1 className={styles.loginTitle}>
                Iniciar sesión
              </h1>
              <p className={styles.loginSubtitle}>
                Accede a tu cuenta para gestionar tu restaurante
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
              {errors.general && (
                <div className={styles.generalError} role="alert">
                  {errors.general}
                </div>
              )}

              <Input
                type="email"
                name="email"
                label="Correo electrónico"
                placeholder="tu@restaurante.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                autoComplete="email"
                autoFocus
              />

              <PasswordInput
                name="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            {/* Enlaces adicionales */}
            <div className={styles.loginFooter}>
              <Link to="/recover-password" className={styles.forgotLink}>
                ¿Olvidaste tu contraseña?
              </Link>
              
              <div className={styles.signupPrompt}>
                <span>¿No tienes cuenta?</span>
                <Link to="/register" className={styles.signupLink}>
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className={styles.loginInfo}>
            <h2 className={styles.infoTitle}>
              Optimiza tu restaurante con inteligencia artificial
            </h2>
            <ul className={styles.infoList}>
              <li>Predice ventas con alta precisión</li>
              <li>Optimiza tu inventario automáticamente</li>
              <li>Reduce desperdicios y costos</li>
              <li>Toma decisiones basadas en datos</li>
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Login;