import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Character, PulledCharacter } from '../types';
import { calculateStarInfo } from '../data/characters';
import { StarDisplay } from './StarDisplay';
import { ElementBadge } from './ElementBadge';
import { RarityBadge } from './RarityBadge';
import { ChevronRight, ChevronsDown, Zap, Sparkles, FastForward } from 'lucide-react';
import { sound } from '../utils/audio';
import { GameButton } from './GameButton';
import { SUMMON_FRAMES, CHARGE_FRAME_CUTOFF } from '../data/summonFrames';

interface SummonAnimationProps {
  pulledCharacters: PulledCharacter[];
  onComplete: () => void;
  onInspectCharacter?: (char: Character, zPower?: number) => void;
}

export const SummonAnimation: React.FC<SummonAnimationProps> = ({
  pulledCharacters,
  onComplete,
  onInspectCharacter,
}) => {
  // Stages: 'charge' -> 'blast_sequence' -> 'reveal_cards' -> 'summary'
  const [stage, setStage] = useState<'charge' | 'blast_sequence' | 'reveal_cards' | 'summary'>('charge');
  
  // Animation frames state
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPreloaded, setIsPreloaded] = useState<boolean>(false);
  const [pullProgress, setPullProgress] = useState<number>(0); // 0 to 1
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartYRef = useRef<number | null>(null);
  const lastSoundProgressRef = useRef<number>(0);
  const animationTimerRef = useRef<number | null>(null);

  // Card reveal state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // High rarity checks for DB Legends hype teasers
  const hasLegendsLimited = pulledCharacters.some((c) => c.rarity === 'LEGENDS_LIMITED');
  const hasSparking = pulledCharacters.some((c) => c.rarity === 'SPARKING');

  // Preload all 40 frames into memory cache
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = SUMMON_FRAMES.length;

    SUMMON_FRAMES.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount >= Math.min(10, totalFrames)) {
          setIsPreloaded(true);
        }
      };
      img.onerror = () => {
        loadedCount += 1;
        if (loadedCount >= Math.min(10, totalFrames)) {
          setIsPreloaded(true);
        }
      };
      img.src = src;
    });

    sound.playSummonCharge();

    return () => {
      if (animationTimerRef.current) {
        window.clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  // Trigger rapid blast release sequence (frames 20 -> 39)
  const triggerBlastSequence = useCallback(() => {
    if (stage !== 'charge') return;
    setStage('blast_sequence');
    sound.playSwipeRelease();
    sound.playEnergyBlast();

    // Vibrate device if supported
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([40, 60, 100, 150]);
    }

    let frame = CHARGE_FRAME_CUTOFF;
    setCurrentFrameIndex(frame);

    const stepBlast = () => {
      frame += 1;
      if (frame < SUMMON_FRAMES.length) {
        setCurrentFrameIndex(frame);
        // Play rapid frame rate (~22-25 fps)
        animationTimerRef.current = window.setTimeout(stepBlast, 42);
      } else {
        // Blast sequence completed -> transition to card reveal
        animationTimerRef.current = window.setTimeout(() => {
          setStage('reveal_cards');
          revealCurrentCard(0);
        }, 300);
      }
    };

    animationTimerRef.current = window.setTimeout(stepBlast, 42);
  }, [stage]);

  // Touch / Mouse Drag handlers for interactive Ki pulling
  const handleDragStart = (clientY: number) => {
    if (stage !== 'charge') return;
    setIsDragging(true);
    dragStartYRef.current = clientY;
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging || dragStartYRef.current === null || stage !== 'charge') return;
    const deltaY = clientY - dragStartYRef.current;
    // Map 200px drag to 100% progress
    const progress = Math.max(0, Math.min(1, deltaY / 180));
    setPullProgress(progress);

    // Scrub charge frames (0 to CHARGE_FRAME_CUTOFF - 1)
    const frameIndex = Math.min(
      CHARGE_FRAME_CUTOFF - 1,
      Math.floor(progress * CHARGE_FRAME_CUTOFF)
    );
    setCurrentFrameIndex(frameIndex);

    // Trigger rising pitch sound feedback every 15% charge step
    if (Math.abs(progress - lastSoundProgressRef.current) > 0.15) {
      sound.playKiGather(progress);
      lastSoundProgressRef.current = progress;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(15);
      }
    }
  };

  const handleDragEnd = () => {
    if (!isDragging || stage !== 'charge') return;
    setIsDragging(false);
    dragStartYRef.current = null;

    // If dragged past 40% threshold, release blast! Otherwise bounce back
    if (pullProgress >= 0.4) {
      triggerBlastSequence();
    } else {
      // Reset back to idle
      setPullProgress(0);
      setCurrentFrameIndex(0);
    }
  };

  // Card reveal helpers
  const revealCurrentCard = (index: number) => {
    setIsRevealed(false);
    const currentChar = pulledCharacters[index];
    if (currentChar) {
      setTimeout(() => {
        setIsRevealed(true);
        sound.playReveal(currentChar.rarity);
      }, 300);
    }
  };

  const handleNextCard = () => {
    sound.playClick();
    if (currentCardIndex + 1 < pulledCharacters.length) {
      const nextIdx = currentCardIndex + 1;
      setCurrentCardIndex(nextIdx);
      revealCurrentCard(nextIdx);
    } else {
      setStage('summary');
    }
  };

  const currentPull = pulledCharacters[currentCardIndex];
  const starInfo = currentPull ? calculateStarInfo(currentPull.newZPower) : null;
  const currentTitle = currentPull ? (currentPull.character.fileTitle || currentPull.character.name) : '';

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none overflow-hidden font-['Rajdhani',sans-serif]">
      {/* Background Cosmic Energy / Outer Space Arena */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a1f] via-[#09102b] to-[#04060f] pointer-events-none overflow-hidden">
        {/* Distant nebula glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        {/* Starfield grid / twinkling cosmic points */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-35" />
        {/* Distant planet arc silhouette */}
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[900px] h-[320px] rounded-[100%] bg-gradient-to-t from-cyan-950/40 via-blue-900/20 to-transparent border-t border-cyan-400/20 blur-sm pointer-events-none" />
      </div>

      {/* TOP SKIP BUTTON: Always available for quick bypass */}
      {stage !== 'summary' && (
        <div className="absolute top-4 right-4 z-50">
          <GameButton
            variant="Universalbutton"
            size="xs"
            onClick={() => {
              sound.playClick();
              setStage('summary');
            }}
            className="w-36 sm:w-44 h-[38px] sm:h-[42px] shadow-lg"
          >
            <div className="flex items-center justify-center gap-1.5 text-black font-black text-xs uppercase tracking-wider">
              <FastForward className="w-4 h-4 text-black" />
              <span>SALTAR</span>
            </div>
          </GameButton>
        </div>
      )}

      {/* PHASE 1 & 2: INTERACTIVE CHARGE & BLAST SEQUENCE (DB LEGENDS STYLE) */}
      {(stage === 'charge' || stage === 'blast_sequence') && (
        <div
          className="relative w-full h-full flex flex-col items-center justify-between touch-none overflow-hidden"
          onMouseDown={(e) => handleDragStart(e.clientY)}
          onMouseMove={(e) => handleDragMove(e.clientY)}
          onMouseUp={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
        >
          {/* Top Banner: Stage Status & Rarity Presage */}
          <div className="relative z-30 pt-6 px-4 text-center max-w-lg w-full">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md mb-2"
            >
              <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-black text-cyan-200 tracking-widest uppercase">
                {stage === 'charge'
                  ? 'INVOCACIÓN DE GUERREROS Z'
                  : '¡Tira!'}
              </span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>

            {/* Rare omen indicators */}
            {stage === 'blast_sequence' && hasLegendsLimited && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="text-yellow-400 font-black text-lg sm:text-2xl tracking-widest uppercase drop-shadow-[0_0_15px_rgba(234,179,8,1)]"
              >
                ★ ¡¡LEGENDS LIMITED DETECTADO!! ★
              </motion.div>
            )}
            {stage === 'blast_sequence' && !hasLegendsLimited && hasSparking && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-amber-400 font-black text-base sm:text-xl tracking-widest uppercase drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]"
              >
                ★ ¡¡SPARKING CONFIRMADO!! ★
              </motion.div>
            )}
          </div>

          {/* MAIN ANIMATION FRAME DISPLAY */}
          <div className="relative flex-1 w-full flex items-center justify-center max-w-4xl max-h-[75vh] px-2">
            {/* Dynamic Ki Aura Glow behind character */}
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-200 ${
                stage === 'blast_sequence'
                  ? 'opacity-100 scale-125'
                  : pullProgress > 0.1
                  ? 'opacity-80 scale-110'
                  : 'opacity-40 scale-95'
              }`}
            >
              <div
                className={`w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] rounded-full blur-3xl transition-colors duration-300 ${
                  hasLegendsLimited && stage === 'blast_sequence'
                    ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-red-500'
                    : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500'
                }`}
              />
            </div>

            {/* Actual Animated Frame Image (transparent background cutout) */}
            <div
              className={`relative z-10 w-full h-full flex items-center justify-center transition-transform ${
                stage === 'blast_sequence' ? 'animate-pulse scale-105' : ''
              }`}
            >
              <img
                src={SUMMON_FRAMES[currentFrameIndex] || SUMMON_FRAMES[0]}
                alt={`Summon frame ${currentFrameIndex}`}
                className="max-h-[68vh] sm:max-h-[75vh] w-auto object-contain drop-shadow-[0_0_35px_rgba(59,130,246,0.6)] pointer-events-none select-none"
                draggable={false}
              />
            </div>

            {/* Blast Speedlines / Screen Shake overlay */}
            {stage === 'blast_sequence' && (
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(56,189,248,0.3)_100%)] animate-ping" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-white shadow-[0_0_30px_#fff] opacity-80" />
              </div>
            )}
          </div>

          {/* BOTTOM INTERACTION BAR: DB LEGENDS "PULL" CONTROLS */}
          {stage === 'charge' && (
            <div className="relative z-30 pb-8 px-4 flex flex-col items-center w-full max-w-md">
              {/* Interactive Swipe Guide / Button */}
              <div className="flex flex-col items-center gap-3 w-full">
                {/* Visual Pull Indicator (DB Legends Style Swipe Arrow) */}
                <motion.div
                  animate={{
                    y: pullProgress >= 0.8 ? [0, 6, 0] : [0, 10, 0],
                  }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex flex-col items-center text-center cursor-grab active:cursor-grabbing mb-1"
                >
                  <ChevronsDown
                    className={`w-9 h-9 transition-colors ${
                      pullProgress >= 0.8
                        ? 'text-yellow-400 animate-bounce'
                        : 'text-cyan-400'
                    }`}
                  />
                  <span
                    className={`text-xl sm:text-2xl font-black italic tracking-widest drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] ${
                      pullProgress >= 0.8
                        ? 'text-yellow-400 animate-pulse'
                        : 'text-white'
                    }`}
                  >
                    ¡Tira!
                  </span>
                </motion.div>

                {/* Instant Tap Release Button for direct trigger */}
                <GameButton
                  variant="Universalbutton"
                  size="md"
                  onClick={triggerBlastSequence}
                  animatePulse={true}
                  className="w-72 sm:w-80 h-[56px] sm:h-[62px]"
                >
                  <span className="text-black font-black text-lg sm:text-xl tracking-wider drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)] flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 fill-black" />
                    ¡Tira!
                  </span>
                </GameButton>
              </div>
            </div>
          )}

          {/* Blast sequence firing label */}
          {stage === 'blast_sequence' && (
            <div className="relative z-30 pb-10 text-center">
              <h2 className="text-4xl sm:text-6xl font-black text-white italic tracking-widest uppercase drop-shadow-[0_0_25px_rgba(59,130,246,1)]">
                ¡Tira!
              </h2>
            </div>
          )}
        </div>
      )}

      {/* PHASE 3: CARD REVEAL */}
      {stage === 'reveal_cards' && currentPull && (
        <div className="relative z-10 flex flex-col items-center justify-between w-full h-full max-w-md p-4">
          {/* Top Info Bar */}
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300 pt-2 px-2">
            <span className="bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700 font-mono">
              Invocación {currentCardIndex + 1} / {pulledCharacters.length}
            </span>
            <span className="text-yellow-400 font-bold uppercase tracking-wider text-[11px]">
              Toca siguiente para continuar
            </span>
          </div>

          {/* Main Character Card Display */}
          <div className="relative w-full flex-1 flex flex-col items-center justify-center my-2 max-h-[75vh]">
            <AnimatePresence mode="wait">
              {isRevealed && (
                <motion.div
                  key={currentPull.instanceId}
                  initial={{ rotateY: 90, scale: 0.8, opacity: 0 }}
                  animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className={`relative w-full max-w-[320px] rounded-2xl overflow-hidden border-4 shadow-2xl flex flex-col items-center bg-slate-900 ${
                    currentPull.rarity === 'LEGENDS_LIMITED'
                      ? 'border-yellow-400 shadow-[0_0_40px_rgba(234,179,8,0.8)]'
                      : currentPull.rarity === 'SPARKING'
                      ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.6)]'
                      : 'border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                  }`}
                >
                  {/* Top Rarity Badge strip */}
                  <div className="w-full py-1.5 flex items-center justify-center bg-slate-950 border-b border-slate-800">
                    <RarityBadge rarity={currentPull.rarity} size="sm" showText={true} />
                  </div>

                  {/* Character Full Art */}
                  <div className="relative w-full h-[340px] overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={currentPull.character.image}
                      alt={currentTitle}
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Element badge in Element Zone */}
                    <div className="absolute top-2.5 left-2.5">
                      <ElementBadge element={currentPull.character.element} size="sm" showLabel={true} />
                    </div>

                    {/* New vs Duplicate Banner */}
                    <div
                      className={`absolute top-2.5 right-2.5 font-black text-[10px] uppercase px-2.5 py-0.5 rounded shadow tracking-wider ${
                        currentPull.isNew
                          ? 'bg-red-600 text-white animate-bounce'
                          : 'bg-amber-500 text-black'
                      }`}
                    >
                      {currentPull.isNew ? '¡NUEVO GUERRERO!' : '¡DUPLICADO!'}
                    </div>

                    {/* Star Level Up Alert */}
                    {currentPull.leveledUpStar && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute bottom-12 inset-x-2 bg-gradient-to-r from-red-600 via-yellow-500 to-amber-600 p-1.5 rounded-xl border border-white text-black font-black text-center text-xs uppercase shadow-2xl"
                      >
                        ★ ¡SUBIDA DE ESTRELLAS! ({currentPull.newStarDisplay}) ★
                      </motion.div>
                    )}

                    {/* Stars Display on card */}
                    {starInfo && (
                      <div className="absolute bottom-2 left-2 z-20 bg-black/85 backdrop-blur-sm px-2 py-1 rounded-md border border-white/20">
                        <StarDisplay stars={starInfo.stars} isRed={starInfo.isRed} size="sm" showTextLabel />
                      </div>
                    )}
                  </div>

                  {/* Character Footer: Name, Z-Power granted, Code */}
                  <div className="w-full bg-gradient-to-t from-black via-slate-950 to-slate-900 p-3 text-center border-t border-slate-800">
                    <h3 className="text-xl font-black text-white tracking-wide uppercase drop-shadow">
                      {currentTitle}
                    </h3>

                    {/* Granted Z-Power pill */}
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-xs font-mono font-black text-yellow-400 bg-yellow-950/60 border border-yellow-500/40 px-2 py-0.5 rounded">
                        +{currentPull.zPowerGranted} Z-Power
                      </span>
                      <span className="text-xs font-mono text-slate-300">
                        Total: {currentPull.newZPower.toLocaleString()} ZP
                      </span>
                    </div>

                    {/* Code */}
                    <span className="text-xs font-mono text-yellow-400/90 font-bold block mt-1">
                      {currentPull.character.code}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <div className="w-full pb-4 px-4 flex justify-center">
            <GameButton
              variant="Universalbutton"
              size="md"
              onClick={handleNextCard}
              className="w-68 sm:w-76 h-[58px] sm:h-[64px]"
            >
              <div className="flex items-center justify-center gap-1.5 text-black font-black text-sm">
                <span>
                  {currentCardIndex + 1 < pulledCharacters.length ? 'SIGUIENTE PERSONAJE' : 'VER RESULTADOS'}
                </span>
                <ChevronRight className="w-5 h-5 text-black" />
              </div>
            </GameButton>
          </div>
        </div>
      )}

      {/* PHASE 4: SUMMARY GRID OF ALL PULLED CHARACTERS */}
      {stage === 'summary' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto px-4 py-6 flex flex-col items-center"
        >
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest block mb-1">
              Invocación Completada
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider">
              ¡Resultados de la Invocación!
            </h2>
          </div>

          {/* Grid of Results */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full mb-8">
            {pulledCharacters.map((item, idx) => {
              const itemStar = calculateStarInfo(item.newZPower);
              const itemTitle = item.character.fileTitle || item.character.name;

              return (
                <motion.div
                  key={item.instanceId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onInspectCharacter?.(item.character, item.newZPower)}
                  className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 bg-slate-900 transition-all hover:scale-105 ${
                    item.rarity === 'LEGENDS_LIMITED'
                      ? 'border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                      : item.rarity === 'SPARKING'
                      ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                      : 'border-purple-500'
                  }`}
                >
                  {/* Rarity Tag */}
                  <div className="py-1 flex items-center justify-center bg-slate-950 border-b border-slate-800">
                    <RarityBadge rarity={item.rarity} size="xs" showText={true} />
                  </div>

                  {/* Character Thumbnail */}
                  <div className="w-full h-32 sm:h-36 overflow-hidden bg-black relative">
                    <img
                      src={item.character.image}
                      alt={itemTitle}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Element Badge */}
                    <div className="absolute top-1 left-1 z-10">
                      <ElementBadge element={item.character.element} size="xs" showLabel={false} />
                    </div>

                    {/* New or Duplicate Pill */}
                    <div
                      className={`absolute top-1 right-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        item.isNew ? 'bg-red-600 text-white' : 'bg-slate-900/90 text-yellow-400 border border-yellow-500/40'
                      }`}
                    >
                      {item.isNew ? 'NUEVO' : 'REPETIDO'}
                    </div>

                    {/* Stars */}
                    <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 rounded">
                      <StarDisplay stars={itemStar.stars} isRed={itemStar.isRed} size="xs" />
                    </div>
                  </div>

                  {/* Character Name & Z-Power */}
                  <div className="p-2 text-center bg-slate-950 flex flex-col gap-0.5">
                    <span className="block text-xs font-black text-white truncate" title={itemTitle}>
                      {itemTitle}
                    </span>
                    <span className="text-[10px] font-mono text-yellow-400 font-bold">
                      +{item.zPowerGranted} ZP
                    </span>
                    <span className="text-[9px] font-mono text-yellow-400/80 truncate">
                      {item.character.code}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <GameButton
              variant="Universalbutton"
              size="lg"
              onClick={() => {
                onComplete();
              }}
              className="w-72 sm:w-80 h-[66px] sm:h-[72px]"
            >
              <span className="text-black font-black text-base tracking-wider drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
                ACEPTAR Y CONTINUAR
              </span>
            </GameButton>
          </div>
        </motion.div>
      )}
    </div>
  );
};
