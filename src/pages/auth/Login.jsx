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

// Esquema de validación para el formulario de inicio de sesión
const esquemaInicioSesion = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

/**
 * Página de inicio de sesión de usuarios
 * Permite a usuarios registrados acceder a la plataforma
 */
const InicioSesion = () => {
  const navegar = useNavigate();
  const { iniciarSesion, cargandoAutenticacion, error, limpiarError, usuarioAutenticado } = useAuth();

  // Redirigir al dashboard si el usuario ya está autenticado
  useEffect(() => {
    if (usuarioAutenticado) {
      navegar('/dashboard', { replace: true });
    }
  }, [usuarioAutenticado, navegar]);

  // Configuración del formulario con react-hook-form y validación Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(esquemaInicioSesion),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Limpiar mensajes de error al cargar la página
  useEffect(() => {
    limpiarError();
  }, [limpiarError]);

  // Manejar el envío del formulario de inicio de sesión
  const manejarEnvioFormularioInicioSesion = async (datosFormulario) => {
    const resultado = await iniciarSesion(datosFormulario);
    
    if (resultado.ok) {
      // Redirigir al dashboard después del inicio de sesión exitoso
      navegar('/dashboard', { replace: true });
    }
  };

  // Estado de carga durante el envío del formulario
  const estaEnviando = cargandoAutenticacion || isSubmitting;

  return (
    <Layout showFooter={false}>
      <main className={styles.paginaInicioSesion}>
        <div className={styles.contenedor}>
          <div className={styles.tarjetaInicioSesion}>
            {/* Encabezado de la página */}
            <header className={styles.encabezado}>
              <h1 className={styles.titulo}>Iniciar sesión</h1>
              <p className={styles.subtitulo}>
                Accede a tu cuenta de SmartStocker
              </p>
            </header>

            {/* Formulario de inicio de sesión */}
            <form onSubmit={handleSubmit(manejarEnvioFormularioInicioSesion)} className={styles.formulario} noValidate>
              {/* Mensaje de error general */}
              {error && (
                <ErrorMessage 
                  message={error}
                  className={styles.mensajeError}
                />
              )}

              {/* Campo de email */}
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

              {/* Campo de contraseña */}
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

              {/* Botón para enviar el formulario */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={estaEnviando}
                className={styles.botonEnvio}
              >
                {estaEnviando ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>

            {/* Enlaces de navegación adicionales */}
            <footer className={styles.pieFormulario}>
              <Link 
                to="/recuperar" 
                className={styles.enlace}
                aria-label="Recuperar contraseña olvidada"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              
              <div className={styles.separador}>
                <span>¿No tienes cuenta?</span>
              </div>
              
              <Link 
                to="/registro" 
                className={styles.enlaceRegistro}
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
