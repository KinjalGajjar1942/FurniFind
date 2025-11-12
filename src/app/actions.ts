'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { furnitureSchema } from '@/lib/schema';
import type { z } from 'zod';
import { handleImageUpload } from '@/ai/flows/handle-image-upload-flow';

// This is a simplified version. In a real app, you'd have a database.
// We'll also need to adjust the data types to handle multiple images.
export async function createFurnitureAction(data: z.infer<typeof furnitureSchema>) {
  const validatedFields = furnitureSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Invalid furniture data provided.');
  }

  // In a real app, you would insert this data into your database.
  // This simulation needs to be updated to handle the new `images` array structure
  console.log('Creating new furniture (simulated):', validatedFields.data);

  revalidatePath('/');
  redirect('/');
}

export async function updateFurnitureAction(id: string, data: z.infer<typeof furnitureSchema>) {
  const validatedFields = furnitureSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Invalid furniture data provided.');
  }
  
  // In a real app, you would update the item with this id in your database.
  // This simulation needs to be updated to handle the new `images` array structure
  console.log(`Updating furniture ${id} (simulated):`, validatedFields.data);

  revalidatePath('/');
  revalidatePath(`/furniture/${id}`);
  redirect(`/furniture/${id}`);
}

export async function handleImageUploadAction(formData: FormData): Promise<{ imageUrl: string; imageHint: string } | { error: string }> {
  const imageFile = formData.get('image') as File;
  if (!imageFile) {
    return { error: 'No image file provided.' };
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const dataURI = `data:${imageFile.type};base64,${base64}`;

  try {
    const result = await handleImageUpload({ photoDataUri: dataURI });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to process image.' };
  }
}
