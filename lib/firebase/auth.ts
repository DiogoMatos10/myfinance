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
import { auth, db } from './config';
import { getIdToken } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  defaultCurrency: string;
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
    // Criar usuário no Firebase Auth
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
    const code = getErrorCode(error);
    throw new Error(getAuthErrorMessage(code));
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
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
    const code = getErrorCode(error);
    throw new Error(getAuthErrorMessage(code));
  }
};

export const loginWithGoogle = async (): Promise<User> => {
  try {
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
    const code = getErrorCode(error);
    throw new Error(getAuthErrorMessage(code));
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error('Erro ao fazer logout');
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    console.error('Error resetting password:', error);
    const code = getErrorCode(error);
    throw new Error(getAuthErrorMessage(code));
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
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
      return 'Este email já está em uso';
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/operation-not-allowed':
      return 'Operação não permitida';
    case 'auth/weak-password':
      return 'Senha muito fraca. Use pelo menos 6 caracteres';
    case 'auth/user-disabled':
      return 'Esta conta foi desativada';
    case 'auth/user-not-found':
      return 'Usuário não encontrado';
    case 'auth/wrong-password':
      return 'Email ou senha incorretos';
    case 'auth/invalid-credential':
      return 'Credenciais inválidas';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde';
    case 'auth/popup-closed-by-user':
      return 'Popup fechado antes de completar o login';
    default:
      return 'Erro ao autenticar. Tente novamente';
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
