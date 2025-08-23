import React from 'react';
import Layout from '../components/layout/Layout';

/**
 * Página de inicio de sesión (placeholder)
 */
const Login = () => {
  return (
    <Layout showFooter={false}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 4rem)',
        padding: '2rem' 
      }}>
        <div style={{
          background: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--color-text-primary)',
            marginBottom: '1rem'
          }}>
            Iniciar sesión
          </h1>
          <p style={{
            color: 'var(--color-text-secondary)',
            marginBottom: '2rem'
          }}>
            Esta página será implementada en la próxima iteración
          </p>
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--color-background-accent)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)'
          }}>
            Formulario de login próximamente...
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;