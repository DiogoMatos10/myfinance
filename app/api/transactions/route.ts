import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/config';
import { formatZodError } from '@/lib/validations/zod';

const transactionSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1),
  categoryName: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().min(1),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json(
      { message: 'userId is required' },
      { status: 400 }
    );
  }

  const snapshot = await getDocs(
    query(
      collection(getFirestoreDb(), 'users', userId, 'transactions'),
      orderBy('date', 'desc')
    )
  );

  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = transactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodError(parsed.error), { status: 400 });
  }

  const { userId, ...payload } = parsed.data;
  const docRef = await addDoc(
    collection(getFirestoreDb(), 'users', userId, 'transactions'),
    {
      ...payload,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return NextResponse.json({ id: docRef.id, ...payload });
}
