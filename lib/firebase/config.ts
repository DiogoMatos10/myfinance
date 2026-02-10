import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

type FirebaseEnvConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
};

export class FirebaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirebaseConfigError';
  }
}

const firebaseConfig: FirebaseEnvConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const requiredKeys: Array<{ key: keyof FirebaseEnvConfig; env: string }> = [
  { key: 'apiKey', env: 'NEXT_PUBLIC_FIREBASE_API_KEY' },
  { key: 'authDomain', env: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' },
  { key: 'projectId', env: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID' },
  { key: 'storageBucket', env: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET' },
  { key: 'messagingSenderId', env: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID' },
  { key: 'appId', env: 'NEXT_PUBLIC_FIREBASE_APP_ID' },
];

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let initError: Error | null = null;
let initialized = false;

const isBrowser = typeof window !== 'undefined';

const buildMissingKeyMessage = (keys: Array<{ env: string }>) =>
  `Firebase config is missing required environment variables: ${keys
    .map(key => key.env)
    .join(', ')}. Add them to .env.local and restart the dev server.`;

const getMissingKeys = (config: FirebaseEnvConfig) =>
  requiredKeys.filter(({ key }) => !config[key]);

const ensureInitialized = () => {
  if (!isBrowser || initialized || initError) {
    return;
  }

  const missingKeys = getMissingKeys(firebaseConfig);

  if (missingKeys.length > 0) {
    initError = new FirebaseConfigError(buildMissingKeyMessage(missingKeys));
    return;
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);
    db = getFirestore(app);
    initialized = true;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown Firebase error';
    initError = new FirebaseConfigError(
      `Firebase initialization failed. Check NEXT_PUBLIC_FIREBASE_API_KEY and related settings. ${message}`
    );
  }
};

const getFirebaseServices = () => {
  ensureInitialized();

  if (!app || !auth || !db) {
    throw (
      initError ??
      new FirebaseConfigError(
        'Firebase has not been initialized yet. Ensure this runs in the browser.'
      )
    );
  }

  return { app, auth, db };
};

export const getFirebaseApp = (): FirebaseApp => getFirebaseServices().app;
export const getFirebaseAuth = (): Auth => getFirebaseServices().auth;
export const getFirestoreDb = (): Firestore => getFirebaseServices().db;
export const getFirebaseInitError = (): Error | null => initError;
