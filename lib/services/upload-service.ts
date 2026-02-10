import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFirebaseStorage } from '@/lib/firebase/storage';

export const uploadReceipt = async (
  userId: string,
  file: File
): Promise<string> => {
  const storage = getFirebaseStorage();
  const path = `users/${userId}/receipts/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
