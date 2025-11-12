import { z } from 'zod';

export const furnitureSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  // The images field will be handled separately, not as a direct form field.
  // We'll manage an array of image URLs in the form state.
  imageUrl: z.string().url({ message: 'Please upload an image.' }),
  category: z.string().min(3, { message: 'Category must be at least 3 characters long.' }),
});
