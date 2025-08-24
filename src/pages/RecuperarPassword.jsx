import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { isValidEmail } from '../utils/validators';
import styles from './RecuperarPassword.module.css';

/**
 * Página de recuperación de contraseña
 */
const RecuperarPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Manejar cambios en el input
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
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verificar si el formulario es válido para habilitar el botón
  const isFormValid = () => {
    return formData.email.trim();
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implementar lógica de recuperación real
      console.log('Solicitud de recuperación para:', formData.email);
      
      // Mostrar mensaje de éxito
      setEmailSent(true);
      
    } catch (error) {
      console.error('Error en recuperación:', error);
      setErrors({
        general: 'Error al enviar el correo. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si ya se envió el email, mostrar mensaje de confirmación
  if (emailSent) {
    return (
      <Layout showFooter={false}>
        <main className={styles.recuperarPage}>
          <div className={styles.recuperarContainer}>
            <div className={styles.recuperarCard}>
              <div className={styles.recuperarHeader}>
                <Link to="/" className={styles.logoLink}>
                  SmartStocker
                </Link>
                <div className={styles.successIcon}>
                  ✓
                </div>
                <h1 className={styles.recuperarTitle}>
                  Correo enviado
                </h1>
                <p className={styles.recuperarSubtitle}>
                  Hemos enviado las instrucciones para restablecer tu contraseña a <strong>{formData.email}</strong>
                </p>
              </div>

              <div className={styles.recuperarFooter}>
                <p className={styles.instructionsText}>
                  Revisa tu bandeja de entrada y sigue las instrucciones del correo. 
                  Si no lo encuentras, verifica tu carpeta de spam.
                </p>
                
                <div className={styles.backToLogin}>
                  <Link to="/login" className={styles.backLink}>
                    ← Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className={styles.recuperarInfo}>
              <h2 className={styles.infoTitle}>
                ¿Necesitas ayuda?
              </h2>
              <ul className={styles.infoList}>
                <li>El correo puede tardar unos minutos en llegar</li>
                <li>Verifica tu carpeta de spam o correo no deseado</li>
                <li>El enlace de recuperación expira en 24 horas</li>
                <li>Si no recibes el correo, intenta nuevamente</li>
              </ul>
              
              <div className={styles.contactInfo}>
                <p className={styles.contactText}>
                  ¿Sigues teniendo problemas? <br />
                  <strong>Contáctanos:</strong> soporte@smartstocker.com
                </p>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <main className={styles.recuperarPage}>
        <div className={styles.recuperarContainer}>
          <div className={styles.recuperarCard}>
            {/* Header */}
            <div className={styles.recuperarHeader}>
              <Link to="/" className={styles.logoLink} aria-label="Volver al inicio">
                SmartStocker
              </Link>
              <h1 className={styles.recuperarTitle}>
                Recuperar contraseña
              </h1>
              <p className={styles.recuperarSubtitle}>
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className={styles.recuperarForm} noValidate>
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

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
              </Button>
            </form>

            {/* Enlaces adicionales */}
            <div className={styles.recuperarFooter}>
              <div className={styles.backToLogin}>
                <Link to="/login" className={styles.backLink}>
                  ← Volver al inicio de sesión
                </Link>
              </div>
              
              <div className={styles.signupPrompt}>
                <span>¿No tienes cuenta?</span>
                <Link to="/registro" className={styles.signupLink}>
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className={styles.recuperarInfo}>
            <h2 className={styles.infoTitle}>
              Recuperación segura
            </h2>
            <ul className={styles.infoList}>
              <li>Proceso completamente seguro</li>
              <li>El enlace expira en 24 horas</li>
              <li>Solo tú puedes acceder al enlace</li>
              <li>Tus datos están protegidos</li>
            </ul>
            
            <div className={styles.trustIndicators}>
              <p className={styles.trustText}>
                <strong>Seguridad garantizada</strong> con encriptación de extremo a extremo
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default RecuperarPassword;