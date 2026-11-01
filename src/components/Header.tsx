import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Coins,
  Volume2,
  VolumeX,
  RotateCcw,
  Home,
  User,
  AlertCircle,
  X,
  Swords,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { GameButton } from './GameButton';

export type TabType = 'crystals' | 'banners' | 'characters' | 'profile';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  chronoCrystals: number;
  totalCharactersCount: number;
  username: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onResetData: () => void;
  onReturnTitle: () => void;
  onOpenSpriteLab?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  chronoCrystals,
  totalCharactersCount,
  username,
  isMuted,
  onToggleMute,
  onResetData,
  onReturnTitle,
  onOpenSpriteLab,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-yellow-500/30 shadow-lg">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Game Mini Branding & Home */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onReturnTitle();
            }}
            className="flex items-center gap-2 group p-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-yellow-500/40 transition-all cursor-pointer"
            title="Volver a la pantalla de inicio"
          >
            <div className="w-8 h-8 rounded-md overflow-hidden bg-black flex items-center justify-center border border-yellow-500/50 shadow-inner">
              <Home className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left hidden xs:block">
              <span className="block text-xs uppercase tracking-widest text-yellow-400 font-extrabold leading-tight">
                Lore Ball
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-none">
                LEGENDS
              </span>
            </div>
          </button>
        </div>

        {/* Chrono Crystals Counter (Centrally highlighted) */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 px-3.5 py-1.5 rounded-full border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <img
            src="/assets/aistudio/Ec9tFq8UwAA6TcM_e688483e.png"
            alt="Cronocristal"
            className="w-6 h-6 object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] animate-pulse"
          />
          <div className="flex flex-col">
            <span className="text-[10px] leading-none text-cyan-300 font-bold tracking-wider uppercase">
              Cronocristales
            </span>
            <span className="text-lg leading-none font-black text-white font-mono tracking-wide tabular-nums">
              {chronoCrystals.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right side controls: Dokkan Lab Trigger, Profile Shortcut, Sound & Reset */}
        <div className="flex items-center gap-2">
          {/* Dokkan Sprites Laboratory Preview Modal Trigger */}
          {onOpenSpriteLab && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenSpriteLab();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 hover:from-amber-500 hover:to-red-500 border border-amber-300 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.5)] transition hover:scale-105 active:scale-95 cursor-pointer"
              title="Abrir Laboratorio de Sprites (Vista previa conceptual Dokkan Battle)"
            >
              <Swords className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>LAB SPRITES</span>
            </button>
          )}

          {/* Quick Profile Tab shortcut */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectTab('profile');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase transition-all cursor-pointer ${
              currentTab === 'profile'
                ? 'bg-yellow-500 text-black border-yellow-300 shadow font-black'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-yellow-500/60 hover:text-white'
            }`}
            title="Ver tu perfil y estadísticas"
          >
            <User className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="hidden sm:inline truncate max-w-[100px]">{username}</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-full bg-slate-900 border border-slate-700 hover:border-yellow-500/60 text-slate-300 hover:text-yellow-400 transition-colors cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="p-2 rounded-full bg-slate-900 border border-slate-700 hover:border-red-500/60 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Reiniciar datos iniciales"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation (Includes 'profile' tab) */}
      <nav className="max-w-4xl mx-auto px-2 sm:px-6 pb-2 pt-1 flex items-center justify-center gap-1.5 sm:gap-3">
        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('crystals');
          }}
          className={`flex-1 max-w-[160px] flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
            currentTab === 'crystals'
              ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(160,185,129,0.5)] scale-[1.02]'
              : 'bg-slate-900/80 text-emerald-400 border-emerald-900/60 hover:bg-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <Coins className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>Obtener CC</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('banners');
          }}
          className={`flex-1 max-w-[160px] flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
            currentTab === 'banners'
              ? 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-[1.02]'
              : 'bg-slate-900/80 text-yellow-400 border-yellow-900/60 hover:bg-slate-800 hover:border-yellow-500/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>Banners</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('characters');
          }}
          className={`flex-1 max-w-[160px] flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
            currentTab === 'characters'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-[1.02]'
              : 'bg-slate-900/80 text-purple-300 border-purple-900/60 hover:bg-slate-800 hover:border-purple-500/40'
          }`}
        >
          <Users className="w-4 h-4 text-purple-400 shrink-0" />
          <span>Guerreros ({totalCharactersCount})</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onSelectTab('profile');
          }}
          className={`flex-1 max-w-[160px] flex items-center justify-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
            currentTab === 'profile'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-[1.02]'
              : 'bg-slate-900/80 text-cyan-300 border-cyan-900/60 hover:bg-slate-800 hover:border-cyan-500/40'
          }`}
        >
          <User className="w-4 h-4 text-cyan-300 shrink-0" />
          <span>Mi Perfil</span>
        </button>
      </nav>

      {/* In-App Reset Confirmation Modal (NO window.confirm) */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500 rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">
              ¿Reiniciar datos del simulador?
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Se restablecerá tu saldo a los 2,500 CC iniciales y se reiniciará tu colección e historial de invocaciones.
            </p>
            <div className="flex items-center justify-center gap-3">
              <GameButton
                variant="Universalbutton"
                size="sm"
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="w-36 h-[44px]"
              >
                <span className="text-black font-black text-xs">
                  SÍ, REINICIAR
                </span>
              </GameButton>
              <GameButton
                variant="Buttoncommon"
                size="sm"
                onClick={() => setShowResetConfirm(false)}
                className="w-32 h-[44px]"
              >
                <span className="text-black font-black text-xs">
                  CANCELAR
                </span>
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
