'use client';
import { firebaseApp, firebaseConfig } from './config';
import { getFirestore, collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { furnitureSchema } from '@/lib/schema';
import type { z } from 'zod';

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const furnitureCollection = collection(db, 'furniture');

export async function uploadImageAndGetUrl(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `furniture-images/${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}

export async function addFurnitureClient(furniture: z.infer<typeof furnitureSchema>) {
    const validatedFurniture = furnitureSchema.safeParse(furniture);
    if (!validatedFurniture.success) {
        throw new Error('Invalid furniture data');
    }

    try {
        const docRef = await addDoc(furnitureCollection, validatedFurniture.data);
        console.log('Document written with ID: ', docRef.id);
        return docRef.id;
    } catch (e) {
        console.error('Error adding document: ', e);
        throw new Error('Could not add furniture to database.');
    }
}

export async function updateFurnitureClient(id: string, furniture: z.infer<typeof furnitureSchema>) {
    const validatedFurniture = furnitureSchema.safeParse(furniture);
    if (!validatedFurniture.success) {
        throw new Error('Invalid furniture data');
    }
    
    const docRef = doc(db, 'furniture', id);

    try {
        await updateDoc(docRef, validatedFurniture.data);
        console.log('Document with ID ', id, ' updated.');
    } catch (e) {
        console.error('Error updating document: ', e);
        throw new Error('Could not update furniture in database.');
    }
}
