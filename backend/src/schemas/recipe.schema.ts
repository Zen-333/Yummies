import { z } from 'zod'

export const createRecipeSchema = z.object({
  name: z.string().trim().min(1, 'Recipe name is required'),
  notes: z.string().optional(),
  cover_image_url: z.string().nullable().optional(),
  images_url: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  steps: z.array(z.string()).optional(),
  time_hr: z.number().min(0).optional(),
  time_mi: z.number().min(0).max(59).optional(),
  cost: z.number().min(0).optional(),
})

export const updateRecipeSchema = createRecipeSchema.partial()