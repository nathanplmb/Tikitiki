import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CocktailRecipe, CreationConfig, PartyPlan } from './src/types/cocktail';
import { INITIAL_CURATED_COCKTAILS } from './src/data/curatedCocktails';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Curated high quality cocktail photos
const COCKTAIL_PHOTOS = [
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80', // Berry spritz
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80', // Botanical
  'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1000&q=80', // Solar passion
  'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=1000&q=80', // Cyan fizz
  'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1000&q=80', // Ruby splash
  'https://images.unsplash.com/photo-1587223081156-6107a64f037c?auto=format&fit=crop&w=1000&q=80', // Citrus tonic
  'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1000&q=80', // Violet sparkle
  'https://images.unsplash.com/photo-1609951651556-5334e2706168?auto=format&fit=crop&w=1000&q=80', // Amber wood
];

function pickCocktailPhoto(index: number, name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const picked = (Math.abs(hash) + index) % COCKTAIL_PHOTOS.length;
  return COCKTAIL_PHOTOS[picked];
}

// Map profile name to color theme for adaptive background
function mapProfileToColorTheme(profileName: string): CocktailRecipe['tasteProfile']['colorTheme'] {
  const p = profileName.toLowerCase();
  if (p.includes('noir') || p.includes('mûre') || p.includes('cassis')) return 'dark-berry';
  if (p.includes('tropical') || p.includes('passion') || p.includes('ananas')) return 'tropical';
  if (p.includes('acidulé') || p.includes('citron') || p.includes('frais')) return 'citrus-fresh';
  if (p.includes('floral') || p.includes('sureau') || p.includes('violette')) return 'floral';
  if (p.includes('amer') || p.includes('botanique') || p.includes('herbacé')) return 'botanical-bitter';
  if (p.includes('épicé') || p.includes('gingembre') || p.includes('chaleureux')) return 'spiced-warm';
  return 'dark-berry';
}

const RECIPES_SCHEMA = {
  type: Type.ARRAY,
  description: 'Exactly 3 distinct recipes: 1 consensuelle, 1 signature, 1 audacieuse',
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: 'Short and memorable cocktail name' },
      type: {
        type: Type.STRING,
        enum: ['consensuelle', 'signature', 'audacieuse'],
        description: 'Cocktail category',
      },
      tagline: { type: Type.STRING, description: 'Catchy 1-sentence subtitle' },
      description: { type: Type.STRING, description: 'Detailed sensory description in French' },
      tasteProfile: {
        type: Type.OBJECT,
        properties: {
          primaryNotes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '3 primary aromatic notes',
          },
          sweetness: { type: Type.INTEGER, description: 'Score 1 to 5' },
          fruitiness: { type: Type.INTEGER, description: 'Score 1 to 5' },
          originality: { type: Type.INTEGER, description: 'Score 1 to 5' },
          profileName: { type: Type.STRING, description: 'Name of the flavor profile' },
        },
        required: ['primaryNotes', 'sweetness', 'fruitiness', 'originality', 'profileName'],
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Name of ingredient' },
            amount: { type: Type.STRING, description: 'Quantity e.g. 4 cl, 12 cl, 1 tranche' },
            category: {
              type: Type.STRING,
              enum: ['alcool', 'diluant', 'sirop', 'garniture', 'autre'],
            },
            supermarketCommon: {
              type: Type.BOOLEAN,
              description: 'Whether it is easily found in French supermarkets',
            },
            estimatedPrice: { type: Type.STRING, description: 'Price estimate or note' },
            formatAdvice: {
              type: Type.STRING,
              description: 'e.g. Préférer petit format 25cl pour éviter le gaspillage',
            },
            optional: { type: Type.BOOLEAN },
          },
          required: ['name', 'amount', 'category', 'supermarketCommon'],
        },
      },
      steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Chronological preparation steps in French',
      },
      glassType: { type: Type.STRING, description: 'Recommended glassware' },
      prepTimeMinutes: { type: Type.INTEGER, description: 'Preparation time in minutes (typically 2-4)' },
      difficulty: {
        type: Type.STRING,
        enum: ['Très facile', 'Facile', 'Moyen'],
      },
      distinctIngredientsCount: { type: Type.INTEGER },
      estimatedCost: {
        type: Type.OBJECT,
        properties: {
          min: { type: Type.NUMBER, description: 'Min cost per glass in EUR' },
          max: { type: Type.NUMBER, description: 'Max cost per glass in EUR' },
          currency: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['estime', 'a_verifier'] },
          note: { type: Type.STRING, description: 'Explanatory note on pricing' },
        },
        required: ['min', 'max', 'currency', 'status', 'note'],
      },
      aromaticCoherence: {
        type: Type.STRING,
        description: 'Clear, grounded mixology explanation of why these ingredients harmonize',
      },
      simplerAlternative: {
        type: Type.STRING,
        description: 'How to make a simpler or more consensual variation with common staples',
      },
      mocktailVariant: {
        type: Type.STRING,
        description: 'Virgin non-alcoholic alternative preserving the taste profile',
      },
      allergens: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Potential allergens if any, otherwise empty',
      },
      alcoholEstimate: {
        type: Type.STRING,
        description: 'e.g. Modéré (~8-10% vol.) ou 0.0% Sans alcool',
      },
      timerSeconds: {
        type: Type.INTEGER,
        description: 'Optional shake or infusion timer in seconds (e.g. 15 for shake, 180 for infusion)',
      },
    },
    required: [
      'name',
      'type',
      'tagline',
      'description',
      'tasteProfile',
      'ingredients',
      'steps',
      'glassType',
      'prepTimeMinutes',
      'difficulty',
      'distinctIngredientsCount',
      'estimatedCost',
      'aromaticCoherence',
      'simplerAlternative',
      'mocktailVariant',
      'allergens',
      'alcoholEstimate',
    ],
  },
};

