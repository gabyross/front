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

// Esquema de validación para el formulario de recuperación de contraseña
const esquemaRecuperacion = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
});

/**
 * Página de recuperación de contraseña olvidada
 * Permite a usuarios solicitar instrucciones para restablecer su contraseña
 */
const Recuperacion = () => {
  const navegar = useNavigate();
  const { solicitarRecuperacionContrasena, cargandoAutenticacion, error, limpiarError, usuarioAutenticado } = useAuth();
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

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
    resolver: zodResolver(esquemaRecuperacion),
    defaultValues: {
      email: ''
    }
  });

  // Limpiar mensajes de error al cargar la página
  useEffect(() => {
    limpiarError();
    setSolicitudEnviada(false);
  }, [limpiarError]);

  // Manejar el envío del formulario de recuperación de contraseña
  const manejarEnvioFormularioRecuperacion = async (datosFormulario) => {
    setSolicitudEnviada(false);
    
    const resultado = await solicitarRecuperacionContrasena(datosFormulario.email);
    
    if (resultado.ok) {
      setSolicitudEnviada(true);
      reset();
    }
  };

  // Estado de carga durante el envío del formulario
  const estaEnviando = cargandoAutenticacion || isSubmitting;

  return (
    <Layout showFooter={false}>
      <main className={styles.paginaRecuperacion}>
        <div className={styles.contenedor}>
          <div className={styles.tarjetaRecuperacion}>
            {/* Encabezado de la página */}
            <header className={styles.encabezado}>
              <h1 className={styles.titulo}>Recuperar contraseña</h1>
              <p className={styles.subtitulo}>
                Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
              </p>
            </header>

            {/* Mensaje de solicitud enviada exitosamente */}
            {solicitudEnviada && (
              <SuccessMessage 
                title="Instrucciones enviadas"
                message="Si el email está registrado en nuestro sistema, recibirás instrucciones para recuperar tu contraseña en los próximos minutos."
                className={styles.mensajeExito}
              />
            )}

            {/* Formulario de recuperación */}
            {!solicitudEnviada && (
              <form onSubmit={handleSubmit(manejarEnvioFormularioRecuperacion)} className={styles.formulario} noValidate>
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

                {/* Botón para enviar el formulario */}
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={estaEnviando}
                  className={styles.botonEnvio}
                >
                  {estaEnviando ? 'Enviando instrucciones...' : 'Enviar instrucciones'}
                </Button>
              </form>
            )}

            {/* Enlaces de navegación adicionales */}
            <footer className={styles.pieFormulario}>
              <Link 
                to="/login" 
                className={styles.enlaceRegreso}
                aria-label="Volver a iniciar sesión"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Volver a iniciar sesión
              </Link>
              
              {/* Opciones adicionales cuando la solicitud fue enviada */}
              {solicitudEnviada && (
                <>
                  <div className={styles.separador}>
                    <span>¿No recibiste el email?</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setSolicitudEnviada(false)}
                    className={styles.botonReintentar}
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


export default Recuperacion