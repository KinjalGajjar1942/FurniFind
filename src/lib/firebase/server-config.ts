import 'server-only';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);

export function getFirebaseAdminApp() {
    const alreadyCreated = getApps().find(app => app.name === 'firebase-admin');
    if (alreadyCreated) {
        return alreadyCreated;
    }

    return initializeApp(
        {
          credential: cert(serviceAccount),
        },
        'firebase-admin'
    );
}
