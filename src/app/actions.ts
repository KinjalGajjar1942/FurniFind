'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { furnitureSchema } from '@/lib/schema';
import type { z } from 'zod';
import { handleImageUpload } from '@/ai/flows/handle-image-upload-flow';
import { addFurniture, updateFurniture } from '@/lib/firebase/firestore';

const furnitureActionSchema = furnitureSchema;

export async function createFurnitureAction(data: z.infer<typeof furnitureActionSchema>) {
  const validatedFields = furnitureActionSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Invalid furniture data provided.');
  }

  await addFurniture(validatedFields.data);

  revalidatePath('/');
  redirect('/');
}

export async function updateFurnitureAction(id: string, data: z.infer<typeof furnitureActionSchema>) {
  const validatedFields = furnitureActionSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Invalid furniture data provided.');
  }
  
  await updateFurniture(id, validatedFields.data);

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
