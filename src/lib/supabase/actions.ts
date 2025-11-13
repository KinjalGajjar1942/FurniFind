
'use client';

import { supabase } from '@/lib/supabase/client';
import type { z } from 'zod';
import type { furnitureSchema } from '@/lib/schema';
import { v4 as uuidv4 } from 'uuid';

export async function addFurniture(furniture: z.infer<typeof furnitureSchema>) {
  const { error } = await supabase.from('furniture').insert([furniture]);
  if (error) {
    throw new Error('Error adding furniture to Supabase');
  }
}

export async function updateFurniture(id: string, furniture: z.infer<typeof furnitureSchema>) {
  const { error } = await supabase.from('furniture').update(furniture).eq('id', id);
  if (error) {
    throw new Error('Error updating furniture in Supabase');
  }
}
