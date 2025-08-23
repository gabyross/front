import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ChartIcon from '../components/icons/ChartIcon';
import InventoryIcon from '../components/icons/InventoryIcon';
import BrainIcon from '../components/icons/BrainIcon';
import ClockIcon from '../components/icons/ClockIcon';
import TrendingUpIcon from '../components/icons/TrendingUpIcon';
import ShieldIcon from '../components/icons/ShieldIcon';
import styles from './LandingPage.module.css';

/**
 * Página principal de SmartStocker con información del producto y beneficios
 */
const LandingPage = () => {
  const beneficios = [
    {
      icon: <BrainIcon size={32} />,
      title: 'Predicción Inteligente',
      description: 'Algoritmos avanzados analizan tus datos históricos para predecir ventas futuras con alta precisión.'
    },
    {
      icon: <InventoryIcon size={32} />,
      title: 'Optimización de Inventario',
      description: 'Reduce desperdicios y costos manteniendo el stock óptimo basado en predicciones reales.'
    },
    {
      icon: <ChartIcon size={32} />,
      title: 'Análisis Detallado',
      description: 'Visualiza tendencias, patrones y métricas clave para tomar decisiones informadas.'
    },
    {
      icon: <ClockIcon size={32} />,
      title: 'Ahorro de Tiempo',
      description: 'Automatiza la planificación de compras y reduce el tiempo dedicado a gestión manual.'
    },
    {
      icon: <TrendingUpIcon size={32} />,
      title: 'Aumento de Rentabilidad',
      description: 'Maximiza ganancias reduciendo costos operativos y mejorando la eficiencia del negocio.'
    },
    {
      icon: <ShieldIcon size={32} />,
      title: 'Datos Seguros',
      description: 'Tu información está protegida con los más altos estándares de seguridad y privacidad.'
    }
  ];

  const pasos = [
    {
      numero: '1',
      title: 'Subí tus datos',
      description: 'Carga tu historial de ventas en formato CSV o Excel de manera simple y rápida.'
    },
    {
      numero: '2',
      title: 'Analizamos',
      description: 'Nuestros algoritmos procesan tu información y identifican patrones de comportamiento.'
    },
    {
      numero: '3',
      title: 'Recibí predicciones',
      description: 'Obtené predicciones precisas y recomendaciones para optimizar tu inventario.'
    }
  ];

  const testimonios = [
    {
      texto: 'SmartStocker revolucionó la gestión de nuestro restaurante. Redujimos desperdicios en un 40% y aumentamos la rentabilidad significativamente.',
      autor: 'María González',
      restaurante: 'La Parrilla Porteña',
      avatar: 'MG'
    },
    {
      texto: 'Las predicciones son increíblemente precisas. Ahora sabemos exactamente qué comprar y cuándo, sin quedarnos sin stock.',
      autor: 'Carlos Mendoza',
      restaurante: 'Café Central',
      avatar: 'CM'
    },
    {
      texto: 'La interfaz es muy intuitiva y los reportes nos ayudan a entender mejor nuestro negocio. Altamente recomendado.',
      autor: 'Ana Rodríguez',
      restaurante: 'Bistró Palermo',
      avatar: 'AR'
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className={styles.landingPage}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Predecí ventas y optimizá tu inventario con inteligencia artificial
            </h1>
            <p className={styles.heroSubtitle}>
              SmartStocker ayuda a restaurantes en CABA a tomar decisiones inteligentes, 
              reducir desperdicios y maximizar ganancias a través de predicciones precisas.
            </p>
            <div className={styles.heroButtons}>
              <Button as={Link} to="/login" variant="primary" size="large">
                Iniciar sesión
              </Button>
              <Button 
                variant="secondary" 
                size="large"
                onClick={() => scrollToSection('caracteristicas')}
              >
                Ver demo
              </Button>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section id="caracteristicas" className={`${styles.section} ${styles.beneficios}`}>
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>
              ¿Por qué elegir SmartStocker?
            </h2>
            <p className={styles.sectionSubtitle}>
              Descubrí cómo nuestra plataforma puede transformar la gestión de tu restaurante
            </p>
            
            <div className={styles.beneficiosGrid}>
              {beneficios.map((beneficio, index) => (
                <div key={index} className={styles.beneficioCard}>
                  <div className={styles.beneficioIcon} aria-hidden="true">
                    {beneficio.icon}
                  </div>
                  <h3 className={styles.beneficioTitle}>
                    {beneficio.title}
                  </h3>
                  <p className={styles.beneficioDescription}>
                    {beneficio.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className={`${styles.section} ${styles.comoFunciona}`}>
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>
              ¿Cómo funciona?
            </h2>
            <p className={styles.sectionSubtitle}>
              En solo 3 pasos simples, comenzá a optimizar tu restaurante
            </p>
            
            <div className={styles.pasosGrid}>
              {pasos.map((paso, index) => (
                <div key={index} className={styles.paso}>
                  <div className={styles.pasoNumero} aria-hidden="true">
                    {paso.numero}
                  </div>
                  <h3 className={styles.pasoTitle}>
                    {paso.title}
                  </h3>
                  <p className={styles.pasoDescription}>
                    {paso.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className={`${styles.section} ${styles.testimonios}`}>
          <div className={styles.sectionContainer}>
            <h2 className={styles.sectionTitle}>
              Lo que dicen nuestros clientes
            </h2>
            <p className={styles.sectionSubtitle}>
              Restaurantes en CABA ya están optimizando sus operaciones con SmartStocker
            </p>
            
            <div className={styles.testimoniosGrid}>
              {testimonios.map((testimonio, index) => (
                <div key={index} className={styles.testimonioCard}>
                  <p className={styles.testimonioTexto}>
                    "{testimonio.texto}"
                  </p>
                  <div className={styles.testimonioAutor}>
                    <div className={styles.testimonioAvatar} aria-hidden="true">
                      {testimonio.avatar}
                    </div>
                    <div className={styles.testimonioInfo}>
                      <h4>{testimonio.autor}</h4>
                      <p>{testimonio.restaurante}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className={`${styles.section} ${styles.ctaFinal}`}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              ¿Listo para optimizar tu restaurante?
            </h2>
            <p className={styles.ctaSubtitle}>
              Únete a los restaurantes que ya están maximizando sus ganancias con SmartStocker
            </p>
            <Link to="/login" className={styles.ctaButton} aria-label="Empezar a usar SmartStocker ahora">
              Empezar ahora
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default LandingPage;