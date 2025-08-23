import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Componente de compatibilidad para ClockIcon
 * Mantiene la API anterior mientras usa lucide-react internamente
 */
const ClockIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return <Clock size={size} color={color} strokeWidth={2} {...props} />;
};

export default ClockIcon;