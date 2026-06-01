import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { firebaseConfig } from './firebase-config.js';

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

/** Keep users signed in across refreshes (local storage). */
export const authReady = setPersistence(auth, browserLocalPersistence);
