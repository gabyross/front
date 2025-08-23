import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Esquema de validación para el formulario de recuperación
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
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  // Redirigir al dashboard si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Configuración del formulario con react-hook-form
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
    setSolicitudEnviada(false);
  }, [clearError]);

  // Manejar envío del formulario de recuperación
  const manejarEnvioFormularioRecuperacion = async (datosFormulario) => {
    setSolicitudEnviada(false);
    
    const resultado = await requestPasswordReset(datosFormulario.email);
    
    if (resultado.ok) {
      setSolicitudEnviada(true);
      reset();
    }
  };

  const estaEnviando = loading || isSubmitting;

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
            {solicitudEnviada && (
              <SuccessMessage 
                title="Instrucciones enviadas"
                message="Si el email está registrado en nuestro sistema, recibirás instrucciones para recuperar tu contraseña en los próximos minutos."
                className={styles.successMessage}
              />
            )}

            {/* Formulario */}
            {!solicitudEnviada && (
              <form onSubmit={handleSubmit(manejarEnvioFormularioRecuperacion)} className={styles.form} noValidate>
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
                  disabled={estaEnviando}
                  required
                  {...register('email')}
                />

                {/* Botón de envío */}
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={estaEnviando}
                  className={styles.submitButton}
                >
                  {estaEnviando ? 'Enviando instrucciones...' : 'Enviar instrucciones'}
                </Button>
              </form>
            )}

            {/* Enlaces adicionales */}
            <footer className={styles.footer}>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className={styles.backLink}
                aria-label="Volver a iniciar sesión"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Volver a iniciar sesión
              </button>
              
              {solicitudEnviada && (
                <>
                  <div className={styles.divider}>
                    <span>¿No recibiste el email?</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setSolicitudEnviada(false)}
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