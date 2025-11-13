
'use client';

import { collection, doc, addDoc, updateDoc, Firestore } from "firebase/firestore";
import type { z } from 'zod';
import type { furnitureSchema } from '@/lib/schema';
import { getDownloadURL, ref, uploadBytes, FirebaseStorage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';


export async function addFurniture(firestore: Firestore, furniture: z.infer<typeof furnitureSchema>) {
    const furnitureCollectionRef = collection(firestore, 'furniture');
    await addDoc(furnitureCollectionRef, furniture);
}

export async function updateFurniture(firestore: Firestore, id: string, furniture: z.infer<typeof furnitureSchema>) {
    const docRef = doc(firestore, 'furniture', id);
    await updateDoc(docRef, furniture);
}

export async function uploadImageAndGetUrl(storage: FirebaseStorage, file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const fileId = uuidv4();
  const fileExtension = file.name.split('.').pop();
  const filePath = `furniture-images/${fileId}.${fileExtension}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  return downloadUrl;
}
