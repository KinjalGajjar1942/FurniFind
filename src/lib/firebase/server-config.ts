
'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { env, serviceAccount } from '@/env';

export function getFirebaseAdminApp() {
    const alreadyCreated = getApps().find(app => app.name === 'firebase-admin');
    if (alreadyCreated) {
        return alreadyCreated;
    }

    // Use the validated environment variable for the storage bucket.
    const storageBucket = env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!storageBucket) {
        throw new Error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not defined in your environment variables.");
    }

    return initializeApp(
        {
          credential: cert(serviceAccount),
          storageBucket: storageBucket,
        },
        'firebase-admin'
    );
}
