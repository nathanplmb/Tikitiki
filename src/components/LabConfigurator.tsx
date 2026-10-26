import React, { useState } from 'react';
import { 
  Check, 
  FlaskConical, 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  Flame, 
  ShoppingBag, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { CreationConfig, UserBarItem } from '../types/cocktail';
import { 
  ALCOHOL_BASES, 
  MIXERS, 
  AROMATICS, 
  FLAVOR_PROFILES, 
  FlavorProfile,
  IngredientOption 
} from '../data/ingredients';

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
  const [servings, setServings] = useState<number>(2);
  const [maxBottlesToCarry, setMaxBottlesToCarry] = useState<number>(2);
  const [useBarOnly, setUseBarOnly] = useState<boolean>(false);
  const [prepTimeMax, setPrepTimeMax] = useState<number>(5);
  const [frenchSupermarketOnly, setFrenchSupermarketOnly] = useState<boolean>(true);
  const [noSyrup, setNoSyrup] = useState<boolean>(false);
  const [noFreshFruits, setNoFreshFruits] = useState<boolean>(false);
  const [noEnergyDrinks, setNoEnergyDrinks] = useState<boolean>(true);

  // Toggle helpers
  const handleToggleBase = (name: string) => {
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
      if (singleBottleOnly) {
        setSelectedBases([customAlcohol.trim()]);
      } else {
        setSelectedBases([...selectedBases, customAlcohol.trim()]);
      }
      setCustomAlcohol('');
    }
  };

  const handleToggleMixer = (name: string) => {
    if (selectedMixers.includes(name)) {
      setSelectedMixers(selectedMixers.filter((m) => m !== name));
    } else {
      setSelectedMixers([...selectedMixers, name]);
    }
  };

  const handleToggleAromatic = (name: string) => {
    if (selectedAromatics.includes(name)) {
      setSelectedAromatics(selectedAromatics.filter((a) => a !== name));
    } else {
      setSelectedAromatics([...selectedAromatics, name]);
    }
  };

  const handleSubmit = () => {
    const config: CreationConfig = {
      selectedBases,
      singleBottleOnly,
      selectedMixers: selectedMixers.length > 0 ? selectedMixers : ['Eau pétillante'],
      selectedAromatics: noSyrup ? selectedAromatics.filter(a => !a.toLowerCase().includes('sirop')) : selectedAromatics,
      profileName: selectedProfile,
      fruitiness,
      sweetness,
      originality,
      crowdPleaser,
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
    { num: 1, title: 'Base alcoolisée', subtitle: 'L’alcool principal' },
    { num: 2, title: 'Diluants & Bulles', subtitle: 'Sodas, jus et effervescence' },
    { num: 3, title: 'Options aromatiques', subtitle: 'Sirops, fruits et touches fraîches' },
    { num: 4, title: 'Profil & Équilibre', subtitle: 'Profil de goût et intensité' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* HEADER OF THE LAB */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>CONFIGURATEUR MIXLAB</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Le Laboratoire de Création
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sélectionne tes composants pour laisser l’IA générer 3 recettes uniques et cohérentes.
          </p>
        </div>

        {/* Advanced Filters Toggle Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            showAdvanced
              ? 'bg-purple-500/20 text-purple-200 border border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <span>Affiner ma recherche</span>
          {showAdvanced && <span className="w-2 h-2 rounded-full bg-purple-400" />}
        </button>
      </div>

      {/* ADVANCED FILTERS PANEL (COLLAPSIBLE) */}
      {showAdvanced && (
        <div className="p-6 rounded-2xl glass-panel border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm font-display font-bold text-white">
              <SlidersHorizontal className="w-4 h-4 text-purple-400" />
              <span>Filtres de recherche avancés</span>
            </div>
            <span className="text-xs text-slate-400">
              Adapte les propositions à tes contraintes de soirée
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Servings */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 uppercase">
                Nombre de personnes : <span className="text-cyan-300 font-bold">{servings}</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={servings}
                onChange={(e) => setServings(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 solo</span>
                <span>2 duo</span>
                <span>4 amis</span>
                <span>8+ groupe</span>
              </div>
            </div>

            {/* Bottles to carry */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 uppercase">
                Max bouteilles à transporter : <span className="text-cyan-300 font-bold">{maxBottlesToCarry}</span>
              </label>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={maxBottlesToCarry}
                onChange={(e) => setMaxBottlesToCarry(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 ultra léger</span>
                <span>2 standard</span>
                <span>4 complet</span>
              </div>
            </div>

            {/* Preparation time */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 uppercase">
                Temps de prépa max : <span className="text-cyan-300 font-bold">{prepTimeMax} min</span>
              </label>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={prepTimeMax}
                onChange={(e) => setPrepTimeMax(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2 min express</span>
                <span>5 min standard</span>
                <span>10 min élaboré</span>
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/5">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
              <input
                type="checkbox"
                checked={frenchSupermarketOnly}
                onChange={(e) => setFrenchSupermarketOnly(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-400"
              />
              <span className="text-xs text-slate-300">
                Supermarchés français uniquement
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
              <input
                type="checkbox"
                checked={noSyrup}
                onChange={(e) => setNoSyrup(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-400"
              />
              <span className="text-xs text-slate-300">
                Sans sirop (éviter les achats)
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
              <input
                type="checkbox"
                checked={noFreshFruits}
                onChange={(e) => setNoFreshFruits(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-400"
              />
              <span className="text-xs text-slate-300">
                Sans fruits frais à découper
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] transition-all">
              <input
                type="checkbox"
                checked={noEnergyDrinks}
                onChange={(e) => setNoEnergyDrinks(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 accent-cyan-400"
              />
              <span className="text-xs text-slate-300">
                Sans boissons énergisantes
              </span>
            </label>
          </div>
        </div>
      )}

      {/* STEP PROGRESS BAR */}
      <div className="glass-panel p-3 rounded-2xl border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  isCurrent
                    ? 'bg-cyan-500/15 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-white'
                    : isCompleted
                    ? 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-slate-300'
                    : 'bg-transparent text-slate-500 border border-transparent'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-cyan-400 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{s.title}</div>
                  <div className="text-[10px] text-slate-400 truncate hidden sm:block">
                    {s.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative min-h-[460px]">
        {/* STEP 1: ALCOHOL BASE */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  Étape 1 : Choisis ta base alcoolisée
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Une seule bouteille suffit pour concevoir d’excellents cocktails signatures.
                </p>
              </div>

              {/* Single Bottle Mode Toggle */}
              <label className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 cursor-pointer hover:bg-white/[0.08] transition-all">
                <input
                  type="checkbox"
                  checked={singleBottleOnly}
                  onChange={(e) => {
                    setSingleBottleOnly(e.target.checked);
                    if (e.target.checked && selectedBases.length > 1) {
                      setSelectedBases([selectedBases[0]]);
                    }
                  }}
                  className="w-4 h-4 rounded text-cyan-400 accent-cyan-400"
                />
                <span className="text-xs text-slate-200 font-medium">
                  Mode « Une seule bouteille » (conseillé)
                </span>
              </label>
            </div>

            {/* Alcohols Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALCOHOL_BASES.map((alcohol) => {
                const isSelected = selectedBases.includes(alcohol.name);
                return (
                  <div
                    key={alcohol.id}
                    onClick={() => handleToggleBase(alcohol.name)}
                    className={`cursor-pointer p-4 rounded-2xl transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                        : 'glass-panel-interactive border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-cyan-300">
                          {alcohol.subCategory}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-cyan-400 text-black'
                              : 'border border-white/20 bg-white/5'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-base text-white">
                        {alcohol.name}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {alcohol.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-white/5 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>Rayon supermarché</span>
                      <span className="text-slate-300 capitalize">
                        {alcohol.supermarketAvailability}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Alcohol Adder */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs text-slate-300 shrink-0 font-medium">
                Autre alcool personnalisé :
              </span>
              <input
                type="text"
                placeholder="ex. Cointreau, Mezcal, Saint-Germain..."
                value={customAlcohol}
                onChange={(e) => setCustomAlcohol(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomAlcohol()}
                className="flex-1 w-full bg-slate-950/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleAddCustomAlcohol}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all shrink-0"
              >
                Ajouter
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MIXERS */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  Étape 2 : Choisis les diluants & boissons pétillantes
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tu peux en sélectionner plusieurs, mais les recettes privilégient un diluant principal pour limiter les achats.
                </p>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Chercher un diluant..."
                    value={searchMixer}
                    onChange={(e) => setSearchMixer(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'Sodas & pétillants', 'Boissons fruitées', 'Boissons énergisantes'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedMixerCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedMixerCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
                  }`}
                >
                  {cat === 'all' ? 'Tous les diluants' : cat}
                </button>
              ))}
            </div>

            {/* Energy Drink Warning Banner */}
            {!noEnergyDrinks && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-600/30 flex items-start gap-3 text-xs text-amber-200/90">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Avertissement :</strong> La caféine des boissons énergisantes peut masquer la perception de l’ivresse sans réduire l’alcoolémie. MIXLAB ne les recommande pas par défaut.
                </p>
              </div>
            )}

            {/* Mixers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredMixers.map((mixer) => {
                const isSelected = selectedMixers.includes(mixer.name);
                return (
                  <div
                    key={mixer.id}
                    onClick={() => handleToggleMixer(mixer.name)}
                    className={`cursor-pointer p-3.5 rounded-2xl transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'glass-panel-interactive border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-slate-400">
                          {mixer.subCategory}
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-cyan-400 text-black'
                              : 'border border-white/20 bg-white/5'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-sm text-white">
                        {mixer.name}
                      </h3>
                      <p className="text-xs text-slate-300">
                        {mixer.description}
                      </p>
                    </div>

                    {mixer.isEnergyDrink && (
                      <span className="mt-2 text-[10px] text-amber-400/90 font-mono">
                        Contient caféine
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: AROMATICS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
              <div>
                <h2 className="font-display font-bold text-xl text-white">
                  Étape 3 : Options aromatiques & garnitures
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Facultatif : choisis zéro, un ou plusieurs accents pour personnaliser ton mix.
                </p>
              </div>

              {/* Anti-waste advice note */}
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-mono">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Privilégie les petits formats 25cl</span>
              </div>
            </div>

            {/* Aromatics Sections */}
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-1">
              {/* Sirops */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-purple-300 flex items-center gap-2">
                  <span>Sirops aromatiques (gouttes et rondeur)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AROMATICS.filter((a) => a.category === 'sirop').map((item) => {
                    const isSelected = selectedAromatics.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleAromatic(item.name)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-purple-500/20 border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] text-white'
                            : 'glass-panel-interactive border border-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold truncate">{item.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-300 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Garnitures & Fruits */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-cyan-300 flex items-center gap-2">
                  <span>Fruits frais & garnitures</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AROMATICS.filter((a) => a.category === 'garniture').map((item) => {
                    const isSelected = selectedAromatics.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleAromatic(item.name)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-white'
                            : 'glass-panel-interactive border border-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold truncate">{item.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Autres */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-emerald-300 flex items-center gap-2">
                  <span>Herbes fraîches, glaçons & essentiels</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AROMATICS.filter((a) => a.category === 'autre').map((item) => {
                    const isSelected = selectedAromatics.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleToggleAromatic(item.name)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] text-white'
                            : 'glass-panel-interactive border border-white/10 hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold truncate">{item.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: FLAVOR PROFILE & SLIDERS */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="pb-4 border-b border-white/5">
              <h2 className="font-display font-bold text-xl text-white">
                Étape 4 : Définis ton profil aromatique & curseurs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Guide l’IA vers l’équilibre parfait entre douceur, intensité fruitée et audace.
              </p>
            </div>

            {/* 10 Flavor Profiles Grid */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-slate-400">
                Choisis un profil aromatique directeur :
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {FLAVOR_PROFILES.map((profile) => {
                  const isSelected = selectedProfile === profile.name;
                  return (
                    <div
                      key={profile.id}
                      onClick={() => setSelectedProfile(profile.name)}
                      className={`cursor-pointer p-3.5 rounded-2xl transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? `bg-slate-900/90 border-2 ${profile.borderClass} shadow-[0_0_20px_rgba(6,182,212,0.3)]`
                          : 'glass-panel-interactive border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                            {profile.shortTag}
                          </span>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: profile.color }}
                          />
                        </div>
                        <h4 className="font-display font-bold text-xs text-white leading-tight">
                          {profile.name}
                        </h4>
                        <p className="text-[10px] text-slate-300 line-clamp-3">
                          {profile.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                          <span>Sélectionné</span>
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sliders Box */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fruité */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Intensité fruitée</span>
                    <span className="text-cyan-300 font-bold">{fruitiness}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={fruitiness}
                    onChange={(e) => setFruitiness(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Légère</span>
                    <span>Modérée</span>
                    <span>Intense</span>
                  </div>
                </div>

                {/* Sucre */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Niveau de sucre</span>
                    <span className="text-fuchsia-300 font-bold">{sweetness}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={sweetness}
                    onChange={(e) => setSweetness(parseInt(e.target.value, 10))}
                    className="w-full accent-fuchsia-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Sec / Peu sucré</span>
                    <span>Équilibré</span>
                    <span>Très gourmand</span>
                  </div>
                </div>

                {/* Originalité */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">Originalité</span>
                    <span className="text-purple-300 font-bold">{originality}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={originality}
                    onChange={(e) => setOriginality(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Classique revisité</span>
                    <span>Signature</span>
                    <span>Inattendu</span>
                  </div>
                </div>
              </div>

              {/* Crowd Pleaser preference */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">
                    Préférence de groupe consensuelle
                  </div>
                  <div className="text-[11px] text-slate-400">
                    « Je veux que plusieurs personnes puissent aimer ce cocktail »
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={crowdPleaser}
                    onChange={(e) => setCrowdPleaser(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP FOOTER NAVIGATION & GENERATE BUTTON */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all ml-auto sm:ml-0"
              >
                <span>Étape suivante</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* MAIN GENERATE COCKTAILS BUTTON */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl font-display font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-300 hover:from-cyan-300 hover:to-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.6)] disabled:opacity-50 active:scale-[0.98]"
          >
            <FlaskConical className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating ? 'Analyse & Génération IA...' : 'Générer mes 3 cocktails'}
            </span>
            <Sparkles className="w-4 h-4 text-purple-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
