import React from 'react';
import Layout from '../components/layout/Layout';

/**
 * Página de inicio de sesión (placeholder)
 */
const Login = () => {
  return (
    <Layout showFooter={false}>
      <main className="login-page">
        <section className="login-container">
          <h1>
            Iniciar sesión
          </h1>
          <p>
            Esta página será implementada en la próxima iteración
          </p>
          <div className="placeholder-content">
            Formulario de login próximamente...
          </div>
        </section>
      </main>
      <style jsx>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 4rem);
          padding: 2rem;
        }
        
        .login-container {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        
        .login-container h1 {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 1rem;
        }
        
        .login-container p {
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
        }
        
        .placeholder-content {
          padding: 1rem;
          background-color: var(--color-background-accent);
          border-radius: 8px;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }
      `}</style>
    </Layout>
  );
};

export default Login;