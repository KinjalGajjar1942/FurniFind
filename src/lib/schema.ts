import { z } from 'zod';

export const furnitureImageSchema = z.object({
  url: z.string().url(),
  hint: z.string(),
});

export const furnitureSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  images: z.array(furnitureImageSchema).min(1, { message: 'Please upload at least one image.' }),
  category: z.string().min(3, { message: 'Category must be at least 3 characters long.' }),
});
