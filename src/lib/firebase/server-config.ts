import 'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { serviceAccount } from '@/env';
import { firebaseConfig } from './config';

export function getFirebaseAdminApp() {
    const alreadyCreated = getApps().find(app => app.name === 'firebase-admin');
    if (alreadyCreated) {
        return alreadyCreated;
    }

    return initializeApp(
        {
          credential: cert(serviceAccount),
          storageBucket: firebaseConfig.storageBucket,
        },
        'firebase-admin'
    );
}
