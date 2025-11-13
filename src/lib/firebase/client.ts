
'use client';

import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import { collection, doc, addDoc, updateDoc, Firestore } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import type { z } from 'zod';
import type { furnitureSchema } from '@/lib/schema';

export async function uploadImageAndGetUrl(storage: FirebaseStorage, file: File): Promise<string> {
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

export async function addFurniture(firestore: Firestore, furniture: z.infer<typeof furnitureSchema>) {
    const furnitureCollectionRef = collection(firestore, 'furniture');
    await addDoc(furnitureCollectionRef, furniture);
}

export async function updateFurniture(firestore: Firestore, id: string, furniture: z.infer<typeof furnitureSchema>) {
    const docRef = doc(firestore, 'furniture', id);
    await updateDoc(docRef, furniture);
}
