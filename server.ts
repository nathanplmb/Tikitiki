import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { CocktailRecipe } from './src/types/cocktail';
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

// Curated high quality cocktail images
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
        description: 'e.g. Modéré (~8-10% vol.)',
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

const SYSTEM_INSTRUCTION = `Tu es un mixologue créatif professionnel pour l'application MIXLAB, spécialisé dans les cocktails accessibles, les associations aromatiques originales et les recettes adaptées aux soirées conviviales.
Tu connais parfaitement les profils aromatiques des alcools, sodas, jus, sirops et garnitures disponibles en France.

Tes priorités absolues, dans cet ordre :
1. Produire une association aromatique cohérente et savoureuse.
2. Respecter scrupuleusement les ingrédients sélectionnés et les contraintes logistiques indiquées.
3. Proposer quelque chose d'original sans jamais tomber dans des associations absurdes ou désagréables.
4. Privilégier les recettes susceptibles de plaire à plusieurs personnes (conviviales et équilibrées).
5. Limiter le nombre d'ingrédients et la complexité (idéalement 1 alcool, 1 diluant, 1 option aromatique/garniture max).
6. Expliquer clairement pourquoi l'association fonctionne d'un point de vue aromatique.
7. Proposer une variante plus consensuelle si la recette est audacieuse.

Règles éthiques & sécurité :
- Les quantités d'alcool doivent rester modérées (environ 4 à 5 cl d'alcool fort ou liqueur par verre).
- Ne jamais présenter une forte teneur en alcool comme un avantage ou inciter à boire davantage.
- Ne prétends jamais avoir goûté une recette ni garantir qu'elle plaira à tout le monde.
- Indique des prix comme "indicatifs à vérifier" sans prétendre qu'un magasin précis pratique ce tarif.
- Pour chaque demande, génère exactement 3 recettes :
  1. Consensuelle (accessible, douce, très facile à apprécier par un groupe).
  2. Signature (le meilleur équilibre entre originalité et harmonie gustative).
  3. Audacieuse (une association moins attendue, mais aromatiquement justifiée et intrigante).
Langue obligatoire : Français.`;

