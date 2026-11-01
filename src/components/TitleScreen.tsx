import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Volume2, VolumeX, Swords } from 'lucide-react';
import { sound } from '../utils/audio';
import { GameButton } from './GameButton';

interface TitleScreenProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSpriteLab?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  isMuted,
  onToggleMute,
  onOpenSpriteLab,
}) => {
  return (
    <div
      onClick={() => {
        sound.playSummonCharge();
        onStart();
      }}
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-between cursor-pointer select-none bg-radial from-slate-900 via-indigo-950 to-black"
    >
      {/* Background Animated Energy and Ki FX */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      {/* Top Bar with sound toggle and version info */}
      <div className="w-full max-w-4xl px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-500/30 text-xs font-semibold tracking-wider text-yellow-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>VERSIÓN 1.0.0</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="p-2 rounded-full bg-black/60 border border-slate-700 hover:border-yellow-500/60 text-slate-300 hover:text-yellow-400 transition-colors z-30"
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Hero & Logo Section */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center z-10 px-4 max-w-md w-full"
      >
        <div className="relative group">
          {/* Subtle glow behind logo */}
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/30 via-orange-500/20 to-yellow-500/30 blur-2xl rounded-3xl opacity-75 group-hover:opacity-100 transition-opacity" />
          <img
            src="/assets/aistudio/Pantalla_de_titulo_dd788d30.png"
            alt="Lore Ball Legends Logo"
            className="relative w-full max-w-sm sm:max-w-md drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] transform hover:scale-[1.02] transition-transform duration-300"
          />
        </div>

        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            Simulador de Invocaciones DB Legends
          </div>
        </div>
      </motion.div>

      {/* Bottom Start Prompt Button */}
      <motion.div
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="z-20 pb-12 flex flex-col items-center gap-3"
      >
        <GameButton
          variant="Universalbutton"
          size="xl"
          animatePulse={true}
          className="w-72 sm:w-84 h-[68px] sm:h-[74px]"
        >
          <span className="text-black font-black text-base sm:text-lg tracking-widest drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
            TOCA PARA COMENZAR
          </span>
        </GameButton>
        {onOpenSpriteLab && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onOpenSpriteLab();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/40 text-xs font-bold font-mono uppercase tracking-wider transition cursor-pointer shadow hover:scale-105"
            title="Abrir Laboratorio de Sprites Dokkan Battle"
          >
            <Swords className="w-3.5 h-3.5 text-amber-400" />
            <span>[ Laboratorio de Sprites Dokkan (Preview) ]</span>
          </button>
        )}
        <p className="text-xs text-slate-400 font-mono tracking-wider">
          © BIRD STUDIO / SHUEISHA / BANDAI NAMCO SIMULATOR TRIBUTE
        </p>
      </motion.div>
    </div>
  );
};
