import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Filter,
  ArrowUpDown,
  Eye,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ObtainedCharacter, Character, ElementType } from '../types';
import { calculateStarInfo, ALL_CATEGORIES } from '../data/characters';
import { StarDisplay } from './StarDisplay';
import { ElementBadge, ELEMENT_ASSETS } from './ElementBadge';
import { RarityBadge } from './RarityBadge';
import { GameButton } from './GameButton';
import { sound } from '../utils/audio';

type SortCriterion = 'ACQUISITION' | 'Z_POWER' | 'ALPHABETICAL';

interface CharactersViewProps {
  obtainedCharacters: ObtainedCharacter[];
  onInspectCharacter: (char: Character, zPower?: number) => void;
  onGoToBanners: () => void;
}

export const CharactersView: React.FC<CharactersViewProps> = ({
  obtainedCharacters,
  onInspectCharacter,
  onGoToBanners,
}) => {
  // Filters state (3.2: rareza, color, categorías)
  const [filterRarity, setFilterRarity] = useState<string>('ALL');
  const [filterElement, setFilterElement] = useState<string>('ALL');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);

  // Sorting state
  const [sortCriterion, setSortCriterion] = useState<SortCriterion>('ACQUISITION');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter list by Rarity, Color/Element, and Categories
  const filteredList = useMemo(() => {
    return obtainedCharacters.filter((item) => {
      // 1. Rarity filter
      if (filterRarity !== 'ALL' && item.character.rarity !== filterRarity) {
        return false;
      }

      // 2. Element/Color filter
      if (filterElement !== 'ALL' && item.character.element !== filterElement) {
        return false;
      }

      // 3. Categories filter (if any are selected, character must have AT LEAST ONE of selected categories)
      if (selectedCategories.length > 0) {
        const charCats = item.character.categories || [];
        const hasMatchingCat = selectedCategories.some((cat) => charCats.includes(cat));
        if (!hasMatchingCat) return false;
      }

      return true;
    });
  }, [obtainedCharacters, filterRarity, filterElement, selectedCategories]);

  // Sort list according to chosen criterion and direction
  const sortedList = useMemo(() => {
    return [...filteredList].sort((a, b) => {
      let comparison = 0;

      if (sortCriterion === 'ACQUISITION') {
        comparison = a.acquisitionOrder - b.acquisitionOrder;
      } else if (sortCriterion === 'Z_POWER') {
        comparison = a.zPower - b.zPower;
      } else if (sortCriterion === 'ALPHABETICAL') {
        const nameA = a.character.fileTitle || a.character.name;
        const nameB = b.character.fileTitle || b.character.name;
        comparison = nameA.localeCompare(nameB);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredList, sortCriterion, sortDirection]);

  // Category search matches
  const filteredAvailableCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return ALL_CATEGORIES;
    return ALL_CATEGORIES.filter((cat) =>
      cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categorySearchQuery]);

  // Calculate count of characters that belong to each category
  const categoryCharacterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_CATEGORIES.forEach((cat) => {
      counts[cat] = obtainedCharacters.filter((item) =>
        (item.character.categories || []).includes(cat)
      ).length;
    });
    return counts;
  }, [obtainedCharacters]);

  // Toggle category in selection
  const handleToggleCategory = (category: string) => {
    sound.playClick();
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleResetFilters = () => {
    sound.playClick();
    setFilterRarity('ALL');
    setFilterElement('ALL');
    setSelectedCategories([]);
    setCategorySearchQuery('');
  };

  const hasActiveFilters =
    filterRarity !== 'ALL' || filterElement !== 'ALL' || selectedCategories.length > 0;

  // Stats calculation
  const totalUnlocked = obtainedCharacters.length;
  const llCount = obtainedCharacters.filter((p) => p.character.rarity === 'LEGENDS_LIMITED').length;
  const spCount = obtainedCharacters.filter((p) => p.character.rarity === 'SPARKING').length;
  const exCount = obtainedCharacters.filter((p) => p.character.rarity === 'EXTREME').length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 font-['Rajdhani',sans-serif]">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            INVENTARIO DE PERSONAJES DESBLOQUEADOS
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
            Colección de Guerreros
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Filtra por <span className="text-yellow-400 font-bold">Rareza</span>,{' '}
            <span className="text-blue-400 font-bold">Color Elemental</span> o{' '}
            <span className="text-cyan-400 font-bold">Categorías</span> para ver las coincidencias en común.
          </p>
        </div>

        {/* Stats Pills Bar with Official Rarity Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[70px]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Obtenidos</span>
            <span className="text-base font-black text-white font-mono">{totalUnlocked}/15</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-yellow-950/40 border border-yellow-500/40 text-center min-w-[85px] flex flex-col items-center">
            <div className="flex items-center gap-1">
              <img
                src="/assets/aistudio/Gas_txtLfinish_bc8a0524.png"
                alt="LF"
                className="h-3.5 w-auto object-contain"
              />
              <span className="text-[10px] text-yellow-400 uppercase font-bold">L. Limited</span>
            </div>
            <span className="text-base font-black text-yellow-300 font-mono">{llCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center min-w-[85px] flex flex-col items-center">
            <div className="flex items-center gap-1">
              <img
                src="/assets/aistudio/MChaIco_txtRaritySP_a14348fa.png"
                alt="SP"
                className="h-3.5 w-auto object-contain"
              />
              <span className="text-[10px] text-amber-400 uppercase font-bold">Sparking</span>
            </div>
            <span className="text-base font-black text-amber-300 font-mono">{spCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-center min-w-[85px] flex flex-col items-center">
            <div className="flex items-center gap-1">
              <img
                src="/assets/aistudio/MChaIco_txtRarityEX_96cacc07.png"
                alt="EX"
                className="h-3.5 w-auto object-contain"
              />
              <span className="text-[10px] text-purple-400 uppercase font-bold">Extreme</span>
            </div>
            <span className="text-base font-black text-purple-300 font-mono">{exCount}</span>
          </div>
        </div>
      </div>

      {/* MULTI-FACETED FILTER & SORT CONTROL BAR (3.2) */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3.5 mb-6 shadow-xl">
        {/* ROW 1: Rarity, Element/Color, and Category Dropdown Toggle */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* 1. RARITY FILTERS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              RAREZA:
            </span>
            {[
              { key: 'ALL', label: 'Todas', icon: null },
              {
                key: 'LEGENDS_LIMITED',
                label: 'L. Limited',
                icon: '/assets/aistudio/Gas_txtLfinish_bc8a0524.png',
              },
              {
                key: 'SPARKING',
                label: 'Sparking',
                icon: '/assets/aistudio/MChaIco_txtRaritySP_a14348fa.png',
              },
              {
                key: 'EXTREME',
                label: 'Extreme',
                icon: '/assets/aistudio/MChaIco_txtRarityEX_96cacc07.png',
              },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  sound.playClick();
                  setFilterRarity(item.key);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer ${
                  filterRarity === item.key
                    ? 'bg-yellow-500 text-black shadow font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {item.icon && (
                  <img src={item.icon} alt={item.label} className="h-3 w-auto object-contain" />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* 2. COLOR / ELEMENT FILTERS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-black uppercase text-slate-400 mr-1">COLOR:</span>
            <button
              onClick={() => {
                sound.playClick();
                setFilterElement('ALL');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                filterElement === 'ALL'
                  ? 'bg-blue-600 text-white font-black shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              Todos
            </button>
            {(['RED', 'YEL', 'PUR', 'GRN', 'BLU'] as ElementType[]).map((elem) => {
              const asset = ELEMENT_ASSETS[elem];
              const isActive = filterElement === elem;

              return (
                <button
                  key={elem}
                  onClick={() => {
                    sound.playClick();
                    setFilterElement(isActive ? 'ALL' : elem);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black uppercase transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-slate-950 border-white shadow-lg scale-105'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 text-slate-300'
                  }`}
                  title={`Filtrar por elemento ${elem}`}
                >
                  <img src={asset.image} alt={elem} className="w-4 h-3.5 object-contain" />
                  <span className={asset.textColor}>{elem}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Category Dropdown Trigger + Sorting Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          {/* CATEGORIES DROPDOWN TRIGGER BUTTON */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick();
                setIsCategoryDropdownOpen((prev) => !prev);
              }}
              className={`flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategories.length > 0
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  Categorías{' '}
                  {selectedCategories.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500 text-black font-black text-[10px]">
                      {selectedCategories.length}
                    </span>
                  )}
                </span>
              </div>
              {isCategoryDropdownOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* SORTING CONTROLS */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => {
                  sound.playClick();
                  setSortCriterion('ACQUISITION');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  sortCriterion === 'ACQUISITION'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Ordenar por orden de obtención"
              >
                Obtención
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSortCriterion('Z_POWER');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  sortCriterion === 'Z_POWER'
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Ordenar por cantidad de Z-Power"
              >
                Z-Power
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setSortCriterion('ALPHABETICAL');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  sortCriterion === 'ALPHABETICAL'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Ordenar alfabéticamente"
              >
                Alfabético
              </button>
            </div>

            {/* Ascending / Descending Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-yellow-400 text-xs font-black uppercase tracking-wider transition-colors border border-slate-700 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortDirection === 'asc' ? '▲ Asc' : '▼ Desc'}</span>
            </button>
          </div>
        </div>

        {/* CATEGORIES COLLAPSIBLE SEARCH & SELECT PANEL */}
        <AnimatePresence>
          {isCategoryDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-2 border-t border-slate-800 flex flex-col gap-2.5"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {/* Search box for categories */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    placeholder="Buscar categorías (ej. Saiyajin, Majin...)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
                  />
                  {categorySearchQuery && (
                    <button
                      onClick={() => setCategorySearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Clear categories button */}
                {selectedCategories.length > 0 && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold self-start sm:self-auto cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Limpiar categorías seleccionadas ({selectedCategories.length})</span>
                  </button>
                )}
              </div>

              {/* Grid of category chips */}
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 bg-black/40 rounded-xl border border-slate-800">
                {filteredAvailableCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  const countInInventory = categoryCharacterCounts[cat] || 0;

                  return (
                    <button
                      key={cat}
                      onClick={() => handleToggleCategory(cat)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500 text-black font-black shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : null}
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1 rounded font-mono ${
                          isSelected ? 'bg-black/30 text-black' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {countInInventory}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMBINED FILTER SUMMARY & MATCH COUNTER (3.2: "ver la cantidad de personajes que tienen esa/s características en común") */}
        <div className="flex items-center justify-between bg-black/60 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Coincidencias encontradas:</span>
            <span className="font-mono font-black text-yellow-400 text-sm">
              {sortedList.length} de {obtainedCharacters.length} personajes
            </span>
            {hasActiveFilters && (
              <span className="text-[11px] text-cyan-400 hidden sm:inline">
                (Filtros activos: {filterRarity !== 'ALL' ? `[${filterRarity}] ` : ''}
                {filterElement !== 'ALL' ? `[${filterElement}] ` : ''}
                {selectedCategories.length > 0 ? `[${selectedCategories.join(', ')}]` : ''})
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Characters (Icons / Ordered Cards) */}
      {sortedList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {sortedList.map((item) => {
            const starInfo = calculateStarInfo(item.zPower);
            const displayTitle = item.character.fileTitle || item.character.name;

            return (
              <motion.div
                key={item.characterId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  sound.playClick();
                  onInspectCharacter(item.character, item.zPower);
                }}
                className={`group relative rounded-xl overflow-hidden border-2 bg-slate-900 cursor-pointer transition-all duration-200 hover:scale-105 hover:z-20 shadow-lg flex flex-col justify-between ${
                  item.character.rarity === 'LEGENDS_LIMITED'
                    ? 'border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                    : item.character.rarity === 'SPARKING'
                    ? 'border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'border-purple-500/70 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                }`}
              >
                {/* Acquisition order badge (#1, #2...) */}
                <div className="absolute top-1.5 left-1.5 z-20 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-black font-mono text-yellow-300 border border-yellow-500/40 shadow">
                  #{item.acquisitionOrder}
                </div>

                {/* OFFICIAL ELEMENT COLOR ICON in the Element Zone of each card */}
                <div className="absolute top-1.5 right-1.5 z-20">
                  <ElementBadge element={item.character.element} size="xs" showLabel={false} />
                </div>

                {/* Character Thumbnail Image Container */}
                <div className="w-full h-36 sm:h-44 overflow-hidden bg-black relative">
                  <img
                    src={item.character.image}
                    alt={displayTitle}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Stars Overlay right on the card image */}
                  <div className="absolute bottom-1.5 left-1.5 z-20 bg-black/85 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/20">
                    <StarDisplay
                      stars={starInfo.stars}
                      isRed={starInfo.isRed}
                      size="xs"
                      showTextLabel
                    />
                  </div>

                  {/* Hover icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-2 rounded-full bg-yellow-500 text-black shadow-lg">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Official Rarity Badge Banner strip */}
                <div className="w-full flex items-center justify-center py-1 bg-slate-950 border-y border-slate-800">
                  <RarityBadge rarity={item.character.rarity} size="xs" showText={true} />
                </div>

                {/* Card Info & Z-Power Footer with Code at the bottom */}
                <div className="p-2.5 bg-gradient-to-b from-slate-950 to-black flex flex-col justify-between gap-1.5">
                  <div>
                    <span
                      className="block text-xs font-black text-white truncate uppercase"
                      title={displayTitle}
                    >
                      {displayTitle}
                    </span>
                    <span className="block text-[10px] font-mono text-yellow-400 font-bold truncate">
                      {item.character.code}
                    </span>
                  </div>

                  {/* Categories badges (First 2 categories) */}
                  {item.character.categories && item.character.categories.length > 0 && (
                    <div className="flex items-center gap-1 overflow-hidden">
                      {item.character.categories.slice(0, 2).map((c) => (
                        <span
                          key={c}
                          className="text-[9px] text-cyan-300 bg-slate-900 border border-slate-700/80 px-1 rounded truncate max-w-[70px]"
                        >
                          {c}
                        </span>
                      ))}
                      {item.character.categories.length > 2 && (
                        <span className="text-[9px] text-slate-400 font-mono">
                          +{item.character.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Z-Power Progress Bar */}
                  <div className="w-full bg-slate-900 rounded p-1 border border-slate-800">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold leading-none mb-1">
                      <span className="text-slate-400">ZP:</span>
                      <span className="text-yellow-400">{item.zPower.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          starInfo.isRed
                            ? 'bg-gradient-to-r from-red-500 to-amber-400'
                            : 'bg-gradient-to-r from-yellow-500 to-amber-300'
                        }`}
                        style={{ width: `${Math.min(100, (item.zPower / 9999) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
            <Users className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {hasActiveFilters
              ? 'No se encontraron personajes con estos filtros'
              : 'No tienes personajes desbloqueados aún'}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {hasActiveFilters
              ? 'Prueba a seleccionar otros criterios de rareza, color o categorías.'
              : 'Ve al apartado de Banners para invocar a tus primeros guerreros utilizando tus Cronocristales.'}
          </p>
          {hasActiveFilters ? (
            <div className="flex justify-center">
              <GameButton
                variant="Buttoncommon"
                size="md"
                onClick={handleResetFilters}
                className="w-56 sm:w-60 h-[50px] sm:h-[54px]"
              >
                <span className="text-white font-black text-xs tracking-wider">
                  RESTABLECER FILTROS
                </span>
              </GameButton>
            </div>
          ) : (
            <div className="flex justify-center">
              <GameButton
                variant="Universalbutton"
                size="md"
                onClick={() => {
                  sound.playClick();
                  onGoToBanners();
                }}
                className="w-56 sm:w-60 h-[50px] sm:h-[54px]"
              >
                <span className="text-black font-black text-sm tracking-wider">
                  IR A BANNERS
                </span>
              </GameButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
