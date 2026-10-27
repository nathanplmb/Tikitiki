import React, { useState } from 'react';
import { 
  Check, 
  FlaskConical, 
  SlidersHorizontal, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Wine,
  Sparkles,
  ShoppingBag,
  Leaf
} from 'lucide-react';
import { CreationConfig, UserBarItem } from '../types/cocktail';
import { 
  ALCOHOL_BASES, 
  MIXERS, 
  AROMATICS, 
  FLAVOR_PROFILES, 
} from '../data/ingredients';
import { sounds } from '../utils/audio';

interface LabConfiguratorProps {
  onGenerate: (config: CreationConfig) => void;
  isGenerating: boolean;
  userBar: UserBarItem[];
  initialConfig?: Partial<CreationConfig>;
}

export const LabConfigurator: React.FC<LabConfiguratorProps> = ({
  onGenerate,
  isGenerating,
  userBar,
  initialConfig,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [searchMixer, setSearchMixer] = useState<string>('');
  const [selectedMixerCategory, setSelectedMixerCategory] = useState<string>('all');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [customAlcohol, setCustomAlcohol] = useState<string>('');

  // Free text intent
  const [freeIntent, setFreeIntent] = useState<string>(initialConfig?.freeIntent || '');

  // Mocktail mode toggle
  const [isMocktailMode, setIsMocktailMode] = useState<boolean>(initialConfig?.isMocktailMode || false);

  // Form State
  const [selectedBases, setSelectedBases] = useState<string[]>(
    initialConfig?.selectedBases || ['Vodka classique']
  );
  const [singleBottleOnly, setSingleBottleOnly] = useState<boolean>(
    initialConfig?.singleBottleOnly ?? true
  );
  const [selectedMixers, setSelectedMixers] = useState<string[]>(
    initialConfig?.selectedMixers || ['Schweppes Pink Tonic']
  );
  const [selectedAromatics, setSelectedAromatics] = useState<string[]>(
    initialConfig?.selectedAromatics || ['Sirop de mûre', 'Citron vert frais (quartiers ou jus)']
  );
  const [selectedProfile, setSelectedProfile] = useState<string>(
    initialConfig?.profileName || 'Fruits noirs : mûre, cassis, myrtille'
  );
  const [fruitiness, setFruitiness] = useState<number>(initialConfig?.fruitiness || 4);
  const [sweetness, setSweetness] = useState<number>(initialConfig?.sweetness || 3);
  const [originality, setOriginality] = useState<number>(initialConfig?.originality || 3);
  const [crowdPleaser, setCrowdPleaser] = useState<boolean>(
    initialConfig?.crowdPleaser ?? true
  );

  // Advanced Filters
  const [budgetLimit, setBudgetLimit] = useState<'low' | 'medium' | 'any'>('low');
  const [servings, setServings] = useState<number>(initialConfig?.servings || 2);
  const [maxBottlesToCarry, setMaxBottlesToCarry] = useState<number>(2);
  const [useBarOnly, setUseBarOnly] = useState<boolean>(false);
  const [prepTimeMax, setPrepTimeMax] = useState<number>(5);
  const [frenchSupermarketOnly, setFrenchSupermarketOnly] = useState<boolean>(true);
  const [noSyrup, setNoSyrup] = useState<boolean>(false);
  const [noFreshFruits, setNoFreshFruits] = useState<boolean>(false);
  const [noEnergyDrinks, setNoEnergyDrinks] = useState<boolean>(true);

  // Toggle helpers
  const handleToggleBase = (name: string) => {
    sounds.playTap();
    if (singleBottleOnly) {
      setSelectedBases([name]);
    } else {
      if (selectedBases.includes(name)) {
        if (selectedBases.length > 1) {
          setSelectedBases(selectedBases.filter((b) => b !== name));
        }
      } else {
        setSelectedBases([...selectedBases, name]);
      }
    }
  };

  const handleAddCustomAlcohol = () => {
    if (customAlcohol.trim()) {
      sounds.playTap();
      if (singleBottleOnly) {
        setSelectedBases([customAlcohol.trim()]);
      } else {
        setSelectedBases([...selectedBases, customAlcohol.trim()]);
      }
      setCustomAlcohol('');
    }
  };

  const handleToggleMixer = (name: string) => {
    sounds.playTap();
    if (selectedMixers.includes(name)) {
      setSelectedMixers(selectedMixers.filter((m) => m !== name));
    } else {
      setSelectedMixers([...selectedMixers, name]);
    }
  };

  const handleToggleAromatic = (name: string) => {
    sounds.playTap();
    if (selectedAromatics.includes(name)) {
      setSelectedAromatics(selectedAromatics.filter((a) => a !== name));
    } else {
      setSelectedAromatics([...selectedAromatics, name]);
    }
  };

  const handleSubmit = () => {
    sounds.playTap();
    const config: CreationConfig = {
      freeIntent: freeIntent.trim() || undefined,
      isMocktailMode,
      selectedBases: isMocktailMode ? [] : selectedBases,
      singleBottleOnly,
      selectedMixers: selectedMixers.length > 0 ? selectedMixers : ['Eau pétillante'],
      selectedAromatics: noSyrup ? selectedAromatics.filter((a) => !a.toLowerCase().includes('sirop')) : selectedAromatics,
      profileName: selectedProfile,
      fruitiness,
      sweetness,
      originality,
      crowdPleaser,
      servings,
      advancedFilters: {
        budgetLimit,
        servings,
        maxBottlesToCarry,
        useBarOnly,
        prepTimeMax,
        frenchSupermarketOnly,
        noSyrup,
        noFreshFruits,
        noEnergyDrinks,
      },
    };
    onGenerate(config);
  };

  const filteredMixers = MIXERS.filter((m) => {
    if (noEnergyDrinks && m.isEnergyDrink) return false;
    if (selectedMixerCategory !== 'all' && m.subCategory !== selectedMixerCategory) {
      return false;
    }
    if (searchMixer.trim()) {
      return (
        m.name.toLowerCase().includes(searchMixer.toLowerCase()) ||
        m.description.toLowerCase().includes(searchMixer.toLowerCase())
      );
    }
    return true;
  });

  const steps = [
    { num: 1, title: isMocktailMode ? 'Base & Infusion' : 'Base alcoolisée' },
    { num: 2, title: 'Diluants' },
    { num: 3, title: 'Arômes & Fruits' },
    { num: 4, title: 'Profil & Équilibre' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h1 className="font-display font-bold text-2xl text-white">
              Laboratoire de Création
            </h1>
            <p className="text-xs text-slate-400">
              Compose ta boisson sur-mesure ou exprime ton envie en toute liberté.
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              setShowAdvanced(!showAdvanced)}
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              showAdvanced
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/5'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtres</span>
          </button>
        </div>

        {/* Free text intent input box */}
        <div className="p-3.5 rounded-2xl glass-panel space-y-2 border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Intention libre (optionnel) :</span>
            </span>

            {/* Mocktail Toggle Pill */}
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsMocktailMode(!isMocktailMode);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                isMocktailMode
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
              }`}
            >
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>{isMocktailMode ? 'Mode Sans Alcool (0.0%)' : 'Activer Mode Mocktail'}</span>
            </button>
          </div>

          <input
            type="text"
            placeholder="Ex : « Un cocktail acidulé et léger pour l’apéritif », « Très fruité avec des herbes fraîches »..."
            value={freeIntent}
            onChange={(e) => setFreeIntent(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      {/* Advanced Filters Drawer */}
      {showAdvanced && (
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="text-xs font-semibold text-slate-300">
            Contraintes logistiques
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 flex justify-between">
                <span>Nombre de verres :</span>
                <span className="text-white font-bold">{servings}</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value, 10))}
                className="w-full accent-white cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 flex justify-between">
                <span>Temps de prépa max :</span>
                <span className="text-white font-bold">{prepTimeMax} min</span>
              </label>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={prepTimeMax}
                onChange={(e) => setPrepTimeMax(parseInt(e.target.value, 10))}
                className="w-full accent-white cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/5">
              <input
                type="checkbox"
                checked={frenchSupermarketOnly}
                onChange={(e) => setFrenchSupermarketOnly(e.target.checked)}
                className="rounded accent-purple-400"
              />
              <span>Supermarché courant</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/5">
              <input
                type="checkbox"
                checked={noSyrup}
                onChange={(e) => setNoSyrup(e.target.checked)}
                className="rounded accent-purple-400"
              />
              <span>Sans sirop</span>
            </label>
          </div>
        </div>
      )}

      {/* Step Indicator Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-black/40 border border-white/5">
        {steps.map((s) => {
          const isCurrent = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              onClick={() => {
                sounds.playTap();
                setCurrentStep(s.num);
              }}
              className={`py-2 px-1 text-center rounded-xl text-[11px] font-medium transition-all truncate ${
                isCurrent
                  ? 'bg-white/15 text-white font-semibold'
                  : isDone
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-400'
              }`}
            >
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Step Panels */}
      <div className="p-5 rounded-3xl glass-panel border border-white/10 min-h-[380px] flex flex-col justify-between">
        {/* STEP 1: BASES */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {isMocktailMode ? (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200/90 space-y-1">
                <strong>Mode 100% Mocktail Actif :</strong> L’IA construira une véritable boisson sans alcool avec des infusions, des agrumes et du corps, sans spiritueux.
              </div>
            ) : (
              <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs">
                <span className="text-slate-300">Sélectionne ta base alcoolisée</span>
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={singleBottleOnly}
                    onChange={(e) => setSingleBottleOnly(e.target.checked)}
                    className="rounded accent-purple-400"
                  />
                  <span>1 seule bouteille</span>
                </label>
              </div>
            )}

            {!isMocktailMode && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {ALCOHOL_BASES.map((b) => {
                  const isSelected = selectedBases.includes(b.name);
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleToggleBase(b.name)}
                      className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-white/15 border-white/30 text-white shadow-sm'
                          : 'glass-panel-subtle border-white/5 text-slate-300 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{b.subCategory}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="text-xs font-bold truncate">{b.name}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isMocktailMode && (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Autre alcool (ex: Cointreau, Mezcal)..."
                  value={customAlcohol}
                  onChange={(e) => setCustomAlcohol(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAlcohol()}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={handleAddCustomAlcohol}
                  className="px-3 py-1.5 rounded-xl text-xs bg-white/10 text-white font-medium"
                >
                  Ajouter
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: MIXERS */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs text-slate-300">Choisis les diluants</span>
              <div className="relative w-44">
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="Filtrer..."
                  value={searchMixer}
                  onChange={(e) => setSearchMixer(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {filteredMixers.map((m) => {
                const isSelected = selectedMixers.includes(m.name);
                return (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMixer(m.name)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-white/15 border-white/30 text-white shadow-sm'
                        : 'glass-panel-subtle border-white/5 text-slate-300 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{m.subCategory}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-xs font-bold truncate">{m.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: AROMATICS */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs text-slate-300">
              <span>Options aromatiques (sirops, garnitures, herbes)</span>
              <span className="text-[11px] text-slate-400 font-mono">Facultatif</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {AROMATICS.map((a) => {
                const isSelected = selectedAromatics.includes(a.name);
                return (
                  <div
                    key={a.id}
                    onClick={() => handleToggleAromatic(a.name)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-white/15 border-white/30 text-white shadow-sm'
                        : 'glass-panel-subtle border-white/5 text-slate-300 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">{a.subCategory}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="text-xs font-bold truncate">{a.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: PROFILES & SLIDERS */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <div className="text-xs text-slate-300 mb-2">Univers aromatique directeur :</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
                {FLAVOR_PROFILES.map((p) => {
                  const isSelected = selectedProfile === p.name;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        sounds.playTap();
                        setSelectedProfile(p.name);
                      }}
                      className={`cursor-pointer p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white/15 border-white/30 text-white shadow-sm'
                          : 'glass-panel-subtle border-white/5 text-slate-300'
                      }`}
                    >
                      <div className="text-xs font-semibold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{p.shortTag}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Intensité fruitée :</span>
                  <span className="font-bold text-white">{fruitiness}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={fruitiness}
                  onChange={(e) => setFruitiness(parseInt(e.target.value, 10))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Niveau de douceur :</span>
                  <span className="font-bold text-white">{sweetness}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sweetness}
                  onChange={(e) => setSweetness(parseInt(e.target.value, 10))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Audace / Originalité :</span>
                  <span className="font-bold text-white">{originality}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={originality}
                  onChange={(e) => setOriginality(parseInt(e.target.value, 10))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
          {currentStep > 1 ? (
            <button
              onClick={() => {
                sounds.playTap();
                setCurrentStep(currentStep - 1);
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/5"
            >
              Précédent
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              onClick={() => {
                sounds.playTap();
                setCurrentStep(currentStep + 1);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/15 hover:bg-white/20 transition-all flex items-center gap-1"
            >
              <span>Suivant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Création...' : 'Générer les cocktails'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
