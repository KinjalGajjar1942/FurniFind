
'use client';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, doc, Firestore } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { z } from 'zod';
import type { furnitureSchema } from '@/lib/schema';
import { initializeFirebase } from '@/firebase';

// Initialize Firebase and get the instances.
// This is safe to call here because initializeFirebase handles the singleton pattern.
const { storage, firestore } = initializeFirebase();

const furnitureCollectionRef = collection(firestore as Firestore, 'furniture');

export async function uploadImageAndGetUrl(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `furniture-images/${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    try {
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        return downloadUrl;
    } catch (error) {
        console.error("Upload failed:", error);
        // This is a good place to check for CORS errors in the browser console.
        throw new Error('Image upload failed. Please check storage rules and CORS configuration.');
    }
}

export function addFurniture(furniture: z.infer<typeof furnitureSchema>) {
    addDocumentNonBlocking(furnitureCollectionRef, furniture);
}

export function updateFurniture(id: string, furniture: z.infer<typeof furnitureSchema>) {
    const docRef = doc(firestore as Firestore, 'furniture', id);
    updateDocumentNonBlocking(docRef, furniture);
}
