import 'server-only';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/lib/firebase/server-config';
import type { Furniture, FurnitureImage } from './types';
import { furnitureSchema } from './schema';
import { z } from 'zod';


const db = getFirestore(getFirebaseAdminApp());
const furnitureCollection = db.collection('furniture');

function snapshotToFurniture(snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): Furniture {
    const data = snapshot.data();
    if (!data) {
        throw new Error("Document data is empty");
    }

    const furniture: Furniture = {
        id: snapshot.id,
        name: data.name,
        description: data.description,
        images: data.images,
        category: data.category,
    };
    return furniture;
}


export const getFurnitureItems = async (): Promise<Furniture[]> => {
    const snapshot = await furnitureCollection.get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(snapshotToFurniture);
};

export const getFurnitureItemById = async (id: string): Promise<Furniture | undefined> => {
    const doc = await furnitureCollection.doc(id).get();
    if (!doc.exists) {
        return undefined;
    }
    return snapshotToFurniture(doc);
};

export const getFurnitureItemsByCategory = async (category: string): Promise<Furniture[]> => {
    const snapshot = await furnitureCollection.where('category', '==', category).get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(snapshotToFurniture);
};

export const getCategories = async (): Promise<{ name: string, imageUrl: string, imageHint: string }[]> => {
    const furnitureItems = await getFurnitureItems();
    const categoriesMap = new Map<string, { imageUrl: string; imageHint: string }>();
    furnitureItems.forEach((item) => {
        const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1).toLowerCase();
        if (!categoriesMap.has(categoryName) && item.images.length > 0) {
            categoriesMap.set(categoryName, { imageUrl: item.images[0].url, imageHint: item.images[0].hint });
        }
    });

    return Array.from(categoriesMap.entries()).map(([name, { imageUrl, imageHint }]) => ({
        name,
        imageUrl,
        imageHint,
    }));
};
