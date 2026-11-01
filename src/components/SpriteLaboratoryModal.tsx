import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Zap,
  Flame,
  Swords,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  Info,
} from 'lucide-react';
import { DOKKAN_SPRITES, DokkanSpriteData } from '../data/dokkanSprites';
import { ElementBadge } from './ElementBadge';
import { RarityBadge } from './RarityBadge';
import { GameButton } from './GameButton';
import { sound } from '../utils/audio';

interface SpriteLaboratoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AnimationState = 'idle' | 'charging' | 'superAttack';
type AuraIntensity = 'off' | 'normal' | 'max';

export const SpriteLaboratoryModal: React.FC<SpriteLaboratoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [animState, setAnimState] = useState<AnimationState>('idle');
  const [auraLevel, setAuraLevel] = useState<AuraIntensity>('normal');
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [isSuperAttacking, setIsSuperAttacking] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentSprite: DokkanSpriteData = DOKKAN_SPRITES[selectedIndex];

  const handleSelectCharacter = (idx: number) => {
    sound.playClick();
    setSelectedIndex(idx);
    setAnimState('idle');
    setIsSuperAttacking(false);
  };

  const handleNext = () => {
    sound.playClick();
    setSelectedIndex((prev) => (prev + 1) % DOKKAN_SPRITES.length);
    setAnimState('idle');
    setIsSuperAttacking(false);
  };

  const handlePrev = () => {
    sound.playClick();
    setSelectedIndex((prev) => (prev - 1 + DOKKAN_SPRITES.length) % DOKKAN_SPRITES.length);
    setAnimState('idle');
    setIsSuperAttacking(false);
  };

  const triggerSuperAttack = () => {
    sound.playEnergyBlast();
    setIsSuperAttacking(true);
    setAnimState('superAttack');
    setTimeout(() => {
      setIsSuperAttacking(false);
      setAnimState('idle');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-['Rajdhani',sans-serif] select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl h-[92vh] max-h-[880px] bg-slate-950 border-2 border-amber-500/50 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg border border-amber-300/40">
              <Swords className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  Laboratorio de Desarrollo
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  VISTA PREVIA CONCEPTUAL DOKKAN
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                Sprites de Combate Chibi (Estilo Dokkan Battle)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setShowComparison(!showComparison);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition border cursor-pointer ${
                showComparison
                  ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)] font-black'
                  : 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-slate-800'
              }`}
              title="Comparar ilustración DB Legends con sprite Dokkan"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">
                {showComparison ? 'Ocultar Comparativa' : 'Comparativa DB Legends'}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
              title="Cerrar visor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-y-auto lg:overflow-hidden">
          {/* LEFT / CENTER: Dokkan Battle Arena Showcase (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-4 bg-gradient-to-b from-slate-950 via-slate-900/60 to-black relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
            {/* Dokkan Arena Background Decorator */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Dynamic Sky Gradient */}
              <div
                className="absolute inset-0 opacity-25 transition-colors duration-700"
                style={{
                  background: `radial-gradient(circle at 50% 30%, ${currentSprite.auraColors.primary} 0%, transparent 70%)`,
                }}
              />
              {/* Dokkan Speedlines during super attack */}
              {isSuperAttacking && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/80 animate-ping opacity-70" />
              )}
              {/* Crater Ground Texture */}
              <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent border-t border-amber-900/30" />
              <div className="absolute bottom-6 inset-x-12 h-16 rounded-[100%] bg-black/60 blur-md" />
            </div>

            {/* Character Header / Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded font-mono shadow ${
                    currentSprite.dokkanClass === 'SUPER'
                      ? 'bg-blue-600 text-white border border-blue-400'
                      : 'bg-red-700 text-white border border-red-500'
                  }`}
                >
                  {currentSprite.dokkanClass}
                </span>
                <RarityBadge rarity={currentSprite.rarity} size="xs" showText={true} />
                <ElementBadge element={currentSprite.element} size="xs" showLabel={true} />
              </div>
              <span className="text-xs font-mono font-bold text-yellow-400 bg-black/60 px-2.5 py-1 rounded border border-yellow-500/30">
                {currentSprite.code}
              </span>
            </div>

            {/* Main Stage: Sprite Canvas */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-3 min-h-[300px]">
              {/* Super Attack Dialogue Overlay Banner */}
              <AnimatePresence>
                {isSuperAttacking && (
                  <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute top-2 inset-x-0 z-30 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-black py-2 px-4 shadow-[0_0_30px_rgba(239,68,68,0.8)] border-y-2 border-yellow-300"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm font-black italic uppercase tracking-wider">
                      <span>★ SUPER ATAQUE DOKKAN ★</span>
                      <span className="truncate max-w-[280px] sm:max-w-md">
                        {currentSprite.specialAttackName}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-900 mt-0.5 line-clamp-1 italic">
                      {currentSprite.superAttackQuote}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Side-by-side or Single View */}
              {showComparison ? (
                <div className="grid grid-cols-2 gap-3 w-full max-w-lg items-center">
                  {/* Left: Original DB Legends Card Illustration */}
                  <div className="flex flex-col items-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 shadow-xl">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      ARTE DB LEGENDS
                    </span>
                    <div className="w-full h-52 rounded-lg overflow-hidden relative bg-black">
                      <img
                        src={currentSprite.originalImage}
                        alt={currentSprite.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <span className="text-xs font-black text-white truncate mt-1.5 w-full text-center">
                      {currentSprite.name}
                    </span>
                  </div>

                  {/* Right: Dokkan Chibi Sprite */}
                  <div className="flex flex-col items-center bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/40 shadow-xl relative overflow-hidden">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      SPRITE DOKKAN CHIBI
                    </span>
                    <div className="w-full h-52 rounded-lg overflow-hidden relative bg-slate-900 flex items-center justify-center">
                      <img
                        src={currentSprite.spriteImage}
                        alt="Sprite Dokkan"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-xs font-black text-amber-300 truncate mt-1.5 w-full text-center">
                      Modo Chibi 2D
                    </span>
                  </div>
                </div>
              ) : (
                /* Pure Dokkan Sprite Stage with Animations */
                <div className="relative flex flex-col items-center justify-center">
                  {/* Elemental Aura Glow */}
                  {auraLevel !== 'off' && (
                    <motion.div
                      animate={
                        animState === 'charging' || isSuperAttacking
                          ? { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }
                          : { scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }
                      }
                      transition={{
                        duration: animState === 'charging' ? 0.6 : 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute w-72 h-72 sm:w-84 sm:h-84 rounded-full pointer-events-none blur-2xl"
                      style={{
                        background: `radial-gradient(circle, ${currentSprite.auraColors.primary} 0%, ${currentSprite.auraColors.secondary} 50%, transparent 80%)`,
                        filter: auraLevel === 'max' ? 'brightness(1.4)' : 'brightness(1.0)',
                      }}
                    />
                  )}

                  {/* The Dokkan Chibi Combat Sprite */}
                  <motion.div
                    animate={
                      isSuperAttacking
                        ? { scale: [1, 1.3, 1.15], rotate: [0, -3, 3, 0], y: [0, -20, 0] }
                        : animState === 'charging'
                        ? { scale: [1, 1.05, 1], y: [0, -4, 0] }
                        : { y: [0, -8, 0] }
                    }
                    transition={{
                      duration: isSuperAttacking ? 0.5 : animState === 'charging' ? 0.35 : 2.2,
                      repeat: isSuperAttacking ? 3 : Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(0,0,0,0.8)] border border-white/10 bg-slate-950/70"
                  >
                    <img
                      src={currentSprite.spriteImage}
                      alt={currentSprite.title}
                      className="w-full h-full object-contain pointer-events-none"
                    />

                    {/* Aura State Indicator tag */}
                    <div className="absolute top-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                      Aura: {auraLevel.toUpperCase()}
                    </div>
                  </motion.div>

                  {/* Character Nameplate */}
                  <div className="mt-3 text-center">
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider drop-shadow-md">
                      {currentSprite.title}
                    </h3>
                    <span className="text-xs text-amber-400 font-bold tracking-wide">
                      {currentSprite.subtitle}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Controls: Anim States & Aura Level */}
            <div className="relative z-10 bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              {/* Anim state toggles */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 mr-1 hidden sm:inline">
                  ACCIÓN:
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setAnimState('idle');
                    setIsSuperAttacking(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
                    animState === 'idle' && !isSuperAttacking
                      ? 'bg-amber-500 text-black font-black shadow'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  En Espera (Idle)
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setAnimState('charging');
                    setIsSuperAttacking(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition cursor-pointer flex items-center gap-1 ${
                    animState === 'charging'
                      ? 'bg-red-600 text-white font-black shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Cargar Ki</span>
                </button>
                <button
                  onClick={triggerSuperAttack}
                  disabled={isSuperAttacking}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition cursor-pointer flex items-center gap-1 ${
                    isSuperAttacking
                      ? 'bg-yellow-400 text-black font-black animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black hover:brightness-110 shadow'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>Super Ataque</span>
                </button>
              </div>

              {/* Aura level toggle */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black uppercase text-slate-400 mr-1 hidden sm:inline">
                  AURA:
                </span>
                {(['off', 'normal', 'max'] as AuraIntensity[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      sound.playClick();
                      setAuraLevel(lvl);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition cursor-pointer ${
                      auraLevel === lvl
                        ? 'bg-cyan-500 text-black font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {lvl === 'off' ? 'Apagada' : lvl === 'normal' ? 'Normal' : 'Máxima'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Dokkan Technical Card Sheet & Character Selector (5 Cols) */}
          <div className="lg:col-span-5 p-4 flex flex-col justify-between bg-slate-950/95 overflow-y-auto gap-4">
            {/* Top Carousel Navigation */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  SELECCIONAR GUERRERO ({selectedIndex + 1}/{DOKKAN_SPRITES.length})
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition cursor-pointer"
                    title="Anterior guerrero"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition cursor-pointer"
                    title="Siguiente guerrero"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnails Strip */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {DOKKAN_SPRITES.map((item, idx) => {
                  const isCurrent = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectCharacter(idx)}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 bg-slate-900 p-1 flex flex-col items-center ${
                        isCurrent
                          ? 'border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)] ring-1 ring-amber-400'
                          : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="w-full h-14 rounded-lg overflow-hidden bg-black relative">
                        <img
                          src={item.spriteImage}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-black text-white truncate w-full text-center mt-1">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Dokkan Battle Character Card Details */}
              <div className="space-y-3">
                {/* Special Attack Box */}
                <div className="bg-gradient-to-r from-red-950/40 to-slate-900 p-3 rounded-xl border border-red-500/30 shadow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-red-400 tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3 text-red-400" />
                      SÚPER ATAQUE DOKKAN
                    </span>
                    <span className="text-[10px] font-mono text-yellow-400 font-bold">
                      NIVEL MAX
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wide">
                    {currentSprite.specialAttackName}
                  </h4>
                  <p className="text-xs text-slate-300 italic mt-1 leading-snug">
                    {currentSprite.superAttackQuote}
                  </p>
                </div>

                {/* Leader Skill */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1 mb-1">
                    <Shield className="w-3 h-3 text-cyan-400" />
                    HABILIDAD DE LÍDER
                  </span>
                  <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                    {currentSprite.leaderSkill}
                  </p>
                </div>

                {/* Passive Skill */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      HABILIDAD PASIVA: {currentSprite.passiveSkillName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentSprite.passiveEffect}
                  </p>
                </div>

                {/* Combat Role & Element */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      ROL DE COMBATE
                    </span>
                    <span className="font-bold text-white text-xs">
                      {currentSprite.combatRole}
                    </span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      COLOR / ELEMENTO
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ElementBadge element={currentSprite.element} size="xs" showLabel={true} />
                    </div>
                  </div>
                </div>

                {/* Concept Disclaimer */}
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] text-slate-400">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Demostración visual conceptual. Los sprites no afectan tus Cronocristales ni tu inventario del juego.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex justify-center">
              <GameButton
                variant="Universalbutton"
                size="md"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-56 h-[50px]"
              >
                <span className="text-black font-black text-sm tracking-wider">
                  CERRAR LABORATORIO
                </span>
              </GameButton>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
