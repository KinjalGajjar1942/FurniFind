'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { furnitureSchema } from '@/lib/schema';
import type { z } from 'zod';
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
