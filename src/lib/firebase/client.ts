
'use client';
import { firebaseApp } from './config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage(firebaseApp);

export async function uploadImageAndGetUrl(file: File, userId: string): Promise<string> {
    const fileExtension = file.name.split('.').pop();
    // Include the user's ID in the path to associate the image with the user
    const fileName = `furniture-images/${userId}/${uuidv4()}.${fileExtension}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
}