// Helper: Synthesize tailored recipes if remote Gemini is experiencing 503 high demand
function generateTailoredFallback(config: any): CocktailRecipe[] {
  const base = config.selectedBases?.[0] || 'Vodka classique';
  const mixer = config.selectedMixers?.[0] || 'Schweppes Pink Tonic';
  const aromatic = config.selectedAromatics?.[0] || 'Sirop de mûre';

  return [
    {
      id: `tailored-${Date.now()}-0`,
      name: `Le Soft ${base.split(' ')[0]} Fizz`,
      type: 'consensuelle',
      tagline: `La fraîcheur immédiate de ${base} allongée au ${mixer}`,
      description: `Une recette harmonieuse et accessible où les notes de ${base} s’adoucissent délicatement au contact des bulles de ${mixer}.`,
      tasteProfile: {
        primaryNotes: [base, mixer, 'Agrume doux'],
        sweetness: 3,
        fruitiness: config.fruitiness || 3,
        originality: 2,
        profileName: config.profileName || 'Fruité et bonbon',
      },
      ingredients: [
        { name: base, amount: '4 cl', category: 'alcool', supermarketCommon: true, estimatedPrice: '~14€' },
        { name: mixer, amount: '12 cl', category: 'diluant', supermarketCommon: true, estimatedPrice: '~1.80€' },
        { name: 'Glaçons pleins', amount: '4 cubes', category: 'autre', supermarketCommon: true },
        { name: 'Zeste de citron jaune', amount: '1 zeste', category: 'garniture', supermarketCommon: true, optional: true },
      ],
      steps: [
        'Remplir un grand verre de glaçons.',
        `Verser 4 cl de ${base}.`,
        `Allonger avec 12 cl de ${mixer} bien frais.`,
        'Exprimer un zeste de citron sur le dessus et remuer délicatement.',
      ],
      glassType: 'Grand verre Highball',
      prepTimeMinutes: 2,
      difficulty: 'Très facile',
      distinctIngredientsCount: 3,
      estimatedCost: { min: 1.6, max: 2.3, currency: 'EUR', status: 'estime', note: 'Prix moyen par verre calculé sur les portions réelles.' },
      aromaticCoherence: `La neutralité et la vivacité de ${base} sont parfaitement équilibrées par l’effervescence et les saveurs de ${mixer}.`,
      simplerAlternative: 'Remplacer le diluant par de la limonade standard ou du soda citron.',
      mocktailVariant: `Remplacer ${base} par 2 cl de jus de pomme ou de raisin blanc pour conserver le corps sans alcool.`,
      allergens: [],
      alcoholEstimate: 'Modéré (~8% vol.)',
      imageUrl: pickCocktailPhoto(0, base),
      isExample: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: `tailored-${Date.now()}-1`,
      name: `Signature ${base.split(' ')[0]} Velvet`,
      type: 'signature',
      tagline: `Le parfait équilibre entre ${base}, ${mixer} et ${aromatic}`,
      description: `La création signature du laboratoire : une synergie raffinée entre la base alcoolisée, la texture apportée par ${aromatic} et le peps de ${mixer}.`,
      tasteProfile: {
        primaryNotes: [base, aromatic, mixer],
        sweetness: config.sweetness || 3,
        fruitiness: config.fruitiness || 4,
        originality: config.originality || 3,
        profileName: config.profileName || 'Fruits noirs : mûre, cassis, myrtille',
      },
      ingredients: [
        { name: base, amount: '4 cl', category: 'alcool', supermarketCommon: true },
        { name: aromatic, amount: '1.5 cl', category: 'sirop', supermarketCommon: true, formatAdvice: 'Préférer un flacon 25cl' },
        { name: mixer, amount: '10 cl', category: 'diluant', supermarketCommon: true },
        { name: 'Quartier de citron vert', amount: '1 quartier pressé', category: 'garniture', supermarketCommon: true },
      ],
      steps: [
        `Dans un verre ballon rafraîchi, verser 4 cl de ${base} et 1.5 cl de ${aromatic}.`,
        'Presser le quartier de citron vert frais.',
        'Ajouter de gros glaçons jusqu’au sommet.',
        `Compléter délicatement avec 10 cl de ${mixer}.`,
        'Mélanger une fois d’un geste ascendant pour respecter la couleur en dégradé.',
      ],
      glassType: 'Verre Ballon ou Tumbler large',
      prepTimeMinutes: 3,
      difficulty: 'Facile',
      distinctIngredientsCount: 4,
      estimatedCost: { min: 2.1, max: 2.8, currency: 'EUR', status: 'estime', note: 'Ingrédients de supermarché standard.' },
      aromaticCoherence: `L’acidité du citron vert réveille les notes gourmandes de ${aromatic}, tandis que ${base} assure la longueur en bouche.`,
      simplerAlternative: `Remplacer ${aromatic} par du sirop de grenadine ou de framboise classique.`,
      mocktailVariant: `Omettre ${base} et doubler la dose de ${mixer} avec une pointe de gingembre frais.`,
      allergens: [],
      alcoholEstimate: 'Modéré (~9% vol.)',
      imageUrl: pickCocktailPhoto(1, aromatic),
      isExample: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: `tailored-${Date.now()}-2`,
      name: `L’Insoumis ${base.split(' ')[0]} & Spices`,
      type: 'audacieuse',
      tagline: `Un twist inattendu mariant tension végétale et vivacité pétillante`,
      description: `Une interprétation plus osée et aromatique : des contrastes de températures et de textures qui intriguent le palais sans le brusquer.`,
      tasteProfile: {
        primaryNotes: [base, 'Épice vive', mixer],
        sweetness: Math.max(1, (config.sweetness || 3) - 1),
        fruitiness: config.fruitiness || 3,
        originality: 5,
        profileName: 'Très original, mais facile à apprécier',
      },
      ingredients: [
        { name: base, amount: '4 cl', category: 'alcool', supermarketCommon: true },
        { name: mixer, amount: '8 cl', category: 'diluant', supermarketCommon: true },
        { name: 'Gingembre frais ou menthe', amount: '2 fines lamelles', category: 'garniture', supermarketCommon: true },
        { name: 'Quelques gouttes de citron vert', amount: '0.5 cl', category: 'autre', supermarketCommon: true },
      ],
      steps: [
        'Écraser légèrement le gingembre ou frapper la menthe au fond du verre pour libérer ses essences.',
        `Ajouter les 4 cl de ${base} et le jus de citron.`,
        'Remplir de glace pilée ou de glaçons.',
        `Napper avec 8 cl de ${mixer}.`,
        'Servir avec une paille courte en verre.',
      ],
      glassType: 'Verre Old Fashioned ou Tumbler',
      prepTimeMinutes: 3,
      difficulty: 'Facile',
      distinctIngredientsCount: 4,
      estimatedCost: { min: 2.3, max: 3.1, currency: 'EUR', status: 'estime', note: 'Prix indicatif à vérifier.' },
      aromaticCoherence: 'Le piquant aromatique stimule les récepteurs gustatifs et amplifie la fraîcheur de la boisson.',
      simplerAlternative: 'Remplacer le gingembre frais par une pincée d’écorce d’orange ou du poivre rose concassé.',
      mocktailVariant: 'Remplacer l’alcool par une infusion de thé vert glacé tonifiée au citron.',
      allergens: [],
      alcoholEstimate: 'Modéré (~9.5% vol.)',
      imageUrl: pickCocktailPhoto(2, 'insoumis'),
      isExample: true,
      createdAt: new Date().toISOString(),
    },
  ];
}

