'use server';

import 'server-only';
import { getFirestore } from 'firebase-admin/firestore';
import type { z } from 'zod';
import { furnitureSchema } from '@/lib/schema';
import { getFirebaseAdminApp } from '@/lib/firebase/server-config';


const db = getFirestore(getFirebaseAdminApp());
const furnitureCollection = db.collection('furniture');


export async function addFurniture(furniture: z.infer<typeof furnitureSchema>) {
  const validatedFurniture = furnitureSchema.safeParse(furniture);
  if (!validatedFurniture.success) {
    throw new Error('Invalid furniture data');
  }

  try {
    const docRef = await furnitureCollection.add(validatedFurniture.data);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add furniture to database.');
  }
}

export async function updateFurniture(id: string, furniture: z.infer<typeof furnitureSchema>) {
    const validatedFurniture = furnitureSchema.safeParse(furniture);
    if (!validatedFurniture.success) {
      throw new Error('Invalid furniture data');
    }
  
    try {
      await furnitureCollection.doc(id).update(validatedFurniture.data);
      console.log('Document with ID ', id, ' updated.');
    } catch (e) {
      console.error('Error updating document: ', e);
      throw new Error('Could not update furniture in database.');
    }
}
