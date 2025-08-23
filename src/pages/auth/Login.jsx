import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { TextField, PasswordField } from '../../components/forms';
import { ErrorMessage } from '../../components/feedback';
import Button from '../../components/common/Button';
import styles from './Login.module.css';

// Schema de validación con Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

/**
 * Página de inicio de sesión
 */
const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useAuth();

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
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Manejar envío del formulario
  const onSubmit = async (data) => {
    const result = await login(data);
    
    if (result.ok) {
      navigate('/', { replace: true });
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <Layout showFooter={false}>
      <main className={styles.loginPage}>
        <div className={styles.container}>
          <div className={styles.loginCard}>
            {/* Header */}
            <header className={styles.header}>
              <h1 className={styles.title}>Iniciar sesión</h1>
              <p className={styles.subtitle}>
                Accede a tu cuenta de SmartStocker
              </p>
            </header>

            {/* Formulario */}
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

              {/* Campo Contraseña */}
              <PasswordField
                label="Contraseña"
                name="password"
                placeholder="Ingresa tu contraseña"
                icon={Lock}
                error={errors.password?.message}
                disabled={isLoading}
                required
                {...register('password')}
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
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            {/* Enlaces adicionales */}
            <footer className={styles.footer}>
              <Link 
                to="/recuperar" 
                className={styles.link}
                aria-label="Recuperar contraseña olvidada"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              
              <div className={styles.divider}>
                <span>¿No tienes cuenta?</span>
              </div>
              
              <Link 
                to="/registro" 
                className={styles.registerLink}
                aria-label="Crear nueva cuenta"
              >
                Crear cuenta
              </Link>
            </footer>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Login;