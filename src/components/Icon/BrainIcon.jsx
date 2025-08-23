import React from 'react';
import { Brain } from 'lucide-react';

/**
 * Componente de compatibilidad para BrainIcon
 * Mantiene la API anterior mientras usa lucide-react internamente
 */
const BrainIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return <Brain size={size} color={color} strokeWidth={2} {...props} />;
};

export default BrainIcon;