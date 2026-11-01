import React, { useState, useEffect } from 'react';
import { TitleScreen } from './components/TitleScreen';
import { Header, TabType } from './components/Header';
import { GetCrystalsView } from './components/GetCrystalsView';
import { BannerView } from './components/BannerView';
import { CharactersView } from './components/CharactersView';
import { ProfileView } from './components/ProfileView';
import { SummonAnimation } from './components/SummonAnimation';
import { CharacterModal } from './components/CharacterModal';
import { SpriteLaboratoryModal } from './components/SpriteLaboratoryModal';
import {
  CHARACTERS,
  INITIAL_CRYSTALS,
  SUMMON_COST_SINGLE,
  SUMMON_COST_MULTI,
  RARITY_RATES,
  Z_POWER_PER_PULL,
  MAX_Z_POWER,
  calculateStarInfo,
} from './data/characters';
import {
  Character,
  CharacterRarity,
  PulledCharacter,
  ObtainedCharacter,
  UserProfile,
  SummonHistoryEntry,
} from './types';
import { sound } from './utils/audio';

export default function App() {
  const [inGame, setInGame] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<TabType>('banners');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpriteLabOpen, setIsSpriteLabOpen] = useState<boolean>(false);

  // Persistence: Chrono Crystals (Starts at 2500 CC for new player)
  const [chronoCrystals, setChronoCrystals] = useState<number>(() => {
    const saved = localStorage.getItem('lbl_chrono_crystals_v1_2');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      return isNaN(parsed) ? INITIAL_CRYSTALS : parsed;
    }
    const legacy1 = localStorage.getItem('lbl_chrono_crystals_v1_1');
    if (legacy1 !== null) {
      const parsed = parseInt(legacy1, 10);
      return isNaN(parsed) ? INITIAL_CRYSTALS : parsed;
    }
    const legacy = localStorage.getItem('lbl_chrono_crystals');
    if (legacy !== null) {
      const parsedLegacy = parseInt(legacy, 10);
      return isNaN(parsedLegacy) ? INITIAL_CRYSTALS : parsedLegacy;
    }
    return INITIAL_CRYSTALS;
  });

  // Persistence: Collection of Obtained Characters with Z-Power and Star rank
  const [obtainedCharacters, setObtainedCharacters] = useState<ObtainedCharacter[]>(() => {
    const saved =
      localStorage.getItem('lbl_obtained_characters_v1_2') ||
      localStorage.getItem('lbl_obtained_characters_v1_1');
    if (saved) {
      try {
        const parsed: ObtainedCharacter[] = JSON.parse(saved);
        return parsed.map((item) => {
          const fresh = CHARACTERS.find(
            (c) => c.code === item.character?.code || c.id === item.characterId
          );
          return {
            ...item,
            character: fresh || item.character,
          };
        });
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persistence: User Profile (4: Nombre, favorito del inventario, últimas 10 invocaciones)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lbl_user_profile_v1_0_3');
    if (saved) {
      try {
        const parsed: UserProfile = JSON.parse(saved);
        // Refresh characters in history
        const updatedHistory = (parsed.summonHistory || []).map((h) => {
          const fresh = CHARACTERS.find((c) => c.id === h.characterId) || h.character;
          return { ...h, character: fresh };
        });
        return {
          username: parsed.username || 'Guerrero Z',
          favoriteCharacterId: parsed.favoriteCharacterId || null,
          summonHistory: updatedHistory,
          createdAt: parsed.createdAt || Date.now(),
        };
      } catch {
        // Fallback default
      }
    }
    return {
      username: 'Guerrero Z',
      favoriteCharacterId: null,
      summonHistory: [],
      createdAt: Date.now(),
    };
  });

  // Auto-set first favorite character if none set and player has characters
  useEffect(() => {
    if (!userProfile.favoriteCharacterId && obtainedCharacters.length > 0) {
      setUserProfile((prev) => ({
        ...prev,
        favoriteCharacterId: obtainedCharacters[0].characterId,
      }));
    }
  }, [obtainedCharacters, userProfile.favoriteCharacterId]);

  // Animation active summon state
  const [activeSummonResults, setActiveSummonResults] = useState<PulledCharacter[] | null>(null);

  // Character modal inspect state
  const [inspectedCharacter, setInspectedCharacter] = useState<{
    character: Character;
    zPower: number;
  } | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('lbl_chrono_crystals_v1_2', chronoCrystals.toString());
  }, [chronoCrystals]);

  useEffect(() => {
    localStorage.setItem('lbl_obtained_characters_v1_2', JSON.stringify(obtainedCharacters));
  }, [obtainedCharacters]);

  useEffect(() => {
    localStorage.setItem('lbl_user_profile_v1_0_3', JSON.stringify(userProfile));
  }, [userProfile]);

  // Handle adding crystals (from green button click or boost)
  const handleAddCrystals = (amount: number) => {
    setChronoCrystals((prev) => prev + amount);
  };

  // Perform Gacha Summon (Single: 100 CC, Multi: 1000 CC for 10 characters)
  const handlePerformSummon = (count: number) => {
    const totalCost = count === 10 ? SUMMON_COST_MULTI : SUMMON_COST_SINGLE * count;
    if (chronoCrystals < totalCost) {
      return;
    }

    // Deduct crystals
    setChronoCrystals((prev) => prev - totalCost);

    const extremePool = CHARACTERS.filter((c) => c.rarity === 'EXTREME');
    const sparkingPool = CHARACTERS.filter((c) => c.rarity === 'SPARKING');
    const legendsLimitedPool = CHARACTERS.filter((c) => c.rarity === 'LEGENDS_LIMITED');

    const newPulls: PulledCharacter[] = [];
    const newHistoryEntries: SummonHistoryEntry[] = [];
    const updatedObtainedMap = new Map<string, ObtainedCharacter>();

    // Copy existing obtained list into map
    obtainedCharacters.forEach((item) => {
      const fresh = CHARACTERS.find((c) => c.id === item.characterId) || item.character;
      updatedObtainedMap.set(item.characterId, { ...item, character: fresh });
    });

    let nextAcquisitionOrder = obtainedCharacters.length + 1;

    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let chosenRarity: CharacterRarity = 'EXTREME';
      let chosenPool = extremePool;

      // Drop rates: Extreme: 60%, Sparking: 35%, Legends Limited: 5%
      if (roll < RARITY_RATES.LEGENDS_LIMITED) {
        chosenRarity = 'LEGENDS_LIMITED';
        chosenPool = legendsLimitedPool;
      } else if (roll < RARITY_RATES.LEGENDS_LIMITED + RARITY_RATES.SPARKING) {
        chosenRarity = 'SPARKING';
        chosenPool = sparkingPool;
      } else {
        chosenRarity = 'EXTREME';
        chosenPool = extremePool;
      }

      // Pick randomly within that pool
      const pickedCharacter = chosenPool[Math.floor(Math.random() * chosenPool.length)];
      const zPowerGranted = Z_POWER_PER_PULL[chosenRarity] || 250;

      const existingObtained = updatedObtainedMap.get(pickedCharacter.id);
      const isNew = !existingObtained;

      const previousZPower = existingObtained ? existingObtained.zPower : 0;
      const newZPower = Math.min(MAX_Z_POWER, previousZPower + zPowerGranted);

      const prevStarInfo = calculateStarInfo(previousZPower);
      const newStarInfo = calculateStarInfo(newZPower);
      const leveledUpStar =
        !isNew &&
        (prevStarInfo.stars !== newStarInfo.stars || prevStarInfo.isRed !== newStarInfo.isRed);

      // Update obtained map
      if (isNew) {
        updatedObtainedMap.set(pickedCharacter.id, {
          characterId: pickedCharacter.id,
          character: pickedCharacter,
          zPower: newZPower,
          firstAcquiredAt: Date.now() + i,
          acquisitionOrder: nextAcquisitionOrder++,
          pullCount: 1,
          lastPulledAt: Date.now() + i,
        });
      } else {
        updatedObtainedMap.set(pickedCharacter.id, {
          ...existingObtained,
          zPower: newZPower,
          pullCount: existingObtained.pullCount + 1,
          lastPulledAt: Date.now() + i,
        });
      }

      const pulledItem: PulledCharacter = {
        instanceId: `pull-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        characterId: pickedCharacter.id,
        character: pickedCharacter,
        pulledAt: Date.now() + i,
        pullNumber: existingObtained ? existingObtained.acquisitionOrder : nextAcquisitionOrder - 1,
        rarity: chosenRarity,
        zPowerGranted,
        previousZPower,
        newZPower,
        isNew,
        leveledUpStar,
        previousStarDisplay: prevStarInfo.displayLabel,
        newStarDisplay: newStarInfo.displayLabel,
      };

      newPulls.push(pulledItem);

      // Record in summon history
      newHistoryEntries.push({
        id: `hist-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        characterId: pickedCharacter.id,
        character: pickedCharacter,
        rarity: chosenRarity,
        element: pickedCharacter.element,
        zPowerGranted,
        isNew,
        timestamp: Date.now() + i,
      });
    }

    // Persist updated list of obtained characters
    const updatedList = Array.from(updatedObtainedMap.values());
    setObtainedCharacters(updatedList);

    // Update User Profile with last 10 summons (4: "historial de tus ultimas 10 invocaciones")
    setUserProfile((prev) => {
      const combinedHistory = [...newHistoryEntries.reverse(), ...(prev.summonHistory || [])];
      const last10 = combinedHistory.slice(0, 10);
      return {
        ...prev,
        summonHistory: last10,
        favoriteCharacterId: prev.favoriteCharacterId || updatedList[0]?.characterId || null,
      };
    });

    // Launch summon sequence animation
    setActiveSummonResults(newPulls);
  };

  // Profile Updates
  const handleUpdateUsername = (newName: string) => {
    setUserProfile((prev) => ({
      ...prev,
      username: newName,
    }));
  };

  const handleSelectFavoriteCharacter = (characterId: string) => {
    setUserProfile((prev) => ({
      ...prev,
      favoriteCharacterId: characterId,
    }));
  };

  // Reset data to defaults
  const handleResetData = () => {
    localStorage.removeItem('lbl_chrono_crystals_v1_2');
    localStorage.removeItem('lbl_obtained_characters_v1_2');
    localStorage.removeItem('lbl_user_profile_v1_0_3');
    setChronoCrystals(INITIAL_CRYSTALS);
    setObtainedCharacters([]);
    setUserProfile({
      username: 'Guerrero Z',
      favoriteCharacterId: null,
      summonHistory: [],
      createdAt: Date.now(),
    });
    sound.playClick();
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const isNowMuted = sound.toggleMute();
    setIsMuted(isNowMuted);
  };

  const handleInspectCharacter = (char: Character, customZPower?: number) => {
    const fresh = CHARACTERS.find((c) => c.id === char.id) || char;
    const found = obtainedCharacters.find((o) => o.characterId === fresh.id);
    const zPower = customZPower !== undefined ? customZPower : found ? found.zPower : 600;
    setInspectedCharacter({ character: fresh, zPower });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-['Rajdhani',sans-serif] select-none flex flex-col justify-between">
      {!inGame ? (
        <TitleScreen
          onStart={() => setInGame(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenSpriteLab={() => setIsSpriteLabOpen(true)}
        />
      ) : (
        <div className="min-h-screen flex flex-col justify-between bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
          {/* Top HUD and Navigation */}
          <Header
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            chronoCrystals={chronoCrystals}
            totalCharactersCount={obtainedCharacters.length}
            username={userProfile.username}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onResetData={handleResetData}
            onReturnTitle={() => setInGame(false)}
            onOpenSpriteLab={() => setIsSpriteLabOpen(true)}
          />

          {/* Active Tab Screen */}
          <main className="flex-1 flex flex-col items-center justify-start pb-12">
            {currentTab === 'crystals' && (
              <GetCrystalsView
                chronoCrystals={chronoCrystals}
                onAddCrystals={handleAddCrystals}
                onGoToBanners={() => setCurrentTab('banners')}
              />
            )}

            {currentTab === 'banners' && (
              <BannerView
                chronoCrystals={chronoCrystals}
                onSummon={handlePerformSummon}
                onGoToGetCrystals={() => setCurrentTab('crystals')}
                onInspectCharacter={(char) => handleInspectCharacter(char)}
              />
            )}

            {currentTab === 'characters' && (
              <CharactersView
                obtainedCharacters={obtainedCharacters}
                onInspectCharacter={(char, zPower) => handleInspectCharacter(char, zPower)}
                onGoToBanners={() => setCurrentTab('banners')}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                userProfile={userProfile}
                obtainedCharacters={obtainedCharacters}
                chronoCrystals={chronoCrystals}
                onUpdateUsername={handleUpdateUsername}
                onSelectFavoriteCharacter={handleSelectFavoriteCharacter}
                onInspectCharacter={(char, zPower) => handleInspectCharacter(char, zPower)}
                onGoToBanners={() => setCurrentTab('banners')}
              />
            )}
          </main>

          {/* Active Summon Sequence Overlay */}
          {activeSummonResults && (
            <SummonAnimation
              pulledCharacters={activeSummonResults}
              onComplete={() => setActiveSummonResults(null)}
              onInspectCharacter={(char, zPower) => handleInspectCharacter(char, zPower)}
            />
          )}

          {/* Full Character Artwork Inspect Modal */}
          {inspectedCharacter && (
            <CharacterModal
              character={inspectedCharacter.character}
              zPower={inspectedCharacter.zPower}
              onClose={() => setInspectedCharacter(null)}
            />
          )}
        </div>
      )}

      {/* Dokkan Battle Chibi Sprites Preview Laboratory Modal (Isolated Concept) */}
      <SpriteLaboratoryModal
        isOpen={isSpriteLabOpen}
        onClose={() => setIsSpriteLabOpen(false)}
      />
    </div>
  );
}
