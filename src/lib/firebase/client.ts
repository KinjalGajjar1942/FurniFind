
'use client';

import { collection, doc, addDoc, updateDoc, Firestore, getDocs, getDoc, deleteDoc } from "firebase/firestore";
import type { z } from 'zod';
import type { furnitureSchema } from '@/lib/schema';
import { getDownloadURL, ref, uploadBytes, FirebaseStorage } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import type { Furniture } from '@/lib/types';


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

export async function getAllFurniture(firestore: Firestore): Promise<Furniture[]> {
  const furnitureCollectionRef = collection(firestore, 'furniture');
  const snapshot = await getDocs(furnitureCollectionRef);
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Furniture[];
}

export async function getFurnitureById(firestore: Firestore, id: string): Promise<Furniture | null> {
  const docRef = doc(firestore, 'furniture', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  return { id: snapshot.id, ...snapshot.data() } as Furniture;
}

export async function deleteFurniture(firestore: Firestore, id: string): Promise<void> {
    const docRef = doc(firestore, 'furniture', id);
    await deleteDoc(docRef);
}
