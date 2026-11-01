import { ElementType, CharacterRarity } from '../types';

export interface DokkanSpriteData {
  id: string;
  code: string;
  name: string;
  title: string;
  subtitle: string;
  element: ElementType;
  rarity: CharacterRarity;
  originalImage: string;
  spriteImage: string;
  dokkanClass: 'SUPER' | 'EXTREME';
  specialAttackName: string;
  superAttackQuote: string;
  leaderSkill: string;
  passiveSkillName: string;
  passiveEffect: string;
  combatRole: string;
  auraColors: {
    primary: string;
    secondary: string;
    glow: string;
    border: string;
  };
}

export const DOKKAN_SPRITES: DokkanSpriteData[] = [
  {
    id: 'lbl02ll',
    code: 'LBL02LL-1',
    name: 'Nick',
    title: 'Nick (Super Kaioken x20)',
    subtitle: 'Furia Escarlata Más Allá del Límite',
    element: 'RED',
    rarity: 'LEGENDS_LIMITED',
    originalImage: '/assets/aistudio/LBL02LL-1_0e54550e.jpg',
    spriteImage: '/assets/sprites/sprite_nick_kaioken.jpg',
    dokkanClass: 'SUPER',
    specialAttackName: '¡Super Kamehameha Kaioken x20 Colosal!',
    superAttackQuote: '«¡¡¡Kaioken aumentado veinte veces... no dejaré que destruyas este universo!!!»',
    leaderSkill: 'Ki +3 y ATK & DEF +170% para la categoría "Patrullero del Tiempo" o "Super Saiyajin"',
    passiveSkillName: 'Tensión Corporal Desbordante',
    passiveEffect: 'ATK +180% en el inicio del turno; +50% adicional al lanzar el Ataque Definitivo con gran probabilidad de crítico.',
    combatRole: 'Ofensivo Pesado / Rompedor de Defensas',
    auraColors: {
      primary: '#ef4444',
      secondary: '#dc2626',
      glow: 'rgba(239, 68, 68, 0.75)',
      border: '#f87171',
    },
  },
  {
    id: 'lbl00ll',
    code: 'LBL00LL-1',
    name: 'APC3',
    title: 'APC3 (Yasaida)',
    subtitle: 'Linaje Imperial del Espacio y Tiempo',
    element: 'BLU',
    rarity: 'LEGENDS_LIMITED',
    originalImage: '/assets/aistudio/LBL00LL-1_a57b4a7d.jpg',
    spriteImage: '/assets/sprites/sprite_apc_yasaida.jpg',
    dokkanClass: 'SUPER',
    specialAttackName: 'Esfera Astral de Plasma Cósmico',
    superAttackQuote: '«El rastreador marca un nivel inconmensurable... ¡Observa el poder puro de Yasaida!»',
    leaderSkill: 'Ki +3, PS, ATK & DEF +180% para la categoría "Legends of Time" o "Yasaida"',
    passiveSkillName: 'Dominio de Plasma Estelar',
    passiveEffect: 'Reduce el daño recibido un 40%; contraataca con potencia extrema al recibir un súper ataque enemigo.',
    combatRole: 'Tanque Táctico & Contraataque Estelar',
    auraColors: {
      primary: '#06b6d4',
      secondary: '#3b82f6',
      glow: 'rgba(6, 182, 212, 0.75)',
      border: '#38bdf8',
    },
  },
  {
    id: 'lbl04ll',
    code: 'LBL04LL-1',
    name: 'Dino',
    title: 'Dino (Super Saiyajin)',
    subtitle: 'Impacto Devastador Dorado',
    element: 'PUR',
    rarity: 'LEGENDS_LIMITED',
    originalImage: '/assets/aistudio/LBL04LL-1_86dbb348.jpg',
    spriteImage: '/assets/sprites/sprite_dino_ssj.jpg',
    dokkanClass: 'SUPER',
    specialAttackName: 'Puño Gigante de Furia Dorada',
    superAttackQuote: '«¡¡¡Se acabó la charla... este golpe atravesará todas tus defensas!!!»',
    leaderSkill: 'Ki +4 y ATK +200% para la categoría "Poder Devastador"',
    passiveSkillName: 'Furia Inquebrantable',
    passiveEffect: 'Lanza hasta 2 ataques adicionales con probabilidad media de convertirse en súper ataque.',
    combatRole: 'Daño en Cadena / Rematador',
    auraColors: {
      primary: '#eab308',
      secondary: '#a855f7',
      glow: 'rgba(234, 179, 8, 0.75)',
      border: '#facc15',
    },
  },
  {
    id: 'lbl01ll',
    code: 'LBL01LL-1',
    name: 'Fhai',
    title: 'Fhai (Nube Voladora)',
    subtitle: 'Acrobacia Sagrada en los Cielos',
    element: 'GRN',
    rarity: 'LEGENDS_LIMITED',
    originalImage: '/assets/aistudio/LBL01LL-1_fc806799.jpg',
    spriteImage: '/assets/sprites/sprite_fhai_nimbus.jpg',
    dokkanClass: 'SUPER',
    specialAttackName: 'Ráfaga de Viento con Báculo Sagrado',
    superAttackQuote: '«¡Kinto-un, a máxima velocidad! ¡Nadie puede escapar de mi báculo sagrado!»',
    leaderSkill: 'Ki +3, ATK & DEF +160% para guerreros de agilidad extrema',
    passiveSkillName: 'Maniobra Celeste Libre',
    passiveEffect: 'Gran probabilidad de evasión de cualquier ataque; otorga Ki +3 y ATK +40% a todos los aliados.',
    combatRole: 'Soporte de Evasión & Velocidad',
    auraColors: {
      primary: '#22c55e',
      secondary: '#10b981',
      glow: 'rgba(34, 197, 94, 0.75)',
      border: '#4ade80',
    },
  },
  {
    id: 'lbl04sp',
    code: 'LBL04SP-1',
    name: 'Dex',
    title: 'Dex (Forma Final)',
    subtitle: 'Emperador Tirano del Frío Galáctico',
    element: 'BLU',
    rarity: 'SPARKING',
    originalImage: '/assets/aistudio/LBL04SP-1_04abf07d.jpg',
    spriteImage: '/assets/sprites/sprite_dex_emperor.jpg',
    dokkanClass: 'EXTREME',
    specialAttackName: 'Supernova del Fin del Mundo',
    superAttackQuote: '«Insectos insolentes... contemplen el glorioso fin de su insignificante galaxia.»',
    leaderSkill: 'Ki +3 y ATK & DEF +160% para la categoría "Demonio del Frío" o "Enemigo Poderoso"',
    passiveSkillName: 'Tiranía Absoluta del Frío',
    passiveEffect: 'Disminuye el ATK & DEF de los enemigos un 30%; inflige daño masivo a todos los objetivos.',
    combatRole: 'Control de Campo / Debuff Global',
    auraColors: {
      primary: '#38bdf8',
      secondary: '#9333ea',
      glow: 'rgba(147, 51, 234, 0.75)',
      border: '#a855f7',
    },
  },
];
