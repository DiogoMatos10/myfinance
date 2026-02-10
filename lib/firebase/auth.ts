import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  FieldValue,
} from 'firebase/firestore';
import { FirebaseConfigError, getFirebaseAuth, getFirestoreDb } from './config';
import { getIdToken } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  defaultCurrency: string;
  initialBalance?: number;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
    notifications: boolean;
  };
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const auth = getFirebaseAuth();
    const db = getFirestoreDb();
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName,
      defaultCurrency: 'EUR',
      preferences: {
        theme: 'system',
        dateFormat: 'DD/MM/YYYY',
        notifications: true,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return user;
  } catch (error: unknown) {
    console.error('Error registering user:', error);
    if (error instanceof FirebaseConfigError) {
      throw new Error(error.message);
    }
    const code = getErrorCode(error);
    throw new Error(getAuthErrorMessage(code));
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const auth = getFirebaseAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const token = await getIdToken(user, true);
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    return user;
  } catch (error: unknown) {
    console.error('Error logging in:', error);
    if (error instanceof FirebaseConfigError) {
      throw new Error(error.message);
    }
    const code = getErrorCode(error);
    throw new Error(getAuthErrorMessage(code));
  }
};

export const loginWithGoogle = async (): Promise<User> => {
  try {
    const auth = getFirebaseAuth();
    const db = getFirestoreDb();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const token = await getIdToken(user, true);
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const userData: UserData = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || undefined,
        defaultCurrency: 'EUR',
        preferences: {
          theme: 'system',
          dateFormat: 'DD/MM/YYYY',
          notifications: true,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
    }

    return user;
  } catch (error: unknown) {
    console.error('Error logging in with Google:', error);
    if (error instanceof FirebaseConfigError) {
      throw new Error(error.message);
    }
    const code = getErrorCode(error);
    throw new Error(getAuthErrorMessage(code));
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    await signOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch (error) {
    console.error('Error logging out:', error);
    if (error instanceof FirebaseConfigError) {
      throw new Error(error.message);
    }
    throw new Error('Error logging out');
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    console.error('Error resetting password:', error);
    if (error instanceof FirebaseConfigError) {
      throw new Error(error.message);
    }
    const code = getErrorCode(error);
    throw new Error(getAuthErrorMessage(code));
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const db = getFirestoreDb();
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already in use';
    case 'auth/invalid-email':
      return 'Invalid email';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed';
    case 'auth/weak-password':
      return 'Password too weak. Use at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Incorrect email or password';
    case 'auth/invalid-credential':
      return 'Invalid credentials';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later';
    case 'auth/popup-closed-by-user':
      return 'Popup closed before completing login';
    default:
      return 'Authentication error. Try again';
  }
}

function getErrorCode(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'unknown';
  }

  if ('code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : 'unknown';
  }

  return 'unknown';
}
