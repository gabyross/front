import React from 'react';
import { TrendingUp } from 'lucide-react';

/**
 * Componente de compatibilidad para TrendingUpIcon
 * Mantiene la API anterior mientras usa lucide-react internamente
 */
const TrendingUpIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return <TrendingUp size={size} color={color} strokeWidth={2} {...props} />;
};

export default TrendingUpIcon;