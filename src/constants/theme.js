// Design tokens para SmartStocker
export const colors = {
  // Colores principales
  primary: '#1E40AF',      // Azul corporativo
  primaryLight: '#3B82F6', // Azul claro
  primaryDark: '#1E3A8A',  // Azul oscuro
  
  // Colores secundarios
  success: '#10B981',      // Verde éxito
  warning: '#F59E0B',      // Naranja advertencia
  error: '#EF4444',        // Rojo crítico
  
  // Colores de apoyo
  textPrimary: '#1F2937',   // Gris oscuro
  textSecondary: '#6B7280', // Gris medio
  textLight: '#9CA3AF',     // Gris claro
  background: '#FFFFFF',    // Blanco
  backgroundLight: '#F9FAFB', // Gris muy claro
  backgroundAccent: '#EFF6FF', // Azul muy claro
  border: '#E5E7EB',        // Borde gris
  borderLight: '#F3F4F6',   // Borde gris claro
};

export const typography = {
  fontFamily: {
    heading: '"Poppins", sans-serif',
    body: '"Roboto", sans-serif',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2rem',    // 32px
    '5xl': '2.5rem',  // 40px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
};

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px',
};