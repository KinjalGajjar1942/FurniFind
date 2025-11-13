
'use client';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { firebaseConfig } from './config';

// Initialize Firebase
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(firebaseApp);

export async function uploadImageAndGetUrl(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    // Path is now public, no user ID needed
    const fileName = `furniture-images/${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}
