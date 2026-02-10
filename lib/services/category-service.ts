import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/config';
import type { Category, CategoryInput } from '@/types/category';

const categoryCollection = (userId: string) =>
  collection(getFirestoreDb(), 'users', userId, 'categories');

export const fetchCategories = async (userId: string): Promise<Category[]> => {
  const snapshot = await getDocs(
    query(categoryCollection(userId), orderBy('createdAt', 'desc'))
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Category, 'id'>),
  }));
};

export const addCategory = async (
  userId: string,
  input: CategoryInput
): Promise<Category> => {
  const payload = {
    ...input,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(categoryCollection(userId), payload);

  return {
    id: docRef.id,
    ...input,
    userId,
  };
};
