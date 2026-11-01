import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Star,
  History,
  Edit2,
  Check,
  X,
  Award,
  Sparkles,
  Users,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, ObtainedCharacter, Character } from '../types';
import { calculateStarInfo } from '../data/characters';
import { StarDisplay } from './StarDisplay';
import { ElementBadge } from './ElementBadge';
import { RarityBadge } from './RarityBadge';
import { GameButton } from './GameButton';
import { sound } from '../utils/audio';

interface ProfileViewProps {
  userProfile: UserProfile;
  obtainedCharacters: ObtainedCharacter[];
  chronoCrystals: number;
  onUpdateUsername: (newName: string) => void;
  onSelectFavoriteCharacter: (characterId: string) => void;
  onInspectCharacter: (char: Character, zPower?: number) => void;
  onGoToBanners: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  obtainedCharacters,
  chronoCrystals,
  onUpdateUsername,
  onSelectFavoriteCharacter,
  onInspectCharacter,
  onGoToBanners,
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(userProfile.username);
  const [isFavoriteSelectorOpen, setIsFavoriteSelectorOpen] = useState<boolean>(false);

  // Find favorite character from obtained inventory
  const favoriteObtained = obtainedCharacters.find(
    (item) => item.characterId === userProfile.favoriteCharacterId
  );
  const favoriteChar = favoriteObtained ? favoriteObtained.character : null;
  const favoriteStarInfo = favoriteObtained
    ? calculateStarInfo(favoriteObtained.zPower)
    : null;

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length > 0) {
      onUpdateUsername(trimmed);
      sound.playClick();
      setIsEditingName(false);
    }
  };

  const handleChooseFavorite = (charId: string) => {
    sound.playClick();
    onSelectFavoriteCharacter(charId);
    setIsFavoriteSelectorOpen(false);
  };

  const totalZPowerSum = obtainedCharacters.reduce((acc, curr) => acc + curr.zPower, 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 font-['Rajdhani',sans-serif]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5 text-yellow-400" />
            FICHA DE JUGADOR & ESTADÍSTICAS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wide flex items-center gap-2">
            Perfil de Guerrero
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Personaliza tu identidad, elige a tu guerrero insignia y revisa tus últimas 10 invocaciones.
          </p>
        </div>

        {/* Quick Crystals counter */}
        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 self-start sm:self-auto">
          <img
            src="/assets/aistudio/Ec9tFq8UwAA6TcM_e688483e.png"
            alt="CC"
            className="w-5 h-5 object-contain drop-shadow"
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold leading-none">
              Saldo Actual
            </span>
            <span className="text-lg font-black font-mono text-yellow-400 leading-none mt-0.5">
              {chronoCrystals.toLocaleString()} CC
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUMN 1: Profile Card & Favorite Character */}
        <div className="flex flex-col gap-6">
          {/* USER IDENTITY CARD */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                NOMBRE DE JUGADOR
              </span>
              {!isEditingName && (
                <button
                  onClick={() => {
                    setNameInput(userProfile.username);
                    setIsEditingName(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/70 hover:bg-purple-900 border border-purple-500/60 text-xs text-purple-200 hover:text-white font-black transition cursor-pointer group shadow-[0_0_12px_rgba(168,85,247,0.35)] hover:shadow-[0_0_18px_rgba(168,85,247,0.7)] hover:scale-105 active:scale-95"
                  title="Editar nombre de usuario"
                >
                  <img
                    src="/assets/aistudio/Cmn_btnWriteIcon.png"
                    alt="Editar"
                    className="w-5 h-5 object-contain group-hover:rotate-12 transition-transform drop-shadow"
                  />
                  <span>CAMBIAR NOMBRE</span>
                </button>
              )}
            </div>

            {/* Editable Name Input / Display */}
            {isEditingName ? (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={20}
                  className="flex-1 bg-slate-950 border border-yellow-500 rounded-xl px-3 py-1.5 text-base font-black text-white focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 transition cursor-pointer flex items-center justify-center shadow-lg"
                  title="Guardar nombre"
                >
                  <img
                    src="/assets/aistudio/Cmn_btnDecide56_0313916e.png"
                    alt="Guardar"
                    className="w-5 h-5 object-contain"
                  />
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                  title="Cancelar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h3 className="text-2xl font-black text-white uppercase tracking-wide drop-shadow mb-4 flex items-center gap-2">
                <span>{userProfile.username}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 font-mono">
                  Z-LVL 1
                </span>
              </h3>
            )}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Personajes
                </span>
                <span className="text-base font-black text-white font-mono">
                  {obtainedCharacters.length} / 15
                </span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Z-Power Total
                </span>
                <span className="text-base font-black text-yellow-400 font-mono">
                  {totalZPowerSum.toLocaleString()} ZP
                </span>
              </div>
            </div>
          </div>

          {/* FAVORITE CHARACTER CARD (4: "tu personaje favorito - tienes que tenerlo en tu inventario para seleccionarlo") */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
                  PERSONAJE FAVORITO
                </span>
              </div>
              {obtainedCharacters.length > 0 && (
                <button
                  onClick={() => setIsFavoriteSelectorOpen(true)}
                  className="text-xs text-slate-300 hover:text-white font-bold underline transition cursor-pointer"
                >
                  Cambiar
                </button>
              )}
            </div>

            {favoriteChar && favoriteObtained && favoriteStarInfo ? (
              <div
                onClick={() => onInspectCharacter(favoriteChar, favoriteObtained.zPower)}
                className={`group relative rounded-xl overflow-hidden border-2 bg-slate-950 cursor-pointer p-3 transition hover:scale-[1.02] shadow-lg ${
                  favoriteChar.rarity === 'LEGENDS_LIMITED'
                    ? 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                    : favoriteChar.rarity === 'SPARKING'
                    ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'border-purple-500'
                }`}
              >
                <div className="flex gap-3">
                  {/* Portrait */}
                  <div className="relative w-24 h-28 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-black">
                    <img
                      src={favoriteChar.image}
                      alt={favoriteChar.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-1 right-1">
                      <ElementBadge element={favoriteChar.element} size="xs" showLabel={false} />
                    </div>
                  </div>

                  {/* Character Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="mb-1">
                        <RarityBadge rarity={favoriteChar.rarity} size="xs" showText={true} />
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-wide truncate">
                        {favoriteChar.fileTitle || favoriteChar.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-yellow-400 block">
                        {favoriteChar.code}
                      </span>
                    </div>

                    <div className="pt-2">
                      <StarDisplay
                        stars={favoriteStarInfo.stars}
                        isRed={favoriteStarInfo.isRed}
                        size="xs"
                        showTextLabel
                      />
                      <span className="text-[11px] font-mono font-bold text-slate-300 block mt-0.5">
                        {favoriteObtained.zPower.toLocaleString()} Z-Power
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-400 group-hover:text-yellow-300 flex items-center gap-1 transition">
                    <Eye className="w-3 h-3" />
                    <span>Toca para ver ficha</span>
                  </div>
                  <GameButton
                    variant="Buttoncommon"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFavoriteSelectorOpen(true);
                    }}
                    className="w-40 sm:w-44 h-8 sm:h-9"
                  >
                    <span className="text-white font-black text-[10px]">CAMBIAR GUERRERO</span>
                  </GameButton>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-slate-950/80 rounded-xl border border-slate-800">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-3">
                  {obtainedCharacters.length > 0
                    ? 'No has seleccionado un guerrero favorito todavía.'
                    : 'Debes desbloquear al menos un personaje en los Banners para asignarlo.'}
                </p>
                {obtainedCharacters.length > 0 ? (
                  <GameButton
                    variant="Universalbutton"
                    size="sm"
                    onClick={() => setIsFavoriteSelectorOpen(true)}
                    className="w-52 h-[48px] sm:h-[52px] mx-auto"
                  >
                    <span className="text-black font-black text-xs">
                      SELECCIONAR FAVORITO
                    </span>
                  </GameButton>
                ) : (
                  <GameButton
                    variant="Universalbutton"
                    size="sm"
                    onClick={onGoToBanners}
                    className="w-44 h-[48px] sm:h-[52px] mx-auto"
                  >
                    <span className="text-black font-black text-xs">
                      IR A BANNERS
                    </span>
                  </GameButton>
                )}
              </div>
            )}
          </div>
        </div>

        {/* COLUMN 2 & 3: SUMMON HISTORY (Últimas 10 Invocaciones) */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black uppercase text-white tracking-wide">
                  Historial de Invocaciones
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                Últimas {userProfile.summonHistory.length} de 10
              </span>
            </div>

            {/* List of last 10 summons */}
            {userProfile.summonHistory && userProfile.summonHistory.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {userProfile.summonHistory.map((entry, index) => {
                  const entryTitle = entry.character.fileTitle || entry.character.name;

                  return (
                    <motion.div
                      key={entry.id || `${entry.characterId}-${entry.timestamp}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => onInspectCharacter(entry.character)}
                      className="group p-2.5 sm:p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 cursor-pointer shadow"
                    >
                      {/* Left: Thumbnail & Badges */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Number #1..#10 */}
                        <span className="text-xs font-mono font-bold text-slate-500 w-5 text-center shrink-0">
                          #{index + 1}
                        </span>

                        {/* Portrait */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/20 bg-black">
                          <img
                            src={entry.character.image}
                            alt={entryTitle}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Title and Code */}
                        <div className="truncate">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <RarityBadge rarity={entry.rarity} size="xs" showText={false} />
                            <ElementBadge element={entry.element} size="xs" showLabel={false} />
                            <span
                              className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                                entry.isNew ? 'bg-red-600 text-white' : 'bg-slate-800 text-yellow-400'
                              }`}
                            >
                              {entry.isNew ? 'NUEVO' : 'REPETIDO'}
                            </span>
                          </div>
                          <span
                            className="block text-sm font-bold text-white uppercase truncate group-hover:text-yellow-300 transition"
                            title={entryTitle}
                          >
                            {entryTitle}
                          </span>
                          <span className="block text-[11px] font-mono text-yellow-400/90 font-bold truncate">
                            {entry.character.code}
                          </span>
                        </div>
                      </div>

                      {/* Right: Z-Power granted & Relative time */}
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs sm:text-sm font-mono font-black text-yellow-400 bg-yellow-950/40 border border-yellow-500/30 px-2 py-0.5 rounded">
                          +{entry.zPowerGranted} ZP
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 font-mono">
                          {new Date(entry.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  Sin invocaciones registradas
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  Tus invocaciones aparecerán aquí automáticamente registrando tus últimos 10 personajes obtenidos.
                </p>
                <button
                  onClick={onGoToBanners}
                  className="px-6 py-2 rounded-xl bg-yellow-500 text-black font-black uppercase text-xs tracking-wider hover:bg-yellow-400 transition cursor-pointer"
                >
                  Ir al Banner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: SELECT FAVORITE CHARACTER FROM INVENTORY */}
      {/* "tienes que tenerlo en tu inventario para seleccionarlo" */}
      <AnimatePresence>
        {isFavoriteSelectorOpen && (
          <div
            onClick={() => setIsFavoriteSelectorOpen(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-slate-900 border-2 border-yellow-500 rounded-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase text-white tracking-wide flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    Seleccionar Personaje Favorito
                  </h3>
                  <p className="text-xs text-slate-400">
                    Elige a cualquier guerrero desbloqueado en tu inventario ({obtainedCharacters.length} disponibles).
                  </p>
                </div>
                <button
                  onClick={() => setIsFavoriteSelectorOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Grid of Unlocked Characters */}
              <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
                {obtainedCharacters.map((item) => {
                  const isCurrentFavorite = item.characterId === userProfile.favoriteCharacterId;
                  const itemTitle = item.character.fileTitle || item.character.name;
                  const itemStar = calculateStarInfo(item.zPower);

                  return (
                    <div
                      key={item.characterId}
                      onClick={() => handleChooseFavorite(item.characterId)}
                      className={`relative p-2.5 rounded-xl border-2 bg-slate-950 cursor-pointer transition hover:scale-105 flex flex-col justify-between ${
                        isCurrentFavorite
                          ? 'border-yellow-400 ring-2 ring-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {isCurrentFavorite && (
                        <div className="absolute top-2 right-2 z-10 p-1 bg-yellow-500 rounded-full text-black shadow">
                          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      <div className="w-full h-28 rounded-lg overflow-hidden relative bg-black mb-2">
                        <img
                          src={item.character.image}
                          alt={itemTitle}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute top-1 left-1">
                          <ElementBadge element={item.character.element} size="xs" showLabel={false} />
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 rounded">
                          <StarDisplay stars={itemStar.stars} isRed={itemStar.isRed} size="xs" />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex justify-center mb-1">
                          <RarityBadge rarity={item.character.rarity} size="xs" showText={false} />
                        </div>
                        <span className="block text-xs font-black text-white truncate" title={itemTitle}>
                          {itemTitle}
                        </span>
                        <span className="block text-[10px] font-mono text-yellow-400 font-bold truncate">
                          {item.character.code}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer with GameButton */}
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-center">
                <GameButton
                  variant="Universalbutton"
                  size="md"
                  onClick={() => setIsFavoriteSelectorOpen(false)}
                  className="w-52 sm:w-56 h-[50px] sm:h-[54px]"
                >
                  <span className="text-black font-black text-sm tracking-wider">
                    CERRAR SELECCIÓN
                  </span>
                </GameButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
