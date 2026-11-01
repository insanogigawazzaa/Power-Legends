import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Info, Star, Zap, X, AlertTriangle } from 'lucide-react';
import {
  CHARACTERS,
  SUMMON_COST_SINGLE,
  SUMMON_COST_MULTI,
  STAR_THRESHOLDS,
} from '../data/characters';
import { Character } from '../types';
import { ElementBadge } from './ElementBadge';
import { RarityBadge } from './RarityBadge';
import { GameButton } from './GameButton';
import { sound } from '../utils/audio';

interface BannerViewProps {
  chronoCrystals: number;
  onSummon: (count: number) => void;
  onGoToGetCrystals: () => void;
  onInspectCharacter: (char: Character) => void;
}

export const BannerView: React.FC<BannerViewProps> = ({
  chronoCrystals,
  onSummon,
  onGoToGetCrystals,
  onInspectCharacter,
}) => {
  const [showRatesModal, setShowRatesModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canAffordSingle = chronoCrystals >= SUMMON_COST_SINGLE;
  const canAffordMulti = chronoCrystals >= SUMMON_COST_MULTI;

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    sound.playClick();
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const extremeChars = CHARACTERS.filter((c) => c.rarity === 'EXTREME');
  const sparkingChars = CHARACTERS.filter((c) => c.rarity === 'SPARKING');
  const legendsLimitedChars = CHARACTERS.filter((c) => c.rarity === 'LEGENDS_LIMITED');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 font-['Rajdhani',sans-serif]">
      {/* Toast Warning (No window.alert) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-red-300 flex items-center gap-3 font-bold text-sm"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-300 shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            BANNER OFICIAL DE PRUEBA
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wide flex items-center gap-2">
            Despertar de Guerreros
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Invocación individual: <span className="text-yellow-400 font-bold font-mono">100 CC</span> | Múltiple x10:{' '}
            <span className="text-yellow-400 font-bold font-mono">1,000 CC</span>
          </p>
        </div>

        {/* Rates & Z-Power Details Modal Button - Authentic Blue DBL Asset */}
        <GameButton
          variant="Buttoncommon"
          size="sm"
          onClick={() => {
            setShowRatesModal(true);
          }}
          className="w-56 sm:w-64 h-[48px] sm:h-[52px]"
        >
          <div className="flex items-center gap-2 text-white font-black text-xs">
            <Info className="w-4 h-4 text-cyan-200" />
            <span>PROBABILIDADES & Z-POWER</span>
          </div>
        </GameButton>
      </div>

      {/* Main Banner Visual Display Card */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-500/50 bg-gradient-to-b from-slate-900 via-indigo-950/60 to-black shadow-[0_0_40px_rgba(234,179,8,0.25)] mb-8">
        {/* Banner Top Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black px-4 py-1.5 flex items-center justify-between font-black uppercase tracking-widest text-xs">
          <span>★ LORE BALL LEGENDS - BANNER DE PRUEBA 1.2 ★</span>
          <span className="font-mono text-[11px] bg-black/25 px-2 py-0.5 rounded">PASO 1</span>
        </div>

        {/* Banner Graphic Canvas Showcase */}
        <div className="relative min-h-[320px] sm:min-h-[380px] flex flex-col justify-between p-6 overflow-hidden">
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 bg-radial from-amber-600/15 via-transparent to-black pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Featured Characters Artwork Showcase */}
          <div className="absolute right-0 bottom-0 top-0 w-full sm:w-2/3 pointer-events-none flex items-center justify-end overflow-hidden opacity-35 sm:opacity-90">
            <div className="relative w-full h-full flex items-center justify-end pr-4 gap-2">
              <motion.img
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 0.85, x: 0 }}
                transition={{ duration: 0.6 }}
                src="/assets/aistudio/LBL02LL-1_0e54550e.jpg"
                alt="Nick Kaioken x20"
                className="w-40 sm:w-52 h-[90%] object-cover object-top rounded-xl border border-red-500/40 shadow-2xl -rotate-3"
              />
              <motion.img
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                src="/assets/aistudio/LBL04LL-1_86dbb348.jpg"
                alt="Dino Super Saiyajin"
                className="w-44 sm:w-56 h-[95%] object-cover object-top rounded-xl border-2 border-yellow-400 shadow-2xl z-10 scale-105"
              />
              <motion.img
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 0.85, x: 0 }}
                transition={{ duration: 0.7 }}
                src="/assets/aistudio/LBL05LL-1_ef4843a6.jpg"
                alt="Arthicus"
                className="w-40 sm:w-52 h-[90%] object-cover object-top rounded-xl border border-purple-500/40 shadow-2xl rotate-3"
              />
            </div>
          </div>

          {/* Banner Left Info Content */}
          <div className="relative z-10 max-w-sm sm:max-w-md">
            <div className="inline-block px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-md mb-2 shadow-lg">
              ¡INCLUYE LEGENDS LIMITED!
            </div>
            <h3 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              LORE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400">
                ALL STARS
              </span>
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm mt-2 max-w-xs font-semibold drop-shadow-md">
              Obtén Z-Power para desbloquear personajes hasta <span className="text-red-400 font-bold">14 estrellas (7 estrellas rojas)</span> y 9,999 Z-Power.
            </p>

            {/* Droprate and Z-Power Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <div className="bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-purple-500/50 text-[11px] font-black text-purple-300">
                EXTREME (60%) • +250 Z-Power
              </div>
              <div className="bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-amber-500/50 text-[11px] font-black text-amber-300">
                SPARKING (35%) • +600 Z-Power
              </div>
              <div className="bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-yellow-400 text-[11px] font-black text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                ★ L. LIMITED (5%) • +600 Z-Power
              </div>
            </div>
          </div>

          {/* Featured Characters Mini Badges */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] uppercase font-bold text-slate-400 whitespace-nowrap">
              Guerreros Destacados:
            </span>
            {legendsLimitedChars.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sound.playClick();
                  onInspectCharacter(c);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-yellow-500/40 text-xs font-bold text-yellow-300 whitespace-nowrap transition-colors cursor-pointer"
              >
                <ElementBadge element={c.element} size="xs" showLabel={false} />
                <span>{c.fileTitle || c.name}</span>
                <span className="text-[9px] px-1 rounded bg-yellow-500/20 text-yellow-400 font-mono">
                  {c.code}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Summon Action Footer */}
        <div className="bg-slate-950 p-4 sm:p-6 border-t border-yellow-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
              Tu Saldo Disponible:
            </span>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <img
                src="/assets/aistudio/Ec9tFq8UwAA6TcM_e688483e.png"
                alt="Cronocristal"
                className="w-5 h-5 object-contain drop-shadow"
              />
              <span className="text-2xl font-black font-mono text-white tracking-wide">
                {chronoCrystals.toLocaleString()} CC
              </span>
            </div>
          </div>

          {/* Summon Buttons (100 CC & 1,000 CC) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            {/* Single Summon (100 CC) - Stylized Dimensions */}
            <GameButton
              variant="Singlesummon"
              size="lg"
              disabled={!canAffordSingle}
              onClick={() => {
                if (canAffordSingle) {
                  onSummon(1);
                } else {
                  showNotification('No tienes suficientes Cronocristales. ¡Pulsa Obtener Cronocristales para recargar!');
                }
              }}
              className="w-48 sm:w-56 h-[76px] sm:h-[84px]"
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-white font-black text-xs sm:text-sm tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  INVOCAR x1
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-yellow-300 flex items-center gap-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                  <img src="/assets/aistudio/Ec9tFq8UwAA6TcM_e688483e.png" className="w-4 h-4 object-contain" alt="" />
                  100 CC
                </span>
              </div>
            </GameButton>

            {/* Multi Summon (10x = 1,000 CC) - Stylized Dimensions */}
            <GameButton
              variant="Multisummon"
              size="lg"
              disabled={!canAffordMulti}
              onClick={() => {
                if (canAffordMulti) {
                  onSummon(10);
                } else {
                  showNotification('Necesitas 1,000 Cronocristales para una invocación consecutiva de 10 personajes.');
                }
              }}
              className="w-52 sm:w-60 h-[76px] sm:h-[84px]"
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-white font-black text-xs sm:text-sm tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  CONSECUTIVA x10
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-yellow-300 flex items-center gap-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">
                  <img src="/assets/aistudio/Ec9tFq8UwAA6TcM_e688483e.png" className="w-4 h-4 object-contain" alt="" />
                  1,000 CC
                </span>
              </div>
            </GameButton>

            {/* Quick recharge link - Stylized Dimensions */}
            {!canAffordSingle && (
              <GameButton
                variant="Universalbutton"
                size="md"
                onClick={() => {
                  onGoToGetCrystals();
                }}
                className="w-44 sm:w-48 h-[52px] sm:h-[56px]"
              >
                <div className="flex items-center gap-1.5 text-black font-black text-xs">
                  <Zap className="w-4 h-4 fill-black" />
                  <span>+ OBTENER CC</span>
                </div>
              </GameButton>
            )}
          </div>
        </div>
      </div>

      {/* RATES & Z-POWER DETAILS MODAL */}
      {showRatesModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-yellow-500 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black uppercase text-white tracking-wide">
                  Tasas de Dropeo y Sistema de Estrellas (Z-Power)
                </h3>
              </div>
              <button
                onClick={() => setShowRatesModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rates Table */}
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/50 flex flex-col items-center">
                  <RarityBadge rarity="EXTREME" size="md" showText={true} />
                  <span className="text-2xl font-black text-purple-200 mt-1">60%</span>
                  <span className="text-xs text-purple-300 font-bold block mt-1">+250 Z-Power</span>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/50 flex flex-col items-center">
                  <RarityBadge rarity="SPARKING" size="md" showText={true} />
                  <span className="text-2xl font-black text-amber-200 mt-1">35%</span>
                  <span className="text-xs text-amber-300 font-bold block mt-1">+600 Z-Power</span>
                </div>
                <div className="p-3.5 rounded-xl bg-yellow-950/60 border border-yellow-500 flex flex-col items-center">
                  <RarityBadge rarity="LEGENDS_LIMITED" size="md" showText={true} />
                  <span className="text-2xl font-black text-yellow-200 mt-1">5%</span>
                  <span className="text-xs text-yellow-300 font-bold block mt-1">+600 Z-Power</span>
                </div>
              </div>

              {/* Star Progression Scale Table (from user specification) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-black uppercase text-yellow-400 text-xs tracking-wider mb-3 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                  Tabla de Desbloqueo de Estrellas (Máximo 9,999 Z-Power / 14 Estrellas)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {STAR_THRESHOLDS.map((st) => (
                    <div
                      key={st.label}
                      className={`p-2 rounded-lg border flex items-center justify-between ${
                        st.isRed
                          ? 'bg-red-950/30 border-red-500/40 text-red-300'
                          : 'bg-slate-900 border-yellow-500/30 text-yellow-300'
                      }`}
                    >
                      <span className="font-black font-mono">{st.label}</span>
                      <span className="font-mono font-bold text-slate-300">{st.requiredZPower.toLocaleString()} ZP</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Characters Pool by Rarity */}
              <div>
                <h4 className="font-black uppercase text-yellow-400 text-xs tracking-wider mb-2 flex items-center gap-2">
                  <RarityBadge rarity="LEGENDS_LIMITED" size="xs" showText={true} />
                  <span>(5% - 6 Personajes)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {legendsLimitedChars.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setShowRatesModal(false);
                        onInspectCharacter(c);
                      }}
                      className="p-2 rounded-lg bg-slate-800/80 border border-yellow-500/30 flex items-center gap-2 cursor-pointer hover:bg-slate-700"
                    >
                      <img src={c.image} alt={c.name} className="w-9 h-9 rounded object-cover object-top" />
                      <div className="truncate flex-1">
                        <span className="block font-bold text-xs text-white truncate">{c.fileTitle || c.name}</span>
                        <div className="flex items-center gap-1">
                          <ElementBadge element={c.element} size="xs" showLabel={false} />
                          <span className="text-[10px] text-yellow-400 font-mono block">{c.code}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-black uppercase text-amber-400 text-xs tracking-wider mb-2 flex items-center gap-2">
                  <RarityBadge rarity="SPARKING" size="xs" showText={true} />
                  <span>(35% - 5 Personajes)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sparkingChars.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setShowRatesModal(false);
                        onInspectCharacter(c);
                      }}
                      className="p-2 rounded-lg bg-slate-800/80 border border-amber-500/30 flex items-center gap-2 cursor-pointer hover:bg-slate-700"
                    >
                      <img src={c.image} alt={c.name} className="w-9 h-9 rounded object-cover object-top" />
                      <div className="truncate flex-1">
                        <span className="block font-bold text-xs text-white truncate">{c.fileTitle || c.name}</span>
                        <div className="flex items-center gap-1">
                          <ElementBadge element={c.element} size="xs" showLabel={false} />
                          <span className="text-[10px] text-amber-400 font-mono block">{c.code}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-black uppercase text-purple-400 text-xs tracking-wider mb-2 flex items-center gap-2">
                  <RarityBadge rarity="EXTREME" size="xs" showText={true} />
                  <span>(60% - 4 Personajes)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {extremeChars.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setShowRatesModal(false);
                        onInspectCharacter(c);
                      }}
                      className="p-2 rounded-lg bg-slate-800/80 border border-purple-500/30 flex items-center gap-2 cursor-pointer hover:bg-slate-700"
                    >
                      <img src={c.image} alt={c.name} className="w-9 h-9 rounded object-cover object-top" />
                      <div className="truncate flex-1">
                        <span className="block font-bold text-xs text-white truncate">{c.fileTitle || c.name}</span>
                        <div className="flex items-center gap-1">
                          <ElementBadge element={c.element} size="xs" showLabel={false} />
                          <span className="text-[10px] text-purple-400 font-mono block">{c.code}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Modal Button - Universal DBL Asset */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-center">
                <GameButton
                  variant="Universalbutton"
                  size="md"
                  onClick={() => setShowRatesModal(false)}
                  className="w-52 sm:w-56 h-[50px] sm:h-[54px]"
                >
                  <span className="text-black font-black text-sm tracking-wider">
                    CERRAR DETALLES
                  </span>
                </GameButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
