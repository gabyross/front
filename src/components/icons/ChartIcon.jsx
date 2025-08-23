import React from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * Componente de compatibilidad para ChartIcon
 * Mantiene la API anterior mientras usa lucide-react internamente
 */
const ChartIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return <BarChart3 size={size} color={color} strokeWidth={2} {...props} />;
};

export default ChartIcon;