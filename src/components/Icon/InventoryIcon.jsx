import React from 'react';
import { Package } from 'lucide-react';

/**
 * Componente de compatibilidad para InventoryIcon
 * Mantiene la API anterior mientras usa lucide-react internamente
 */
const InventoryIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return <Package size={size} color={color} strokeWidth={2} {...props} />;
};

export default InventoryIcon;