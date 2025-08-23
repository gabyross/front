import React from 'react';
import { Shield } from 'lucide-react';

/**
 * Componente de compatibilidad para ShieldIcon
 * Mantiene la API anterior mientras usa lucide-react internamente
 */
const ShieldIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return <Shield size={size} color={color} strokeWidth={2} {...props} />;
};

export default ShieldIcon;