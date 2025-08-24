import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Checkbox from '../components/common/Checkbox';
import { isValidEmail, isValidPassword, passwordsMatch, isValidFullName } from '../utils/validators';
import styles from './Registro.module.css';

/**
 * Página de registro de usuario
 */
const Registro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir/cambiar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario completo
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre completo
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
    } else if (!isValidFullName(formData.fullName)) {
      newErrors.fullName = 'Ingresa tu nombre y apellido';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!isValidPassword(formData.password, 8)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar términos y condiciones
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si el formulario es válido para habilitar el botón
  const isFormValid = () => {
  const fullName = formData.fullName.trim();
  const email = formData.email.trim();

  return (
    !!fullName &&
    isValidFullName(fullName) &&
    !!email &&
    isValidEmail(email) &&
    !!formData.password &&
    isValidPassword(formData.password, 8) &&
    !!formData.confirmPassword &&
    passwordsMatch(formData.password, formData.confirmPassword) &&
    !!formData.acceptTerms
  );
};

  // Debug: mostrar estado del formulario (remover en producción)
  console.log('Form state:', {
    fullName: formData.fullName.trim(),
    isValidFullName: isValidFullName(formData.fullName.trim()),
    email: formData.email.trim(),
    isValidEmail: isValidEmail(formData.email),
    password: formData.password,
    isValidPassword: isValidPassword(formData.password, 8),
    confirmPassword: formData.confirmPassword,
    passwordsMatch: passwordsMatch(formData.password, formData.confirmPassword),
    acceptTerms: formData.acceptTerms,
    isFormValid: isFormValid()
  });

  // Handler de registro (stub para integración futura)
  const onRegister = async (userData) => {
    // TODO: Integrar con API de registro
    console.log('Datos de registro:', userData);
    
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular éxito y redirigir a login
    alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
    navigate('/login');
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onRegister(formData);
    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({
        general: 'Error al crear la cuenta. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <main className={styles.registroPage}>
        <div className={styles.registroContainer}>
          <div className={styles.registroCard}>
            <div className={styles.registroHeader}>
              <Link to="/" className={styles.logoLink}>
                SmartStocker
              </Link>
              <h1 className={styles.registroTitle}>
                Crear cuenta
              </h1>
              <p className={styles.registroSubtitle}>
                Únete a SmartStocker y optimiza tu restaurante
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className={styles.registroForm} noValidate>
              {errors.general && (
                <div className={styles.generalError} role="alert">
                  {errors.general}
                </div>
              )}

              <Input
                type="text"
                name="fullName"
                label="Nombre completo"
                placeholder="Juan Pérez"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                required
                autoComplete="name"
                autoFocus
              />

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
              />

              <PasswordInput
                name="password"
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                autoComplete="new-password"
              />

              <PasswordInput
                name="confirmPassword"
                label="Confirmar contraseña"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />

              <Checkbox
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                error={errors.acceptTerms}
                required
              >
                <span>
                  Acepto los{' '}
                  <a 
                    href="/terminos" 
                    className={styles.termsLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    términos y condiciones
                  </a>
                  {' '}y la{' '}
                  <a 
                    href="/privacidad" 
                    className={styles.termsLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    política de privacidad
                  </a>
                </span>
              </Checkbox>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>

            {/* Enlaces adicionales */}
            <div className={styles.registroFooter}>
              <div className={styles.loginPrompt}>
                <span>¿Ya tienes cuenta?</span>
                <Link to="/login" className={styles.loginLink}>
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className={styles.registroInfo}>
            <h2 className={styles.infoTitle}>
              Comienza a optimizar tu restaurante hoy
            </h2>
            <ul className={styles.infoList}>
              <li>Predicciones precisas de ventas</li>
              <li>Optimización automática de inventario</li>
              <li>Reducción de desperdicios hasta 40%</li>
              <li>Análisis detallados y reportes</li>
              <li>Soporte especializado para restaurantes</li>
            </ul>
            
            <div className={styles.trustIndicators}>
              <p className={styles.trustText}>
                <strong>+500 restaurantes</strong> ya confían en SmartStocker
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Registro;