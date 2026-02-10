import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/config';

export interface BalanceInfo {
  initialBalance: number;
}

export const fetchInitialBalance = async (
  userId: string
): Promise<BalanceInfo | null> => {
  const snapshot = await getDoc(doc(getFirestoreDb(), 'users', userId));
  if (!snapshot.exists()) {
    return null;
  }
  const data = snapshot.data() as BalanceInfo;
  return { initialBalance: data.initialBalance ?? 0 };
};

export const setInitialBalance = async (
  userId: string,
  initialBalance: number
): Promise<void> => {
  await setDoc(
    doc(getFirestoreDb(), 'users', userId),
    {
      initialBalance,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
