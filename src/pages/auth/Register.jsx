import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/layout/Layout';
import { TextField, PasswordField } from '../../components/forms';
import { ErrorMessage, SuccessMessage } from '../../components/feedback';
import Button from '../../components/common/Button';
import styles from './Register.module.css';

// Esquema de validación para el formulario de registro
const registerSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre no puede exceder 60 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'La contraseña debe contener al menos una letra y un número'),
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

/**
 * Página de registro de usuario
 */
const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, clearError, isAuthenticated } = useAuth();
  const [registroExitoso, setRegistroExitoso] = useState(false);

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
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
    setRegistroExitoso(false);
  }, [clearError]);

  // Manejar envío del formulario de registro
  const manejarEnvioFormularioRegistro = async (datosFormulario) => {
    setRegistroExitoso(false);
    
    // Extraer datos sin la confirmación de contraseña
    const { confirmPassword, ...datosUsuario } = datosFormulario;
    const resultado = await registerUser(datosUsuario);
    
    if (resultado.ok) {
      setRegistroExitoso(true);
      reset();
      // Redirigir automáticamente a login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
  };

  const estaEnviando = loading || isSubmitting;

  return (
    <Layout showFooter={false}>
      <main className={styles.registerPage}>
        <div className={styles.container}>
          <div className={styles.registerCard}>
            {/* Header */}
            <header className={styles.header}>
              <h1 className={styles.title}>Crear cuenta</h1>
              <p className={styles.subtitle}>
                Únete a SmartStocker y optimiza tu restaurante
              </p>
            </header>

            {/* Mensaje de éxito */}
            {registroExitoso && (
              <SuccessMessage 
                title="¡Cuenta creada exitosamente!"
                message="Ahora puedes iniciar sesión con tus credenciales. Te redirigiremos automáticamente..."
                className={styles.successMessage}
              />
            )}

            {/* Formulario */}
            {!registroExitoso && (
              <form onSubmit={handleSubmit(manejarEnvioFormularioRegistro)} className={styles.form} noValidate>
                {/* Mensaje de error global */}
                {error && (
                  <ErrorMessage 
                    message={error}
                    className={styles.errorMessage}
                  />
                )}

                {/* Campo Nombre */}
                <TextField
                  label="Nombre completo"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre completo"
                  icon={User}
                  error={errors.nombre?.message}
                  disabled={estaEnviando}
                  required
                  {...register('nombre')}
                />

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
                  placeholder="Crea una contraseña segura"
                  icon={Lock}
                  error={errors.password?.message}
                  disabled={estaEnviando}
                  required
                  {...register('password')}
                />

                {/* Campo Confirmar Contraseña */}
                <PasswordField
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  placeholder="Repite tu contraseña"
                  icon={Lock}
                  error={errors.confirmPassword?.message}
                  disabled={estaEnviando}
                  required
                  {...register('confirmPassword')}
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
                  {estaEnviando ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </form>
            )}

            {/* Enlaces adicionales */}
            <footer className={styles.footer}>
              <div className={styles.divider}>
                <span>¿Ya tienes cuenta?</span>
              </div>
              
              <Link 
                to="/login" 
                className={styles.loginLink}
                aria-label="Iniciar sesión con cuenta existente"
              >
                Iniciar sesión
              </Link>
            </footer>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Register;