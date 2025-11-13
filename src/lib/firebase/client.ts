
'use client';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { firebaseConfig } from './config';
import type { z } from 'zod';
import type { furnitureSchema } from '@/lib/schema';

// Initialize Firebase
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);

const furnitureCollection = collection(db, 'furniture');

export async function uploadImageAndGetUrl(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `furniture-images/${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}

export async function addFurniture(furniture: z.infer<typeof furnitureSchema>) {
  try {
    const docRef = await addDoc(furnitureCollection, furniture);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add furniture to database.');
  }
}

export async function updateFurniture(id: string, furniture: z.infer<typeof furnitureSchema>) {
    try {
      const docRef = doc(db, 'furniture', id);
      await updateDoc(docRef, furniture);
      console.log('Document with ID ', id, ' updated.');
    } catch (e) {
      console.error('Error updating document: ', e);
      throw new Error('Could not update furniture in database.');
    }
}