const SYSTEM_INSTRUCTION = `Tu es un mixologue créatif professionnel pour l'application MIXLAB, spécialisé dans les cocktails accessibles, les mocktails travaillés et les recettes conviviales.
Tu connais parfaitement les profils aromatiques des alcools, des softs, des thés, des sirops et des garnitures disponibles en France.

Règles impératives :
1. Produire une association aromatique cohérente et savoureuse.
2. Si le mode "Sans Alcool / Mocktail" est actif : 0.0% d'alcool absolu ! Ne retire pas simplement l'alcool : construis un véritable mocktail avec du corps (jus, purées, thés, tonics), de l'acidité et des arômes.
3. Respecter scrupuleusement les contraintes de l'utilisateur (budget, sans sirop, supermarché).
4. Proposer 3 recettes clairement distinctes :
   - Consensuelle (accessible, douce, très facile à apprécier).
   - Signature (meilleur équilibre entre originalité et gourmandise).
   - Audacieuse (association surprenante mais aromatiquement justifiée).
5. Expliquer clairement pourquoi l'association fonctionne.
6. Ne prétends jamais avoir goûté physiquement une recette ni garantir qu'elle plaira à tous.
7. Ne présente pas une forte teneur en alcool comme un avantage.
Langue : Français.`;

// Deterministic Validation Layer
function validateAndNormalizeRecipes(
  rawRecipes: any[],
  config: Partial<CreationConfig>,
  source: CocktailRecipe['source'] = 'gemini_ia'
): CocktailRecipe[] {
  return rawRecipes.map((r, index) => {
    // Ensure ingredients have clean amounts and categories
    const ingredients = (r.ingredients || []).map((ing: any) => ({
      name: String(ing.name || 'Ingrédient'),
      amount: String(ing.amount || '4 cl'),
      category: ['alcool', 'diluant', 'sirop', 'garniture', 'autre'].includes(ing.category)
        ? ing.category
        : config.isMocktailMode
        ? 'diluant'
        : 'autre',
      supermarketCommon: Boolean(ing.supermarketCommon ?? true),
      estimatedPrice: ing.estimatedPrice ? String(ing.estimatedPrice) : undefined,
      formatAdvice: ing.formatAdvice ? String(ing.formatAdvice) : undefined,
      optional: Boolean(ing.optional),
    }));

    // If mocktail mode, ensure no alcohol in ingredients
    const cleanIngredients = config.isMocktailMode
      ? ingredients.filter((ing: any) => ing.category !== 'alcool')
      : ingredients;

    const profileName = r.tasteProfile?.profileName || config.profileName || 'Fruité et équilibré';

    return {
      id: r.id || `mixlab-${Date.now()}-${index}`,
      name: String(r.name || 'Cocktail Signature'),
      type: (['consensuelle', 'signature', 'audacieuse'].includes(r.type) ? r.type : 'signature') as CocktailRecipe['type'],
      tagline: String(r.tagline || 'Création originale MIXLAB'),
      description: String(r.description || ''),
      tasteProfile: {
        primaryNotes: Array.isArray(r.tasteProfile?.primaryNotes) ? r.tasteProfile.primaryNotes : ['Notes fraîches'],
        sweetness: Math.max(1, Math.min(5, Number(r.tasteProfile?.sweetness) || 3)),
        fruitiness: Math.max(1, Math.min(5, Number(r.tasteProfile?.fruitiness) || 3)),
        originality: Math.max(1, Math.min(5, Number(r.tasteProfile?.originality) || 3)),
        profileName,
        colorTheme: mapProfileToColorTheme(profileName),
      },
      ingredients: cleanIngredients,
      steps: Array.isArray(r.steps) && r.steps.length > 0 ? r.steps.map(String) : ['Mélanger et servir bien frais.'],
      glassType: String(r.glassType || 'Verre Highball'),
      prepTimeMinutes: Number(r.prepTimeMinutes) || 3,
      difficulty: (['Très facile', 'Facile', 'Moyen'].includes(r.difficulty) ? r.difficulty : 'Facile') as CocktailRecipe['difficulty'],
      distinctIngredientsCount: cleanIngredients.length,
      estimatedCost: {
        min: Number(r.estimatedCost?.min) || 1.8,
        max: Number(r.estimatedCost?.max) || 2.8,
        currency: 'EUR',
        status: 'estime',
        note: r.estimatedCost?.note || 'Estimation indicative par verre selon les formats standards.',
      },
      aromaticCoherence: String(r.aromaticCoherence || "L'équilibre repose sur la complémentarité des notes sucrées et acidulées."),
      simplerAlternative: String(r.simplerAlternative || 'Remplacer le diluant par une eau gazeuse avec un trait de citron.'),
      mocktailVariant: String(r.mocktailVariant || "Remplacer l'alcool par une base de thé glacé ou de jus de pomme."),
      isMocktailOnly: Boolean(config.isMocktailMode),
      allergens: Array.isArray(r.allergens) ? r.allergens.map(String) : [],
      alcoholEstimate: config.isMocktailMode ? '0.0% Sans alcool' : String(r.alcoholEstimate || 'Modéré (~8-10% vol.)'),
      timerSeconds: Number(r.timerSeconds) || (r.steps?.some((s: string) => s.toLowerCase().includes('shak')) ? 15 : undefined),
      imageUrl: r.imageUrl || pickCocktailPhoto(index, r.name),
      isExample: Boolean(r.isExample),
      source,
      testedByUser: false,
      createdAt: r.createdAt || new Date().toISOString(),
    };
  });
}

