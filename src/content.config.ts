import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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
    ]),

    tags: z.array(z.string()).default([]),

    servings: z.number(),

    prepTime: z.number().optional(),
    cookTime: z.number().optional(),

    difficulty: z
      .enum(['facile', 'media', 'difficile'])
      .optional(),

    image: z.string().optional(),

    ingredients: z.array(
      z.object({
        quantity: z.number().optional(),
        unit: z.string().optional(),
        item: z.string(),
      })
    ),
  }),
});

export const collections = {
  recipes,
};