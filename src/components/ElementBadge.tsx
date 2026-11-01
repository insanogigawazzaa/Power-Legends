import React from 'react';
import { ElementType } from '../types';

interface ElementBadgeProps {
  element: ElementType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export const ELEMENT_ASSETS: Record<
  ElementType,
  {
    image: string;
    label: string;
    spanish: string;
    textColor: string;
    glowColor: string;
  }
> = {
  RED: {
    image: '/assets/aistudio/EojHhfCUYAYDsN-_cb159659.png',
    label: 'RED',
    spanish: 'Rojo',
    textColor: 'text-red-400',
    glowColor: 'rgba(239, 68, 68, 0.7)',
  },
  YEL: {
    image: '/assets/aistudio/EojHhfIUYAEtENX_91dbc948.png',
    label: 'YEL',
    spanish: 'Amarillo',
    textColor: 'text-yellow-400',
    glowColor: 'rgba(234, 179, 8, 0.7)',
  },
  PUR: {
    image: '/assets/aistudio/EojHhfBU8AImpYN_0aa6a8b8.png',
    label: 'PUR',
    spanish: 'Púrpura',
    textColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.7)',
  },
  GRN: {
    image: '/assets/aistudio/EojHhfBUwAYglmZ_5af004d6.png',
    label: 'GRN',
    spanish: 'Verde',
    textColor: 'text-green-400',
    glowColor: 'rgba(34, 197, 94, 0.7)',
  },
  BLU: {
    image: '/assets/aistudio/EojHsE-VgAAxhkP_9f48d318.png',
    label: 'BLU',
    spanish: 'Azul',
    textColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.7)',
  },
};

export const ElementBadge: React.FC<ElementBadgeProps> = ({
  element,
  size = 'md',
  showLabel = true,
  className = '',
}) => {
  const config = ELEMENT_ASSETS[element] || ELEMENT_ASSETS.RED;

  const sizeClasses = {
    xs: {
      img: 'w-6 h-6 object-contain',
      container: showLabel ? 'px-1.5 py-0.5 text-[10px] gap-1' : 'p-0.5',
    },
    sm: {
      img: 'w-7 h-7 object-contain',
      container: showLabel ? 'px-2 py-0.5 text-xs gap-1.5' : 'p-1',
    },
    md: {
      img: 'w-8 h-8 object-contain',
      container: showLabel ? 'px-2.5 py-1 text-xs gap-2' : 'p-1',
    },
    lg: {
      img: 'w-10 h-10 object-contain',
      container: showLabel ? 'px-3 py-1 text-sm gap-2.5' : 'p-1.5',
    },
    xl: {
      img: 'w-12 h-12 object-contain',
      container: showLabel ? 'px-4 py-1.5 text-base gap-3' : 'p-2',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`inline-flex items-center rounded-lg bg-black/85 backdrop-blur-md border border-white/20 shadow-lg select-none font-['Rajdhani',sans-serif] ${currentSize.container} ${className}`}
      title={`Elemento: ${config.label} (${config.spanish})`}
      style={{
        boxShadow: `0 0 10px ${config.glowColor}`,
      }}
    >
      {/* Official Element Color Gem Icon */}
      <img
        src={config.image}
        alt={`Element ${config.label}`}
        className={`${currentSize.img} drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] shrink-0`}
      />

      {showLabel && (
        <span
          className={`font-black font-mono tracking-wider ${config.textColor} drop-shadow`}
        >
          {config.label}
        </span>
      )}
    </div>
  );
};