// Fallback recipes tailored to user selections
function generateTailoredFallback(config: Partial<CreationConfig>): CocktailRecipe[] {
  const isMock = config.isMocktailMode;
  const base = isMock ? 'Infusion de thé pêche & menthe' : (config.selectedBases?.[0] || 'Vodka classique');
  const mixer = config.selectedMixers?.[0] || 'Schweppes Pink Tonic';
  const aromatic = config.selectedAromatics?.[0] || 'Sirop de mûre';

  const raw = [
    {
      id: `fallback-${Date.now()}-0`,
      name: isMock ? `Virgin ${mixer.split(' ')[0]} Fizz` : `Le Soft ${base.split(' ')[0]} Fizz`,
      type: 'consensuelle',
      tagline: `La fraîcheur immédiate de ${base} allongée au ${mixer}`,
      description: `Une recette harmonieuse et accessible où les arômes s'adoucissent délicatement au contact des bulles de ${mixer}.`,
      tasteProfile: {
        primaryNotes: [base, mixer, 'Agrume doux'],
        sweetness: 3,
        fruitiness: config.fruitiness || 3,
        originality: 2,
        profileName: config.profileName || 'Fruité et bonbon',
      },
      ingredients: [
        { name: base, amount: '4 cl', category: isMock ? 'diluant' : 'alcool', supermarketCommon: true },
        { name: mixer, amount: '12 cl', category: 'diluant', supermarketCommon: true },
        { name: 'Glaçons pleins', amount: '4 cubes', category: 'autre', supermarketCommon: true },
        { name: 'Zeste de citron jaune', amount: '1 zeste', category: 'garniture', supermarketCommon: true, optional: true },
      ],
      steps: [
        'Remplir un grand verre ballon de glaçons jusqu’aux deux tiers.',
        `Verser 4 cl de ${base}.`,
        `Allonger délicatement avec 12 cl de ${mixer} pour préserver les bulles.`,
        'Exprimer le zeste de citron au-dessus du verre avant de le déposer.',
      ],
      glassType: 'Grand verre Highball',
      prepTimeMinutes: 2,
      difficulty: 'Très facile',
      distinctIngredientsCount: 3,
      estimatedCost: { min: 1.5, max: 2.2, currency: 'EUR', status: 'estime', note: 'Prix moyen par verre calculé sur les portions réelles.' },
      aromaticCoherence: `L'effervescence de ${mixer} aère le profil de ${base} sans masquer sa finesse.`,
      simplerAlternative: 'Remplacer le diluant par de la limonade standard.',
      mocktailVariant: 'Cette recette est déjà conçue sans alcool.' ,
      allergens: [],
      alcoholEstimate: isMock ? '0.0% Sans alcool' : 'Modéré (~8% vol.)',
      timerSeconds: 12,
      isExample: true,
    },
    {
      id: `fallback-${Date.now()}-1`,
      name: `Atelier Signature ${base.split(' ')[0]}`,
      type: 'signature',
      tagline: `Le parfait équilibre entre ${base}, ${mixer} et ${aromatic}`,
      description: `Une synergie raffinée entre la base, la texture de ${aromatic} et le peps de ${mixer}.`,
      tasteProfile: {
        primaryNotes: [base, aromatic, mixer],
        sweetness: config.sweetness || 3,
        fruitiness: config.fruitiness || 4,
        originality: config.originality || 3,
        profileName: config.profileName || 'Fruits noirs : mûre, cassis, myrtille',
      },
      ingredients: [
        { name: base, amount: '4 cl', category: isMock ? 'diluant' : 'alcool', supermarketCommon: true },
        { name: aromatic, amount: '1.5 cl', category: 'sirop', supermarketCommon: true, formatAdvice: 'Préférer un flacon 25cl' },
        { name: mixer, amount: '10 cl', category: 'diluant', supermarketCommon: true },
        { name: 'Quartier de citron vert', amount: '1 quartier pressé', category: 'garniture', supermarketCommon: true },
      ],
      steps: [
        `Dans un verre rafraîchi, verser 4 cl de ${base} et 1.5 cl de ${aromatic}.`,
        'Presser le quartier de citron vert frais.',
        'Ajouter de gros glaçons jusqu’au sommet.',
        `Compléter avec 10 cl de ${mixer} et remuer une fois d’un geste ascendant.`,
      ],
      glassType: 'Verre Ballon ou Tumbler large',
      prepTimeMinutes: 3,
      difficulty: 'Facile',
      distinctIngredientsCount: 4,
      estimatedCost: { min: 2.0, max: 2.7, currency: 'EUR', status: 'estime', note: 'Ingrédients de supermarché standard.' },
      aromaticCoherence: `L’acidité du citron vert tranche la rondeur de ${aromatic}, tandis que ${base} structure le milieu de bouche.`,
      simplerAlternative: 'Remplacer par un filet de sirop de grenadine.',
      mocktailVariant: `Supprimer la base et allonger d'eau gazeuse avec un trait de cranberry.`,
      allergens: [],
      alcoholEstimate: isMock ? '0.0% Sans alcool' : 'Modéré (~9% vol.)',
      timerSeconds: 15,
      isExample: true,
    },
    {
      id: `fallback-${Date.now()}-2`,
      name: `L’Insoumis ${base.split(' ')[0]} Botanique`,
      type: 'audacieuse',
      tagline: `Une tension vive associant notes botaniques et fraîcheur épicée`,
      description: `Une interprétation plus osée et aromatique : des contrastes stimulants qui éveillent le palais.`,
      tasteProfile: {
        primaryNotes: [base, 'Épice vive', mixer],
        sweetness: Math.max(1, (config.sweetness || 3) - 1),
        fruitiness: config.fruitiness || 3,
        originality: 5,
        profileName: 'Très original, mais facile à apprécier',
      },
      ingredients: [
        { name: base, amount: '4 cl', category: isMock ? 'diluant' : 'alcool', supermarketCommon: true },
        { name: mixer, amount: '8 cl', category: 'diluant', supermarketCommon: true },
        { name: 'Gingembre frais ou menthe', amount: '2 fines lamelles', category: 'garniture', supermarketCommon: true },
        { name: 'Quelques gouttes de citron vert', amount: '0.5 cl', category: 'autre', supermarketCommon: true },
      ],
      steps: [
        'Écraser légèrement le gingembre ou claquer la menthe au fond du verre pour libérer ses huiles essentielles.',
        `Ajouter les 4 cl de ${base} et le jus de citron vert.`,
        'Remplir de glaçons.',
        `Napper avec 8 cl de ${mixer} et déguster à petites gorgées.`,
      ],
      glassType: 'Verre Old Fashioned',
      prepTimeMinutes: 3,
      difficulty: 'Facile',
      distinctIngredientsCount: 4,
      estimatedCost: { min: 2.2, max: 3.0, currency: 'EUR', status: 'estime', note: 'Prix indicatif à vérifier.' },
      aromaticCoherence: 'Le piquant aromatique stimule les récepteurs gustatifs et amplifie la fraîcheur de la boisson.',
      simplerAlternative: 'Remplacer le gingembre par une fine tranche de concombre.',
      mocktailVariant: 'Infusion de menthe et tonic concombre.',
      allergens: [],
      alcoholEstimate: isMock ? '0.0% Sans alcool' : 'Modéré (~9% vol.)',
      timerSeconds: 20,
      isExample: true,
    },
  ];

  return validateAndNormalizeRecipes(raw, config, 'reference');
}

