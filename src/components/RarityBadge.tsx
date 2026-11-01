import React from 'react';
import { CharacterRarity } from '../types';

interface RarityBadgeProps {
  rarity: CharacterRarity;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const RARITY_ASSETS: Record<
  CharacterRarity,
  {
    image: string;
    label: string;
    tagBg: string;
    borderColor: string;
    shadowGlow: string;
    textColor: string;
  }
> = {
  HERO: {
    image: '/assets/aistudio/MChaIco_txtRarityHE_1a3cdef0.png',
    label: 'HERO',
    tagBg: 'from-blue-950 via-cyan-950 to-black',
    borderColor: 'border-blue-400/60',
    shadowGlow: 'rgba(59, 130, 246, 0.5)',
    textColor: 'text-cyan-300',
  },
  EXTREME: {
    image: '/assets/aistudio/MChaIco_txtRarityEX_96cacc07.png',
    label: 'EXTREME',
    tagBg: 'from-purple-950 via-purple-900 to-black',
    borderColor: 'border-purple-500/60',
    shadowGlow: 'rgba(168, 85, 247, 0.5)',
    textColor: 'text-purple-300',
  },
  SPARKING: {
    image: '/assets/aistudio/MChaIco_txtRaritySP_a14348fa.png',
    label: 'SPARKING',
    tagBg: 'from-amber-950 via-yellow-950 to-black',
    borderColor: 'border-amber-400/70',
    shadowGlow: 'rgba(245, 158, 11, 0.6)',
    textColor: 'text-amber-300',
  },
  LEGENDS_LIMITED: {
    image: '/assets/aistudio/Gas_txtLfinish_bc8a0524.png',
    label: 'LEGENDS LIMITED',
    tagBg: 'from-yellow-900 via-amber-950 to-black',
    borderColor: 'border-yellow-400',
    shadowGlow: 'rgba(234, 179, 8, 0.7)',
    textColor: 'text-yellow-300',
  },
};

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = 'md',
  showText = true,
  className = '',
}) => {
  const config = RARITY_ASSETS[rarity] || RARITY_ASSETS.SPARKING;

  const sizeClasses = {
    xs: {
      img: 'h-4 w-auto object-contain',
      container: 'px-1.5 py-0.5 text-[8px] gap-1',
    },
    sm: {
      img: 'h-5 w-auto object-contain',
      container: 'px-2 py-0.5 text-[9px] gap-1.5',
    },
    md: {
      img: 'h-6 sm:h-7 w-auto object-contain',
      container: 'px-2.5 py-1 text-xs gap-2',
    },
    lg: {
      img: 'h-8 sm:h-9 w-auto object-contain',
      container: 'px-3 py-1.5 text-sm gap-2.5',
    },
    xl: {
      img: 'h-10 sm:h-12 w-auto object-contain',
      container: 'px-4 py-2 text-base gap-3',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`inline-flex items-center rounded-lg bg-gradient-to-r ${config.tagBg} border ${config.borderColor} shadow-lg select-none font-['Rajdhani',sans-serif] ${currentSize.container} ${className}`}
      title={`Rareza: ${config.label}`}
      style={{
        boxShadow: `0 0 12px ${config.shadowGlow}`,
      }}
    >
      {/* Official Rarity Icon Image (EX, SP, or LF) */}
      <img
        src={config.image}
        alt={`Rarity ${config.label}`}
        className={`${currentSize.img} drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] shrink-0`}
      />

      {showText && size !== 'xs' && (
        <span
          className={`font-black uppercase tracking-wider ${config.textColor} drop-shadow whitespace-nowrap`}
        >
          {config.label}
        </span>
      )}
    </div>
  );
};
