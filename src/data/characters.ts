import { Character, StarInfo } from '../types';

export const CHARACTERS: Character[] = [
  // --- EXTREME (Drop rate pool: 60%) ---
  {
    id: 'lbl01e',
    code: 'LBL01E-1',
    name: 'Fhai',
    subtitle: '',
    fileTitle: 'Fhai',
    rarity: 'EXTREME',
    image: '/assets/aistudio/LBL01E-1_4900cc4e.jpg',
    element: 'BLU',
    description: 'Guerrero joven con reflejos aumentados y gran potencial en combate cercano.',
    categories: ['Humano', "Colisión Corrosiva"],
  },
  {
    id: 'lbl03e',
    code: 'LBL03E-1',
    name: 'Celine',
    subtitle: '',
    fileTitle: 'Celine',
    rarity: 'EXTREME',
    image: '/assets/aistudio/LBL03E-1_4e91f860.jpg',
    element: 'PUR',
    description: 'Luchadora veloz de linaje majin que domina ráfagas continuas de energía destructiva.',
    categories: ['Majin', 'Regeneración', "Recontrol of the multiverse"],
  },
  {
    id: 'lbl04e',
    code: 'LBL04E-1',
    name: 'Damin',
    subtitle: 'Guerrera Saiyajin',
    fileTitle: 'Damin',
    rarity: 'EXTREME',
    image: '/assets/aistudio/LBL04E-1_61d43966.jpg',
    element: 'RED',
    description: 'Luchadora feroz con ráfagas continuas de ki y determinación inquebrantable.',
    categories: ['Saiyajin', 'Opposite Consequences', 'Bando Kaioshin maligna'],
  },
  {
    id: 'lbl06e',
    code: 'LBL06E-1',
    name: 'APC3',
    subtitle: '',
    fileTitle: 'APC3',
    rarity: 'EXTREME',
    image: '/assets/aistudio/LBL06E-1_e57b4532.jpg',
    element: 'GRN',
    description: 'Oficial táctico de élite con patada acrobática y rastreador de combate avanzado.',
    categories: ['Patrullero del tiempo', 'Legends of time', "Saiyajin"],
  },

  // --- SPARKING (Drop rate pool: 35%) ---
  {
    id: 'lbl01sp',
    code: 'LBL01SP-1',
    name: 'Beith',
    subtitle: '',
    fileTitle: 'Beith',
    rarity: 'SPARKING',
    image: '/assets/aistudio/LBL01SP-1_b077834d.jpg',
    element: 'YEL',
    description: 'Guerrero implacable envuelto en energía marcial dorada de alto impacto.',
    categories: ['Saiyajin', 'Enemigo poderoso', "Colisión Corrosiva"],
  },
  {
    id: 'lbl02sp',
    code: 'LBL02SP-1',
    name: 'Hanzom',
    subtitle: '',
    fileTitle: 'Hanzom',
    rarity: 'SPARKING',
    image: '/assets/aistudio/LBL02SP-1_14587f8f.jpg',
    element: 'GRN',
    description: 'Maestro marcial que canaliza el avatar ancestral de su linaje de combate.',
    categories: ['Superguerrero', 'Recontrol of the multiverse', "Patrullero del tiempo"],
  },
  {
    id: 'lbl03sp',
    code: 'LBL03SP-1',
    name: 'Jin',
    subtitle: '',
    fileTitle: 'Jin',
    rarity: 'SPARKING',
    image: '/assets/aistudio/LBL03SP-1_c7f38c9f.jpg',
    element: 'PUR',
    description: 'Velocista letal armada con esferas arcanas púrpuras de máxima cadencia.',
    categories: ['Majin', 'Piloto de centinela', 'Daybrake'],
  },
  {
    id: 'lbl04sp',
    code: 'LBL04SP-1',
    name: 'Dex',
    subtitle: 'Forma Final',
    fileTitle: 'Dex',
    rarity: 'SPARKING',
    image: '/assets/aistudio/LBL04SP-1_04abf07d.jpg',
    element: 'BLU',
    description: 'Emperador supremo en su máximo esplendor galáctico con destellos hiperbólicos.',
    categories: ['Demonio del Frío', 'Opposite Consequences', 'Patrullero del tiempo'],
  },
  {
    id: 'lbl05sp',
    code: 'LBL05SP-1',
    name: 'Maghumy',
    subtitle: '',
    fileTitle: 'Maghumy',
    rarity: 'SPARKING',
    image: '/assets/aistudio/LBL05SP-1_a85068aa.jpg',
    element: 'RED',
    description: 'Poder estelar concentrado capaz de distorsionar la trayectoria de ataques rivales.',
    categories: ['Majin', 'Majin Paradox'],
  },

  // --- LEGENDS LIMITED (Drop rate pool: 5%) ---
  {
    id: 'lbl00ll',
    code: 'LBL00LL-1',
    name: 'APC3',
    subtitle: 'Yasaida',
    fileTitle: 'APC3 (Yasaida)',
    rarity: 'LEGENDS_LIMITED',
    image: '/assets/aistudio/LBL00LL-1_a57b4a7d.jpg',
    element: 'BLU',
    description: 'Poder mítico Yasaida que desata una ráfaga definitiva de plasma estelar.',
    categories: ['Yasaida', 'Saiyajin', 'Patrullero del tiempo','Legends of time'],
  },
  {
    id: 'lbl01ll',
    code: 'LBL01LL-1',
    name: 'Fhai',
    subtitle: 'Nube voladora',
    fileTitle: 'Fhai (Nube voladora)',
    rarity: 'LEGENDS_LIMITED',
    image: '/assets/aistudio/LBL01LL-1_fc806799.jpg',
    element: 'GRN',
    description: 'Forma legendaria montando la nube voladora sagrada con maniobras acrobáticas perfectas.',
    categories: ['Superguerrero', 'Colisión Corrosiva'],
  },
  {
    id: 'lbl02ll',
    code: 'LBL02LL-1',
    name: 'Nick',
    subtitle: 'Super kaioken aumentado 20 veces',
    fileTitle: 'Nick (Super kaioken aumentado 20 veces)',
    rarity: 'LEGENDS_LIMITED',
    image: '/assets/aistudio/LBL02LL-1_0e54550e.jpg',
    element: 'RED',
    description: 'Aura escarlata combinada con poder saiyajin aumentado 20 veces por encima de todo límite.',
    categories: ['Saiyajin', 'Super Saiyajin', 'Recontrol of the multiverse', 'Patrullero del tiempo'],
  },
  {
    id: 'lbl03ll',
    code: 'LBL03LL-1',
    name: 'Bitz',
    subtitle: 'Piloto',
    fileTitle: 'Bitz (Piloto)',
    rarity: 'LEGENDS_LIMITED',
    image: '/assets/aistudio/LBL03LL-1_10dd92d3.jpg',
    element: 'YEL',
    description: 'Piloto intergaláctico armado con cañón de energía orbital y blindaje de alta tecnología.',
    categories: ['Piloto de centinela', 'Saiyajin', 'Daybrake'],
  },
  {
    id: 'lbl04ll',
    code: 'LBL04LL-1',
    name: 'Dino',
    subtitle: 'Super Saiyajin',
    fileTitle: 'Dino (Super saiyajin)',
    rarity: 'LEGENDS_LIMITED',
    image: '/assets/aistudio/LBL04LL-1_86dbb348.jpg',
    element: 'PUR',
    description: 'Furia dorada saiyajin que hace temblar la tierra con cada impacto colosal.',
    categories: ['Saiyajin', 'Super Saiyajin', 'Patrullero del tiempo', "Opposite Consequences"],
  },
  {
    id: 'lbl05ll',
    code: 'LBL05LL-1',
    name: 'Arthicus',
    subtitle: 'Primera Forma',
    fileTitle: 'Arthicus (Primera forma)',
    rarity: 'LEGENDS_LIMITED',
    image: '/assets/aistudio/LBL05LL-1_ef4843a6.jpg',
    element: 'RED',
    description: 'Entidad de poder incalculable que desata una supernova cósmica con un solo dedo.',
    categories: ['Demonio del Frío', 'Guerrero del más allá', 'Majin Paradox'],
  },
];

