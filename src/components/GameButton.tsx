import React from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';

export type GameButtonVariant = 'Universalbutton' | 'Singlesummon' | 'Multisummon' | 'Buttoncommon' | 'purple';

interface GameButtonProps {
  variant?: GameButtonVariant;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  animatePulse?: boolean;
}

const VARIANT_ASSETS: Record<GameButtonVariant, string> = {
  Universalbutton: '/assets/aistudio/Cmn_btnDecide56_0313916e.png',
  Singlesummon: '/assets/aistudio/Button Summon(Clean 2).png',
  Multisummon: '/assets/aistudio/Button Summon(Clean 2).png',
  Buttoncommon: '/assets/aistudio/Cmn_btnDecide56_0313916e.png',
  purple: '/assets/aistudio/Cmn_btnDecide56_0313916e.png',
};

const VARIANT_GLOW: Record<GameButtonVariant, string> = {
  Universalbutton: 'group-hover:drop-shadow-[0_0_14px_rgba(234,179,8,0.75)]',
  Singlesummon: 'group-hover:drop-shadow-[0_0_14px_rgba(239,68,68,0.8)]',
  Multisummon: 'group-hover:drop-shadow-[0_0_14px_rgba(34,197,94,0.8)]',
  Buttoncommon: 'group-hover:drop-shadow-[0_0_14px_rgba(59,130,246,0.8)]',
  purple: 'group-hover:drop-shadow-[0_0_14px_rgba(168,85,247,0.8)]',
};

const SIZE_STYLES: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', { container: string; text: string }> = {
  xs: {
    container: 'min-w-[120px] h-[38px]',
    text: 'text-[11px] font-black px-2.5',
  },
  sm: {
    container: 'min-w-[150px] h-[48px]',
    text: 'text-xs font-black px-3.5',
  },
  md: {
    container: 'min-w-[190px] h-[56px]',
    text: 'text-sm font-black px-4',
  },
  lg: {
    container: 'min-w-[230px] h-[72px]',
    text: 'text-base font-black px-5',
  },
  xl: {
    container: 'min-w-[270px] h-[80px]',
    text: 'text-lg font-black px-6',
  },
};

export const GameButton: React.FC<GameButtonProps> = ({
  variant = 'Universalbutton',
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  children,
  title,
  type = 'button',
  animatePulse = false,
}) => {
  const asset = VARIANT_ASSETS[variant] || VARIANT_ASSETS.Universalbutton;
  const glow = VARIANT_GLOW[variant] || VARIANT_GLOW.Universalbutton;
  const sizeConfig = SIZE_STYLES[size];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    sound.playClick();
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      type={type}
      title={title}
      disabled={disabled}
      onClick={handleClick}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={`relative group inline-flex items-center justify-center select-none cursor-pointer font-['Rajdhani',sans-serif] ${sizeConfig.container} ${
        disabled
          ? 'opacity-50 grayscale cursor-not-allowed'
          : 'active:scale-95'
      } ${className}`}
    >
      {/* Background Graphic Asset - Stylized to fit the button dimensions */}
      <img
        src={asset}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-fill drop-shadow-md transition-all duration-200 pointer-events-none ${glow} ${
          animatePulse && !disabled ? 'animate-pulse' : ''
        }`}
      />

      {/* Button Content Overlay */}
      <div
        className={`relative z-10 flex items-center justify-center text-center uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] ${sizeConfig.text}`}
      >
        {children}
      </div>
    </motion.button>
  );
};