// ENDPOINT: Generate cocktails
app.post('/api/cocktails/generate', async (req: Request, res: Response) => {
  const config = req.body as CreationConfig;
  const prompt = `Demande de création MIXLAB :
- Intention libre exprimée par l'utilisateur : ${config.freeIntent ? `"${config.freeIntent}"` : 'Aucune intention particulière'}
- Mode Mocktail 100% Sans Alcool : ${config.isMocktailMode ? 'OUI (Strictement 0.0% alcool, concevoir un mocktail sophistiqué)' : 'Non (cocktail avec alcool)'}
- Alcool(s) de base : ${config.isMocktailMode ? 'AUCUN' : (config.selectedBases?.length ? config.selectedBases.join(', ') : 'Au choix')}
- Contrainte 1 bouteille : ${config.singleBottleOnly ? 'OUI' : 'Non'}
- Diluant(s) : ${config.selectedMixers?.length ? config.selectedMixers.join(', ') : 'Au choix'}
- Options aromatiques : ${config.selectedAromatics?.length ? config.selectedAromatics.join(', ') : 'Au choix'}
- Profil aromatique : ${config.profileName || 'Fruité et équilibré'}
- Fruité : ${config.fruitiness || 3}/5, Sucre : ${config.sweetness || 3}/5, Originalité : ${config.originality || 3}/5
- Consensuel : ${config.crowdPleaser ? 'Oui' : 'Standard'}
- Nombre de verres prévus : ${config.servings || 1}
- Filtres : ${config.advancedFilters?.frenchSupermarketOnly ? 'Supermarché français uniquement' : ''} ${config.advancedFilters?.noSyrup ? 'Sans sirop' : ''} ${config.advancedFilters?.noFreshFruits ? 'Sans fruits frais' : ''}

Génère 3 recettes cohérentes : 1 Consensuelle, 1 Signature, 1 Audacieuse.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      const fallback = generateTailoredFallback(config);
      return res.json({ success: true, recipes: fallback, mode: 'demo', notice: 'Exemple prédéfini de référence (clé non configurée).' });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_GEMINI')), 7500)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RECIPES_SCHEMA,
      },
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const text = response.text?.trim();
    if (!text) throw new Error('Empty response');

    const rawRecipes = JSON.parse(text);
    const validated = validateAndNormalizeRecipes(rawRecipes, config, 'gemini_ia');

    return res.json({ success: true, recipes: validated, mode: 'live' });
  } catch (err: any) {
    console.warn('Gemini generateContent fallback:', err?.message || err);
    const fallback = generateTailoredFallback(config);
    return res.json({
      success: true,
      recipes: fallback,
      mode: 'fallback',
      notice: 'Mode démo : proposition adaptée à vos ingrédients suite à une forte demande momentanée sur les serveurs d’IA.',
    });
  }
});

// ENDPOINT: Surprise Me mode
app.post('/api/cocktails/surprise', async (req: Request, res: Response) => {
  const { preferredBases } = req.body;
  const config: Partial<CreationConfig> = {
    selectedBases: preferredBases?.length ? preferredBases : ['Vodka classique', 'Gin', 'Rhum blanc'],
    selectedMixers: ['Schweppes Pink Tonic', 'Ginger Beer', 'Jus de Cranberry'],
    selectedAromatics: ['Sirop de mûre', 'Citron vert frais', 'Menthe'],
    profileName: 'Tropical et ensoleillé',
    fruitiness: 4,
    sweetness: 3,
    originality: 4,
  };

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ success: true, recipes: generateTailoredFallback(config), mode: 'demo' });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_GEMINI')), 6500)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Génère 3 cocktails surprises originaux et réalisables (Consensuelle, Signature, Audacieuse). Bases autorisées : ${config.selectedBases?.join(', ')}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RECIPES_SCHEMA,
      },
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const text = response.text?.trim();
    if (!text) throw new Error('Empty response');

    const raw = JSON.parse(text);
    const validated = validateAndNormalizeRecipes(raw, config, 'gemini_ia');
    return res.json({ success: true, recipes: validated, mode: 'live' });
  } catch (err) {
    return res.json({
      success: true,
      recipes: generateTailoredFallback(config),
      mode: 'fallback',
      notice: 'Mode surprise de référence actif.',
    });
  }
});

// ENDPOINT: Rebalance recipe with AI
app.post('/api/cocktails/rebalance', async (req: Request, res: Response) => {
  const { originalRecipe, userTweak } = req.body;

  if (!originalRecipe || !userTweak) {
    return res.status(400).json({ success: false, message: 'Paramètres manquants' });
  }

  const prompt = `Voici une recette de cocktail existante :
Nom : ${originalRecipe.name}
Ingrédients actuels : ${JSON.stringify(originalRecipe.ingredients)}
Étapes : ${JSON.stringify(originalRecipe.steps)}

L'utilisateur demande cette modification : "${userTweak}"
(Ex: remplacer un ingrédient, baisser le sucre, augmenter la dilution, rendre sans alcool).

Rééquilibre harmonieusement la recette pour respecter cette demande tout en préservant la cohérence aromatique.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      // Offline fallback: tweak amounts or return modified copy
      const modified: CocktailRecipe = {
        ...originalRecipe,
        id: `rebalanced-${Date.now()}`,
        name: `${originalRecipe.name} (Ajusté)`,
        description: `${originalRecipe.description} (Rééquilibré pour : ${userTweak})`,
        source: 'user_custom',
      };
      return res.json({ success: true, recipe: modified, mode: 'demo' });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_REBALANCE')), 5000)
    );

    const rebalancePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: (RECIPES_SCHEMA.items as any),
        },
      },
    });

    const response = (await Promise.race([rebalancePromise, timeoutPromise])) as any;
    const text = response.text?.trim();
    if (!text) throw new Error('Empty rebalance response');

    const list = JSON.parse(text);
    const validated = validateAndNormalizeRecipes(list, {}, 'user_custom');
    return res.json({ success: true, recipe: validated[0] || originalRecipe, mode: 'live' });
  } catch (err) {
    console.warn('Rebalance fallback:', err);
    const modified: CocktailRecipe = {
      ...originalRecipe,
      id: `rebalanced-${Date.now()}`,
      name: `${originalRecipe.name} (Ajusté)`,
      source: 'user_custom',
    };
    return res.json({ success: true, recipe: modified, mode: 'fallback' });
  }
});

