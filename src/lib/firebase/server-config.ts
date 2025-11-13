
'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { serviceAccount } from '@/env';

export function getFirebaseAdminApp() {
    const alreadyCreated = getApps().find(app => app.name === 'firebase-admin');
    if (alreadyCreated) {
        return alreadyCreated;
    }

    // Use the environment variable for the storage bucket, which is reliable on the server.
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!storageBucket) {
        throw new Error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable is not set.");
    }

    return initializeApp(
        {
          credential: cert(serviceAccount),
          storageBucket: storageBucket,
        },
        'firebase-admin'
    );
}

