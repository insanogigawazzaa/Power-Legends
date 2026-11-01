import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, Flame, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';
import { GameButton } from './GameButton';

interface GetCrystalsViewProps {
  chronoCrystals: number;
  onAddCrystals: (amount: number) => void;
  onGoToBanners: () => void;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  isBoosted: boolean;
}

export const GetCrystalsView: React.FC<GetCrystalsViewProps> = ({
  chronoCrystals,
  onAddCrystals,
  onGoToBanners,
}) => {
  // Boost state: 60 seconds of 5x CC per click
  const [boostRemainingSeconds, setBoostRemainingSeconds] = useState<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isBoostActive = boostRemainingSeconds > 0;
  const crystalsPerClick = isBoostActive ? 5 : 1;

  // Boost timer countdown effect
  useEffect(() => {
    if (boostRemainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setBoostRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            sound.playEnergyBlast(); // Audio feedback when boost ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [boostRemainingSeconds]);

  const handleActivateBoost = () => {
    sound.playSummonCharge();
    setBoostRemainingSeconds(60);
  };

  const handleGreenButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playCrystalChime();
    onAddCrystals(crystalsPerClick);
    setTotalClicks((prev) => prev + 1);

    // Floating text coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (Math.random() * 40 - 20);
    const y = e.clientY - rect.top;

    const newFloating: FloatingText = {
      id: Date.now() + Math.random(),
      text: `+${crystalsPerClick} CC`,
      x,
      y,
      isBoosted: isBoostActive,
    };

    setFloatingTexts((prev) => [...prev, newFloating]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== newFloating.id));
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-140px)] font-['Rajdhani',sans-serif]">
      {/* Title Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          MODO DE OBTENCIÓN DE MONEDAS
        </div>
        <h2 className="text-3xl sm:text-4xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 tracking-wide">
          Generador de Cronocristales
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mt-1">
          Pulsa el <span className="text-emerald-400 font-bold">gran botón verde</span> para obtener Cronocristales (1 por click) o activa el <span className="text-yellow-400 font-bold">Boost de 1 minuto</span> para recibir 5 por click.
        </p>
      </div>

      {/* Main CC Counter Display Card */}
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-black p-6 rounded-2xl border-2 border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.25)] flex flex-col items-center mb-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
          Tus Cronocristales Actuales
        </span>

        <div className="flex items-center justify-center gap-3 my-2">
          <motion.img
            src="/assets/aistudio/Ec9tFq8UwAA6TcM_e688483e.png"
            alt="Cronocristal"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          />
          <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-wider tabular-nums drop-shadow-md">
            {chronoCrystals.toLocaleString()}
          </span>
        </div>

        {/* Current Click Yield Pill */}
        <div className="flex items-center gap-2 text-xs font-bold mt-2">
          {isBoostActive ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>BOOST ACTIVO: +5 CC POR CLICK</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Modo normal: +1 CC por click</span>
            </div>
          )}
        </div>
      </div>

      {/* Boost Control Card */}
      <div className="w-full max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-4 mb-6 flex flex-col items-center">
        {isBoostActive ? (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-black text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-bounce" />
                ¡BOOST ENERGÉTICO ACTIVADO!
              </span>
              <span className="font-mono font-black text-base text-yellow-300 flex items-center gap-1">
                <Clock className="w-4 h-4 text-yellow-400" />
                {boostRemainingSeconds}s
              </span>
            </div>

            {/* Countdown Progress Bar */}
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-amber-500/40 p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-red-500 rounded-full"
                style={{ width: `${(boostRemainingSeconds / 60) * 100}%` }}
                transition={{ ease: 'linear', duration: 1 }}
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1.5">
              ¡Aprovecha! Cada toque genera 5 Cronocristales.
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <span className="text-xs font-black uppercase text-white block">
                Boost de 1 Minuto (5 CC / click)
              </span>
              <span className="text-[11px] text-slate-400">
                Multiplica tu obtención x5 durante 60 segundos
              </span>
            </div>
            <GameButton
              variant="Universalbutton"
              size="md"
              onClick={handleActivateBoost}
              className="w-full sm:w-auto min-w-[210px] h-[52px] sm:h-[56px]"
            >
              <div className="flex items-center gap-1.5 text-black font-black text-xs">
                <Flame className="w-4 h-4 fill-black text-black" />
                <span>ACTIVAR BOOST (1 MIN)</span>
              </div>
            </GameButton>
          </div>
        )}
      </div>

      {/* THE BIG GREEN BUTTON (Requested by user) */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Aura Glow */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl pointer-events-none transition-all duration-300 ${
            isBoostActive
              ? 'bg-amber-400/40 animate-pulse scale-110'
              : 'bg-emerald-500/25 animate-ping opacity-60'
          }`}
        />
        <div
          className={`absolute -inset-6 rounded-full blur-3xl pointer-events-none ${
            isBoostActive
              ? 'bg-gradient-to-r from-yellow-500 to-red-500 opacity-40'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400 opacity-30'
          }`}
        />

        <button
          onClick={handleGreenButtonClick}
          onMouseDown={() => setIsPressing(true)}
          onMouseUp={() => setIsPressing(false)}
          onMouseLeave={() => setIsPressing(false)}
          onTouchStart={() => setIsPressing(true)}
          onTouchEnd={() => setIsPressing(false)}
          className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full cursor-pointer flex flex-col items-center justify-center text-center p-4 transition-all duration-150 select-none ${
            isPressing
              ? 'scale-95 shadow-[0_0_60px_rgba(16,185,129,0.95)]'
              : 'hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.7),inset_0_4px_14px_rgba(255,255,255,0.4),inset_0_-8px_16px_rgba(0,0,0,0.7)]'
          } ${
            isBoostActive
              ? 'ring-8 ring-amber-400 bg-gradient-to-b from-amber-400 via-emerald-600 to-emerald-900'
              : 'ring-4 ring-emerald-300/80 bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-800'
          }`}
          style={{
            border: isBoostActive ? '5px solid #fef08a' : '4px solid #a7f3d0',
          }}
        >
          {/* Inner ring & sci-fi textures */}
          <div className="absolute inset-2.5 rounded-full border border-white/40 pointer-events-none" />
          <div className="absolute inset-5 rounded-full border-2 border-dashed border-emerald-200/40 pointer-events-none animate-spin [animation-duration:25s]" />

          {/* Button Graphic Center using provided asset */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Asset button icon & Green Energy blade texture */}
            <motion.div
              animate={
                isBoostActive
                  ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }
                  : { scale: [1, 1.05, 1] }
              }
              transition={{ duration: isBoostActive ? 0.6 : 2, repeat: Infinity }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-1"
            >
              {/* Authentic DB Legends Green energy asset */}
              <img
                src="/assets/aistudio/Button_Summon_Consecutive.png"
                alt=""
                className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_12px_rgba(34,197,94,0.8)] opacity-90"
              />
              <img
                src="/assets/aistudio/Ec9tFq8UwAA6TcM_e688483e.png"
                alt="Cristal"
                className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow"
              />
            </motion.div>

            <span className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight">
              ¡PULSAR!
            </span>
            <span
              className={`text-xs sm:text-sm font-black uppercase tracking-widest px-3 py-0.5 rounded-full mt-1 border shadow ${
                isBoostActive
                  ? 'bg-amber-500 text-black border-amber-200 animate-pulse'
                  : 'bg-emerald-950/80 text-emerald-100 border-emerald-300/40'
              }`}
            >
              +{crystalsPerClick} CRONOCRISTAL{crystalsPerClick > 1 ? 'ES' : ''}
            </span>
          </div>

          {/* Floating Numbers Particles */}
          <AnimatePresence>
            {floatingTexts.map((item) => (
              <motion.span
                key={item.id}
                initial={{ opacity: 1, y: item.y, x: item.x - 140, scale: 0.8 }}
                animate={{ opacity: 0, y: item.y - 130, scale: item.isBoosted ? 1.6 : 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className={`absolute pointer-events-none font-black font-mono text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,1)] z-30 ${
                  item.isBoosted ? 'text-amber-300' : 'text-emerald-200'
                }`}
              >
                {item.text}
              </motion.span>
            ))}
          </AnimatePresence>
        </button>
      </div>

      {/* Footer Navigation & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <div className="text-xs text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
          Toques en esta sesión: <span className="font-mono text-emerald-400 font-bold">{totalClicks}</span>
        </div>

        <GameButton
          variant="Universalbutton"
          size="md"
          onClick={() => {
            onGoToBanners();
          }}
          className="w-60 sm:w-68 h-[52px] sm:h-[56px]"
        >
          <div className="flex items-center gap-1.5 text-black font-black text-xs">
            <Sparkles className="w-4 h-4 text-black" />
            <span>IR A INVOCAR AL BANNER</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </div>
        </GameButton>
      </div>
    </div>
  );
};
