
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  projectId: "studio-8815091537-17cb2",
  appId: "1:349859896027:web:8f4ab95953a07c2a07cafe",
  apiKey: "AIzaSyCLKKwZowuAzPB6BkfOHzT0DfVRnPL5x9U",
  authDomain: "studio-8815091537-17cb2.firebaseapp.com",
  messagingSenderId: "349859896027"
};

// Initialize Firebase
let firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { firebaseApp };
