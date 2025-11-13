
import 'server-only';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/lib/firebase/server-config';

const db = getFirestore(getFirebaseAdminApp());

export async function seedCategories() {
  const categoriesCollection = db.collection('categories');
  const categories = [
    { name: 'Chairs' },
    { name: 'Tables' },
    { name: 'Sofas' },
    { name: 'Beds' },
    { name: 'Bookshelves' },
  ];

  const batch = db.batch();
  
  // Check if categories already exist to avoid duplicates
  const snapshot = await categoriesCollection.get();
  if (!snapshot.empty) {
    console.log('Categories collection is not empty. Skipping seed.');
    return;
  }

  categories.forEach(category => {
    const docRef = categoriesCollection.doc(); // Automatically generate a new ID
    batch.set(docRef, category);
  });

  await batch.commit();
  console.log('Successfully seeded categories.');
}
