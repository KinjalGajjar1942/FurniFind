'use server';

import 'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { Furniture } from '@/lib/types';
import { furnitureSchema } from '@/lib/schema';

// This is a temporary import. In a real app, you'd get this from a secure location.
// We will replace this with a secure way to get credentials later.
const serviceAccount = {
    "type": "service_account",
    "project_id": "studio-8815091537-17cb2",
    "private_key_id": "d04a796b30f51950c41a547b7136f1c713b632eb",
    "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmF+kL5A6sO6dC\\n/b7EoaSxd07FfW0m7c9y/j5L1y2y0I5f9x7F6b5g5j4h0j5e4x3j2k1l8m1f9n3o\\n5k7g3a1m9h5v7k3l2p0q8x9z/y6y/g3j1h5g9k7i3o1l7m5c9x4b3f1k9n5v/u3\\no1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3\\nj5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y\\n/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g\\n1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/\\nt3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g\\n9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7\\nx/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h\\n3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f\\n1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o\\n1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h\\nj5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/\\nz3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3\\nk7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1\\nk5n7v/t3o1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o\\n1s3k7c5g9h3j5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h\\nj5l1p9q7x/z3y/g5j1h3k7c9g1b3f1k5n7v/t3o1s3k7c5g9h3j5l1p9q7x\\nCAwEAAQ==\\n-----END PRIVATE KEY-----\\n",
    "client_email": "firebase-adminsdk-q5p1s@studio-8815091537-17cb2.iam.gserviceaccount.com",
    "client_id": "118228189617296317255",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-q5p1s%40studio-8815091537-17cb2.iam.gserviceaccount.com"
};

const firebaseAdminApp =
  getApps().find((app) => app.name === 'firebase-admin') ||
  initializeApp(
    {
      credential: cert(serviceAccount),
    },
    'firebase-admin'
  );

const db = getFirestore(firebaseAdminApp);

export async function addFurniture(furniture: z.infer<typeof furnitureSchema>) {
  const validatedFurniture = furnitureSchema.safeParse(furniture);
  if (!validatedFurniture.success) {
    throw new Error('Invalid furniture data');
  }

  try {
    const docRef = await db.collection('furniture').add(validatedFurniture.data);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw new Error('Could not add furniture to database.');
  }
}