// Extract unique list of all categories across characters
export const ALL_CATEGORIES: string[] = Array.from(
  new Set(CHARACTERS.flatMap((c) => c.categories))
).sort();

export const RARITY_RATES = {
  EXTREME: 0.60,
  SPARKING: 0.35,
  LEGENDS_LIMITED: 0.05,
};

// Costs:
export const SUMMON_COST_SINGLE = 100;
export const SUMMON_COST_MULTI = 1000; // 10 pulls
export const INITIAL_CRYSTALS = 2500;

// Z-Power granted per rarity upon pull:
export const Z_POWER_PER_PULL: Record<string, number> = {
  EXTREME: 250,
  SPARKING: 600,
  LEGENDS_LIMITED: 600,
};

export const MAX_Z_POWER = 9999;

export const STAR_THRESHOLDS: {
  stars: number;
  isRed: boolean;
  requiredZPower: number;
  label: string;
}[] = [
  { stars: 1, isRed: false, requiredZPower: 100, label: '1★' },
  { stars: 2, isRed: false, requiredZPower: 200, label: '2★' },
  { stars: 3, isRed: false, requiredZPower: 400, label: '3★' },
  { stars: 4, isRed: false, requiredZPower: 700, label: '4★' },
  { stars: 5, isRed: false, requiredZPower: 1400, label: '5★' },
  { stars: 6, isRed: false, requiredZPower: 2400, label: '6★' },
  { stars: 7, isRed: false, requiredZPower: 3000, label: '7★' },
  { stars: 1, isRed: true, requiredZPower: 4000, label: '1★+' },
  { stars: 2, isRed: true, requiredZPower: 5000, label: '2★+' },
  { stars: 3, isRed: true, requiredZPower: 6000, label: '3★+' },
  { stars: 4, isRed: true, requiredZPower: 7000, label: '4★+' },
  { stars: 5, isRed: true, requiredZPower: 8000, label: '5★+' },
  { stars: 6, isRed: true, requiredZPower: 9000, label: '6★+' },
  { stars: 7, isRed: true, requiredZPower: 9999, label: '7★+ MAX' },
];

