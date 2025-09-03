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

// Esquema de validación para el formulario de login
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

  // Manejar envío del formulario de login
  const manejarEnvioFormularioLogin = async (datosFormulario) => {
    const resultado = await login(datosFormulario);
    
    if (resultado.ok) {
      // Redirigir al dashboard después del login exitoso
      navigate('/dashboard', { replace: true });
    }
  };

  const estaEnviando = loading || isSubmitting;

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
            <form onSubmit={handleSubmit(manejarEnvioFormularioLogin)} className={styles.form} noValidate>
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

              {/* Campo Contraseña */}
              <PasswordField
                label="Contraseña"
                name="password"
                placeholder="Ingresa tu contraseña"
                icon={Lock}
                error={errors.password?.message}
                disabled={estaEnviando}
                required
                {...register('password')}
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
                {estaEnviando ? 'Iniciando sesión...' : 'Iniciar sesión'}
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