// Endpoint: Generate cocktails from Lab configuration
app.post('/api/cocktails/generate', async (req: Request, res: Response) => {
  const config = req.body;
  const prompt = `Demande MIXLAB :
- Alcool(s) : ${config.selectedBases?.length ? config.selectedBases.join(', ') : 'Vodka ou Gin'}
- Contrainte 1 bouteille : ${config.singleBottleOnly ? 'OUI' : 'Non'}
- Diluant(s) : ${config.selectedMixers?.length ? config.selectedMixers.join(', ') : 'Schweppes Pink Tonic ou Limonade'}
- Options aromatiques : ${config.selectedAromatics?.length ? config.selectedAromatics.join(', ') : 'Sirop de mûre, citron vert'}
- Profil aromatique : ${config.profileName || 'Fruité et équilibré'}
- Fruité : ${config.fruitiness || 3}/5, Sucre : ${config.sweetness || 3}/5, Originalité : ${config.originality || 3}/5
- Consensuel : ${config.crowdPleaser ? 'Oui' : 'Standard'}
Génère les 3 recettes : Consensuelle, Signature, Audacieuse.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      const fallback = generateTailoredFallback(config);
      return res.json({ success: true, recipes: fallback, mode: 'demo', notice: 'Exemple prédéfini (mode démo).' });
    }

    // Try primary gemini-3.8-flash with timeout
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT_GEMINI')), 6500)
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

    const rawRecipes = JSON.parse(text) as Omit<CocktailRecipe, 'id' | 'imageUrl' | 'createdAt'>[];
    const recipes: CocktailRecipe[] = rawRecipes.map((recipe, index) => ({
      ...recipe,
      id: `mixlab-${Date.now()}-${index}`,
      imageUrl: pickCocktailPhoto(index, recipe.name),
      isExample: false,
      createdAt: new Date().toISOString(),
    }));

    return res.json({ success: true, recipes, mode: 'live' });
  } catch (err: any) {
    console.warn('Gemini 3.8 Flash unavailable or timed out, generating tailored mixology fallback:', err?.message || err);
    const fallbackRecipes = generateTailoredFallback(config);
    return res.json({
      success: true,
      recipes: fallbackRecipes,
      mode: 'fallback',
      notice: 'Mode démo actif : recette adaptée à vos ingrédients suite à une forte demande momentanée sur les serveurs d’IA.',
    });
  }
});

// Endpoint: Surprise Me mode
app.post('/api/cocktails/surprise', async (req: Request, res: Response) => {
  const { preferredBases } = req.body;
  const config = {
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
      setTimeout(() => reject(new Error('TIMEOUT_GEMINI')), 6000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Génère 3 cocktails surprises originaux et réalisables (Consensuelle, Signature, Audacieuse). Bases : ${config.selectedBases.join(', ')}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RECIPES_SCHEMA,
      },
    });

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const text = response.text?.trim();
    if (!text) throw new Error('Empty response');

    const rawRecipes = JSON.parse(text) as Omit<CocktailRecipe, 'id' | 'imageUrl' | 'createdAt'>[];
    const recipes: CocktailRecipe[] = rawRecipes.map((recipe, index) => ({
      ...recipe,
      id: `surprise-${Date.now()}-${index}`,
      imageUrl: pickCocktailPhoto(index, recipe.name),
      isExample: false,
      createdAt: new Date().toISOString(),
    }));

    return res.json({ success: true, recipes, mode: 'live' });
  } catch (err) {
    return res.json({
      success: true,
      recipes: generateTailoredFallback(config),
      mode: 'fallback',
      notice: 'Mode surprise prêt.',
    });
  }
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