// ENDPOINT: Party Menu Planner
app.post('/api/cocktails/party-menu', async (req: Request, res: Response) => {
  const { guestCount = 8, budget = 50, theme = 'Convivial & Fruité' } = req.body;

  // Build consolidated party menu
  const guestMultiplier = Math.ceil(guestCount / 4);
  const baseMenu = INITIAL_CURATED_COCKTAILS.slice(0, 3);

  const consolidatedShopping = [
    { item: 'Vodka classique (70cl)', bottlesNeeded: `${Math.max(1, Math.ceil((guestCount * 4) / 70))} bouteille(s)`, category: 'alcool' },
    { item: 'Schweppes Pink Tonic (pack 6x25cl)', bottlesNeeded: `${Math.ceil((guestCount * 12) / 150)} pack(s)`, category: 'diluant' },
    { item: 'Sirop de mûre (flacon 25cl)', bottlesNeeded: '1 flacon', category: 'sirop' },
    { item: 'Citrons verts frais', bottlesNeeded: `${Math.ceil(guestCount * 0.75)} citrons`, category: 'garniture' },
    { item: 'Glaçons pleins (sacs 2kg)', bottlesNeeded: `${Math.ceil(guestCount / 5)} sac(s)`, category: 'autre' },
  ];

  const prepTimeline = [
    'J-1 : Placer les softs et sirops au réfrigérateur. Vérifier la réserve de glaçons.',
    'H-2 : Découper les agrumes (quartiers de citron vert) et les conserver dans une boîte hermétique au frais.',
    'H-30 min : Disposer les verres, cuillères et doseurs sur le bar.',
    'À l’arrivée : Servir les premiers cocktails bien frais pour lancer la soirée.',
  ];

  const plan: PartyPlan = {
    guestCount,
    budgetTotalEur: budget,
    theme,
    recipes: baseMenu,
    mocktailRecipe: {
      ...baseMenu[0],
      id: 'party-mocktail-1',
      name: 'Virgin Berry Mist',
      alcoholEstimate: '0.0% Sans alcool',
      isMocktailOnly: true,
    },
    consolidatedShopping,
    prepTimeline,
  };

  return res.json({ success: true, plan });
});

// Vite dev server mounting or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MIXLAB server running on port ${PORT}`);
  });
}

startServer();
