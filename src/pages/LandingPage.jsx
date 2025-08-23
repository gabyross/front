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
 * Página de inicio de SmartStocker con información del producto y beneficios
 * Presenta la propuesta de valor y guía al usuario hacia el registro
 */
const PaginaInicio = () => {
  // Beneficios principales de la plataforma
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

  // Pasos del proceso de uso de la plataforma
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

  // Testimonios de clientes (datos de ejemplo)
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

  // Función para desplazamiento suave a secciones de la página
  const desplazarseASeccion = (idSeccion) => {
    const elemento = document.getElementById(idSeccion);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <div className={styles.paginaInicio}>
        {/* Sección principal de presentación */}
        <section className={styles.seccionPrincipal}>
          <div className={styles.contenidoPrincipal}>
            <h1 className={styles.tituloPrincipal}>
              Predecí ventas y optimizá tu inventario con inteligencia artificial
            </h1>
            <p className={styles.subtituloPrincipal}>
              SmartStocker ayuda a restaurantes en CABA a tomar decisiones inteligentes, 
              reducir desperdicios y maximizar ganancias a través de predicciones precisas.
            </p>
            <div className={styles.botonesPrincipales}>
              <Button as={Link} to="/login" variant="primary" size="large">
                Iniciar sesión
              </Button>
              <Button 
                variant="secondary" 
                size="large"
                onClick={() => desplazarseASeccion('caracteristicas')}
              >
                Ver demo
              </Button>
            </div>
          </div>
        </section>

        {/* Sección de beneficios y características */}
        <section id="caracteristicas" className={`${styles.seccion} ${styles.beneficios}`}>
          <div className={styles.contenedorSeccion}>
            <h2 className={styles.tituloSeccion}>
              ¿Por qué elegir SmartStocker?
            </h2>
            <p className={styles.subtituloSeccion}>
              Descubrí cómo nuestra plataforma puede transformar la gestión de tu restaurante
            </p>
            
            <div className={styles.grillaBeneficios}>
              {beneficios.map((beneficio, index) => (
                <div key={index} className={styles.tarjetaBeneficio}>
                  <div className={styles.iconoBeneficio} aria-hidden="true">
                    {beneficio.icon}
                  </div>
                  <h3 className={styles.tituloBeneficio}>
                    {beneficio.title}
                  </h3>
                  <p className={styles.descripcionBeneficio}>
                    {beneficio.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección explicativa del proceso */}
        <section className={`${styles.seccion} ${styles.comoFunciona}`}>
          <div className={styles.contenedorSeccion}>
            <h2 className={styles.tituloSeccion}>
              ¿Cómo funciona?
            </h2>
            <p className={styles.subtituloSeccion}>
              En solo 3 pasos simples, comenzá a optimizar tu restaurante
            </p>
            
            <div className={styles.grillaPasos}>
              {pasos.map((paso, index) => (
                <div key={index} className={styles.paso}>
                  <div className={styles.numeroPaso} aria-hidden="true">
                    {paso.numero}
                  </div>
                  <h3 className={styles.tituloPaso}>
                    {paso.title}
                  </h3>
                  <p className={styles.descripcionPaso}>
                    {paso.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de testimonios de clientes */}
        <section className={`${styles.seccion} ${styles.testimonios}`}>
          <div className={styles.contenedorSeccion}>
            <h2 className={styles.tituloSeccion}>
              Lo que dicen nuestros clientes
            </h2>
            <p className={styles.subtituloSeccion}>
              Restaurantes en CABA ya están optimizando sus operaciones con SmartStocker
            </p>
            
            <div className={styles.grillaTestimonios}>
              {testimonios.map((testimonio, index) => (
                <div key={index} className={styles.tarjetaTestimonio}>
                  <p className={styles.textoTestimonio}>
                    "{testimonio.texto}"
                  </p>
                  <div className={styles.autorTestimonio}>
                    <div className={styles.avatarTestimonio} aria-hidden="true">
                      {testimonio.avatar}
                    </div>
                    <div className={styles.informacionTestimonio}>
                      <h4>{testimonio.autor}</h4>
                      <p>{testimonio.restaurante}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Llamada a la acción final */}
        <section className={`${styles.seccion} ${styles.llamadaAccionFinal}`}>
          <div className={styles.contenidoLlamadaAccion}>
            <h2 className={styles.tituloLlamadaAccion}>
              ¿Listo para optimizar tu restaurante?
            </h2>
            <p className={styles.subtituloLlamadaAccion}>
              Únete a los restaurantes que ya están maximizando sus ganancias con SmartStocker
            </p>
            <Link to="/login" className={styles.botonLlamadaAccion} aria-label="Empezar a usar SmartStocker ahora">
              Empezar ahora
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};
