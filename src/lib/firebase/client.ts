
'use client';

import { collection, doc, addDoc, updateDoc, Firestore } from "firebase/firestore";
import type { z } from 'zod';
import type { furnitureSchema } from '@/lib/schema';

export async function addFurniture(firestore: Firestore, furniture: z.infer<typeof furnitureSchema>) {
    const furnitureCollectionRef = collection(firestore, 'furniture');
    await addDoc(furnitureCollectionRef, furniture);
}

export async function updateFurniture(firestore: Firestore, id: string, furniture: z.infer<typeof furnitureSchema>) {
    const docRef = doc(firestore, 'furniture', id);
    await updateDoc(docRef, furniture);
}
