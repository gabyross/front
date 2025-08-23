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

// Esquema de validación para el formulario de registro de usuario
const esquemaRegistro = z.object({
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
 * Página de registro de nuevos usuarios
 * Permite crear cuentas nuevas en la plataforma
 */
const Registro = () => {
  const navegar = useNavigate();
  const { registrarUsuario, cargandoAutenticacion, error, limpiarError, usuarioAutenticado } = useAuth();
  const [registroExitoso, setRegistroExitoso] = useState(false);

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
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(esquemaRegistro),
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Limpiar mensajes de error al cargar la página
  useEffect(() => {
    limpiarError();
    setRegistroExitoso(false);
  }, [limpiarError]);

  // Manejar el envío del formulario de registro
  const manejarEnvioFormularioRegistro = async (datosFormulario) => {
    setRegistroExitoso(false);
    
    // Extraer datos del formulario sin la confirmación de contraseña
    const { confirmPassword, ...datosUsuario } = datosFormulario;
    const resultado = await registrarUsuario(datosUsuario);
    
    if (resultado.ok) {
      setRegistroExitoso(true);
      reset();
      // Redirigir automáticamente al login después de 3 segundos
      setTimeout(() => {
        navegar('/login');
      }, 3000);
    }
  };

  // Estado de carga durante el envío del formulario
  const estaEnviando = cargandoAutenticacion || isSubmitting;

  return (
    <Layout showFooter={false}>
      <main className={styles.paginaRegistro}>
        <div className={styles.contenedor}>
          <div className={styles.tarjetaRegistro}>
            {/* Encabezado de la página */}
            <header className={styles.encabezado}>
              <h1 className={styles.titulo}>Crear cuenta</h1>
              <p className={styles.subtitulo}>
                Únete a SmartStocker y optimiza tu restaurante
              </p>
            </header>

            {/* Mensaje de registro exitoso */}
            {registroExitoso && (
              <SuccessMessage 
                title="¡Cuenta creada exitosamente!"
                message="Ahora puedes iniciar sesión con tus credenciales. Te redirigiremos automáticamente..."
                className={styles.mensajeExito}
              />
            )}

            {/* Formulario de registro */}
            {!registroExitoso && (
              <form onSubmit={handleSubmit(manejarEnvioFormularioRegistro)} className={styles.formulario} noValidate>
                {/* Mensaje de error general */}
                {error && (
                  <ErrorMessage 
                    message={error}
                    className={styles.mensajeError}
                  />
                )}

                {/* Campo de nombre completo */}
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
                  placeholder="Crea una contraseña segura"
                  icon={Lock}
                  error={errors.password?.message}
                  disabled={estaEnviando}
                  required
                  {...register('password')}
                />

                {/* Campo de confirmación de contraseña */}
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

                {/* Botón para enviar el formulario */}
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={estaEnviando}
                  className={styles.botonEnvio}
                >
                  {estaEnviando ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </form>
            )}

            {/* Enlaces de navegación adicionales */}
            <footer className={styles.pieFormulario}>
              <div className={styles.separador}>
                <span>¿Ya tienes cuenta?</span>
              </div>
              
              <Link 
                to="/login" 
                className={styles.enlaceInicioSesion}
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
