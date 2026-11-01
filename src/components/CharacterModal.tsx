import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Minimize2, ZoomIn, Hash, Tag } from 'lucide-react';
import { Character } from '../types';
import { calculateStarInfo } from '../data/characters';
import { StarDisplay } from './StarDisplay';
import { ElementBadge } from './ElementBadge';
import { RarityBadge } from './RarityBadge';
import { GameButton } from './GameButton';
import { sound } from '../utils/audio';

interface CharacterModalProps {
  character: Character | null;
  zPower?: number;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  zPower = 600,
  onClose,
}) => {
  const [isViewingFullImage, setIsViewingFullImage] = useState<boolean>(false);

  if (!character) return null;

  const starInfo = calculateStarInfo(zPower);
  const displayTitle = character.fileTitle || character.name;

  return (
    <>
      {/* Primary Detail Modal ("Ficha del Personaje") */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none font-['Rajdhani',sans-serif] overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-md rounded-2xl overflow-hidden border-4 bg-slate-950 shadow-2xl flex flex-col my-auto max-h-[94vh] ${
            character.rarity === 'LEGENDS_LIMITED'
              ? 'border-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.7)]'
              : character.rarity === 'SPARKING'
              ? 'border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.5)]'
              : 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/80 text-white/90 hover:text-white hover:bg-black border border-white/20 transition-all cursor-pointer shadow-lg"
            title="Cerrar ficha"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Header with Character Title (Matching file title) */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 px-4 pt-3.5 pb-2.5 border-b border-slate-800 flex flex-col items-center text-center">
            {character.subtitle && (
              <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">
                {character.subtitle}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide leading-tight drop-shadow px-6">
              {displayTitle}
            </h2>

            {/* Stars & Z-Power Summary pill */}
            <div className="flex items-center gap-2 mt-2 bg-black/70 px-3 py-1 rounded-full border border-white/10">
              <StarDisplay
                stars={starInfo.stars}
                isRed={starInfo.isRed}
                size="sm"
                showTextLabel
              />
              <span className="text-slate-600 text-xs">|</span>
              <span className="text-xs font-mono font-bold text-yellow-300">
                {zPower.toLocaleString()} Z-Power
              </span>
            </div>
          </div>

          {/* DEDICATED ELEMENT & RARITY ZONE: with official uploaded assets */}
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                ELEMENTO:
              </span>
              <ElementBadge element={character.element} size="md" showLabel={true} />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                RAREZA:
              </span>
              <RarityBadge rarity={character.rarity} size="md" showText={true} />
            </div>
          </div>

          {/* Character Artwork Container with interactive tap to view full image */}
          <div
            onClick={() => {
              sound.playClick();
              setIsViewingFullImage(true);
            }}
            className="group relative w-full h-[340px] sm:h-[380px] bg-black overflow-hidden flex items-center justify-center cursor-pointer select-none"
            title="Presiona para ver la imagen completa"
          >
            <img
              src={character.image}
              alt={displayTitle}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />

            {/* Tap instruction badge overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="px-4 py-2 rounded-xl bg-black/85 border border-yellow-400/80 text-yellow-300 font-black text-sm flex items-center gap-2 shadow-2xl backdrop-blur-sm">
                <ZoomIn className="w-4 h-4 text-yellow-400 animate-bounce" />
                <span>VER IMAGEN COMPLETA</span>
              </div>
            </div>

            {/* Quick action button in bottom right of image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sound.playClick();
                setIsViewingFullImage(true);
              }}
              className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white/90 hover:text-white border border-white/30 text-xs font-bold transition-all shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-yellow-400" />
              <span>Pantalla Completa</span>
            </button>
          </div>

          {/* Character Footer Card: Z-Power Progress + Categories + Description + Lower Code */}
          <div className="p-4 bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t border-slate-800 flex flex-col gap-2.5">
            {/* Z-Power Progress bar */}
            <div className="bg-black/60 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                <span className="text-slate-300">Progreso de Z-Power:</span>
                <span className="text-yellow-400">
                  {zPower.toLocaleString()} / 9,999 ZP
                </span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    starInfo.isRed
                      ? 'bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300'
                      : 'bg-gradient-to-r from-yellow-500 to-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, (zPower / 9999) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                <span>Rango: {starInfo.displayLabel}</span>
                <span>
                  {starInfo.nextThresholdZPower
                    ? `Siguiente estrella a los ${starInfo.nextThresholdZPower.toLocaleString()} ZP`
                    : '★ ¡NIVEL MÁXIMO (14 ESTRELLAS)!'}
                </span>
              </div>
            </div>

            {/* CATEGORIES SECTION (3.1: "indicar distintas categorías que cada personaje tenga más de una") */}
            {character.categories && character.categories.length > 0 && (
              <div className="bg-black/50 p-2 rounded-xl border border-slate-800/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1.5">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  CATEGORÍAS DEL PERSONAJE:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {character.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-md bg-slate-850 border border-slate-700 text-cyan-300 text-[11px] font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-2 rounded-lg border border-slate-800/80">
              {character.description}
            </p>

            {/* LOWER CODE BADGE: "y además en la parte de abajo su codigo" */}
            <div className="flex items-center justify-between bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700 shadow-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-yellow-400" />
                CÓDIGO DEL GUERRERO:
              </span>
              <span className="text-sm font-black font-mono text-yellow-400 tracking-wider bg-black/70 px-3 py-0.5 rounded-lg border border-yellow-500/40 shadow-inner">
                {character.code}
              </span>
            </div>

            {/* Bottom Close Button - Universal DBL Asset */}
            <div className="pt-2 flex justify-center">
              <GameButton
                variant="Universalbutton"
                size="md"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-52 sm:w-56 h-[50px] sm:h-[54px]"
              >
                <span className="text-black font-black text-sm tracking-wider">
                  CERRAR FICHA
                </span>
              </GameButton>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FULL IMAGE VIEWER (MODAL DE IMAGEN COMPLETA) */}
      <AnimatePresence>
        {isViewingFullImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsViewingFullImage(false)}
            className="fixed inset-0 z-60 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-3 sm:p-6 select-none font-['Rajdhani',sans-serif]"
          >
            {/* Top Bar: Title from file + Element icon + Rarity icon + Close */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl mx-auto flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-md"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  ILUSTRACIÓN COMPLETA
                </span>
                <h1 className="text-lg sm:text-2xl font-black text-white uppercase tracking-wide leading-tight drop-shadow">
                  {displayTitle}
                </h1>
              </div>

              {/* Elements & Rarity Zone in Full View */}
              <div className="flex items-center gap-2 sm:gap-3">
                <ElementBadge element={character.element} size="lg" showLabel={true} />
                <RarityBadge rarity={character.rarity} size="lg" showText={true} />
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsViewingFullImage(false);
                  }}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-white/20 transition-all cursor-pointer ml-1"
                  title="Cerrar imagen completa"
                >
                  <Minimize2 className="w-5 h-5 text-yellow-400" />
                </button>
              </div>
            </div>

            {/* Center Area: UNRESTRICTED FULL IMAGE (object-contain, completely uncropped) */}
            <div className="flex-1 flex items-center justify-center py-2 sm:py-4 overflow-hidden">
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={character.image}
                alt={displayTitle}
                className="max-w-full max-h-[72vh] object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.9)] rounded-lg pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Bottom Bar: Character Code at the bottom + Star info + Categories */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <StarDisplay
                  stars={starInfo.stars}
                  isRed={starInfo.isRed}
                  size="md"
                  showTextLabel
                />
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-yellow-400">
                  {zPower.toLocaleString()} / 9,999 Z-Power
                </span>

                {/* Categories in Full View */}
                {character.categories && (
                  <div className="hidden md:flex items-center gap-1.5 ml-2">
                    {character.categories.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Lower Code Display */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Hash className="w-4 h-4 text-yellow-400" />
                  CÓDIGO:
                </span>
                <span className="text-base font-black font-mono text-yellow-300 tracking-widest bg-black/80 px-3.5 py-1 rounded-lg border border-yellow-500/50 shadow-inner">
                  {character.code}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