export function calculateStarInfo(zPower: number): StarInfo {
  const currentZP = Math.min(Math.max(zPower, 100), MAX_Z_POWER);

  let currentTierIndex = 0;
  for (let i = STAR_THRESHOLDS.length - 1; i >= 0; i--) {
    if (currentZP >= STAR_THRESHOLDS[i].requiredZPower) {
      currentTierIndex = i;
      break;
    }
  }

  const currentTier = STAR_THRESHOLDS[currentTierIndex];
  const nextTier =
    currentTierIndex < STAR_THRESHOLDS.length - 1
      ? STAR_THRESHOLDS[currentTierIndex + 1]
      : null;

  let progressPercent = 100;
  if (nextTier) {
    const range = nextTier.requiredZPower - currentTier.requiredZPower;
    const progress = currentZP - currentTier.requiredZPower;
    progressPercent = Math.min(100, Math.max(0, (progress / range) * 100));
  }

  return {
    stars: currentTier.stars,
    isRed: currentTier.isRed,
    displayLabel: currentTier.label,
    currentZPower: currentZP,
    thresholdZPower: currentTier.requiredZPower,
    nextThresholdZPower: nextTier ? nextTier.requiredZPower : null,
    progressPercent,
    isMax: currentTierIndex === STAR_THRESHOLDS.length - 1 && currentZP >= MAX_Z_POWER,
  };
}
