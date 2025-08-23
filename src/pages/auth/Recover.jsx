import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { TextField } from '../../components/forms';
import { ErrorMessage, SuccessMessage } from '../../components/feedback';
import Button from '../../components/common/Button';
import styles from './Recover.module.css';

// Schema de validación con Zod
const recoverSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
});

/**
 * Página de recuperación de contraseña
 */
const Recover = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, loading, error, clearError, isAuthenticated } = useAuth();
  const [success, setSuccess] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Configurar formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(recoverSchema),
    defaultValues: {
      email: ''
    }
  });

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
    setSuccess(false);
  }, [clearError]);

  // Manejar envío del formulario
  const onSubmit = async (data) => {
    setSuccess(false);
    
    const result = await requestPasswordReset(data.email);
    
    if (result.ok) {
      setSuccess(true);
      reset();
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <Layout showFooter={false}>
      <main className={styles.recoverPage}>
        <div className={styles.container}>
          <div className={styles.recoverCard}>
            {/* Header */}
            <header className={styles.header}>
              <h1 className={styles.title}>Recuperar contraseña</h1>
              <p className={styles.subtitle}>
                Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
              </p>
            </header>

            {/* Mensaje de éxito */}
            {success && (
              <SuccessMessage 
                title="Instrucciones enviadas"
                message="Si el email está registrado en nuestro sistema, recibirás instrucciones para recuperar tu contraseña en los próximos minutos."
                className={styles.successMessage}
              />
            )}

            {/* Formulario */}
            {!success && (
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
                {/* Mensaje de error global */}
                {error && (
                  <ErrorMessage 
                    message={error}
                    className={styles.errorMessage}
                  />
                )}

                {/* Campo Email */}
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  icon={Mail}
                  error={errors.email?.message}
                  disabled={isLoading}
                  required
                  {...register('email')}
                />

                {/* Botón de envío */}
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  className={styles.submitButton}
                >
                  {isLoading ? 'Enviando instrucciones...' : 'Enviar instrucciones'}
                </Button>
              </form>
            )}

            {/* Enlaces adicionales */}
            <footer className={styles.footer}>
              <Link 
                to="/login" 
                className={styles.backLink}
                aria-label="Volver a iniciar sesión"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Volver a iniciar sesión
              </Link>
              
              {success && (
                <>
                  <div className={styles.divider}>
                    <span>¿No recibiste el email?</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className={styles.retryButton}
                    aria-label="Intentar nuevamente"
                  >
                    Intentar nuevamente
                  </button>
                </>
              )}
            </footer>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Recover;