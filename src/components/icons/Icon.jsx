import React from 'react';
import { 
  Brain, 
  TrendingUp, 
  Package, 
  Clock, 
  BarChart3, 
  Shield,
  HelpCircle 
} from 'lucide-react';

/**
 * Mapa de nombres de íconos a componentes de lucide-react
 */
const iconMap = {
  brain: Brain,
  'trending-up': TrendingUp,
  inventory: Package,
  clock: Clock,
  chart: BarChart3,
  shield: Shield,
};

/**
 * Componente wrapper para íconos de lucide-react
 * Proporciona una interfaz consistente y fallback para íconos faltantes
 */
const Icon = ({ 
  name, 
  size = 24, 
  color = 'currentColor', 
  strokeWidth = 2,
  ...props 
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap. Using fallback.`);
    return (
      <HelpCircle 
        size={size} 
        color={color} 
        strokeWidth={strokeWidth}
        {...props} 
      />
    );
  }

  return (
    <IconComponent 
      size={size} 
      color={color} 
      strokeWidth={strokeWidth}
      {...props} 
    />
  );
};

export default Icon;