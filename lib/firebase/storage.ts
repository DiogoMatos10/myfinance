import { FirebaseStorage, getStorage } from 'firebase/storage';
import { getFirebaseApp } from './config';

let storage: FirebaseStorage | null = null;

export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
};
