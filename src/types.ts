export type CharacterRarity = 'HERO' | 'EXTREME' | 'SPARKING' | 'LEGENDS_LIMITED';

export type ElementType = 'RED' | 'YEL' | 'PUR' | 'GRN' | 'BLU';

export interface Character {
  id: string;
  code: string; // e.g. "LBL04SP-1"
  name: string; // e.g. "Dex" or "Nick"
  subtitle: string;
  fileTitle: string; // The exact title as given in the file (e.g. "Nick (Super kaioken aumentado 20 veces)")
  rarity: CharacterRarity;
  image: string;
  element: ElementType;
  description: string;
  categories: string[]; // e.g. ['Saiyajin', 'Super saiyajin', 'Guerrero Z']
}

export interface ObtainedCharacter {
  characterId: string;
  character: Character;
  zPower: number; // 100 to 9,999 max
  firstAcquiredAt: number;
  acquisitionOrder: number; // #1, #2, #3...
  pullCount: number; // number of times pulled
  lastPulledAt: number;
}

export interface PulledCharacter {
  instanceId: string;
  characterId: string;
  character: Character;
  pulledAt: number;
  pullNumber: number;
  rarity: CharacterRarity;
  zPowerGranted: number; // 250 for EX, 600 for SP/LL
  previousZPower: number;
  newZPower: number;
  isNew: boolean;
  leveledUpStar: boolean;
  previousStarDisplay?: string;
  newStarDisplay?: string;
}

export interface StarInfo {
  stars: number; // 1 to 7
  isRed: boolean; // false = gold stars (1-7), true = red stars (1+ to 7+)
  displayLabel: string; // "1★", "7★", "1★+", "7★+ MAX"
  currentZPower: number;
  thresholdZPower: number;
  nextThresholdZPower: number | null;
  progressPercent: number;
  isMax: boolean;
}

export interface SummonHistoryEntry {
  id: string;
  characterId: string;
  character: Character;
  rarity: CharacterRarity;
  element: ElementType;
  zPowerGranted: number;
  isNew: boolean;
  timestamp: number;
}

export interface UserProfile {
  username: string;
  favoriteCharacterId: string | null;
  summonHistory: SummonHistoryEntry[]; // Last 10 summons
  createdAt: number;
}
