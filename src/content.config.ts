import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const ingredient = z.object({
  quantity: z.number().optional(),
  unit: z.string().optional(),
  item: z.string(),
});

// Ricette senza divisori: la lista è piatta e senza nome.
// Ricette con divisori: ogni voce è `{ name, items: [...] }`.
// Le due forme non si confondono mai, perché `item` e `items` sono obbligatori
// in forma diversa: ogni valore è o una voce o un gruppo, mai entrambe le cose.
const ingredientGroup = z.object({
  name: z.string(),
  items: z.array(ingredient),
});

const ingredients = z.array(z.union([ingredientGroup, ingredient]));

const recipes = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/recipes',
  }),

  schema: z.object({
    title: z.string(),
    description: z.string().optional(),

    category: z.enum([
      'antipasto',
      'primo',
      'secondo',
      'contorno',
      'dolce',
      'piatto unico',
      'bibita',
      'salse/basi'
    ]),

    tags: z.array(z.string()).default([]),

    servings: z.number(),

    cuisine: z.enum([
      'italiana',
      'colombiana',
      'messicana',
      'asiatica',
      'americana',
      'altro',
    ]).optional(),

    season: z.enum([
      'primavera',
      'estate',
      'autunno',
      'inverno',
      'tutto l\'anno',
    ]).optional(),

    prepTime: z.number().optional(),
    cookTime: z.number().optional(),

    difficulty: z
      .enum(['facile', 'media', 'difficile'])
      .optional(),

    image: z.string().optional(),

    ingredients,

    variants: z.array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        ingredients,
      })
    ).optional().default([]),
  }),
});

export const collections = {
  recipes,
};