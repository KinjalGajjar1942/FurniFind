
import { z } from 'zod';

export const furnitureSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    hint: z.string().optional(),
  })).min(1, 'At least one image is required'),
  category: z.string().min(1, 'Category is required'),
});
