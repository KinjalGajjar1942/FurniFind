
'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { serviceAccount } from '@/env';
import { firebaseConfig } from '@/firebase/config';

export function getFirebaseAdminApp() {
    const alreadyCreated = getApps().find(app => app.name === 'firebase-admin');
    if (alreadyCreated) {
        return alreadyCreated;
    }

    // Use the hardcoded config value for the storage bucket.
    const storageBucket = firebaseConfig.storageBucket;
    if (!storageBucket) {
        throw new Error("Firebase storageBucket is not defined in src/firebase/config.ts");
    }

    return initializeApp(
        {
          credential: cert(serviceAccount),
          storageBucket: storageBucket,
        },
        'firebase-admin'
    );
}
