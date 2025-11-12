'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { furnitureSchema } from '@/lib/schema';
import type { z } from 'zod';

export async function createFurnitureAction(data: z.infer<typeof furnitureSchema>) {
  const validatedFields = furnitureSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error('Invalid furniture data provided.');
  }

  // In a real app, you would insert this data into your database.
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
  console.log(`Updating furniture ${id} (simulated):`, validatedFields.data);

  revalidatePath('/');
  revalidatePath(`/furniture/${id}`);
  redirect(`/furniture/${id}`);
}
