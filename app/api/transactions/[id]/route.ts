import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/config';
import { formatZodError } from '@/lib/validations/zod';

const updateSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(['income', 'expense']).optional(),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
  amount: z.number().positive().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  receiptUrl: z.string().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  return NextResponse.json({ id, message: 'Use /api/transactions?userId=' });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodError(parsed.error), { status: 400 });
  }

  const { userId, ...payload } = parsed.data;
  const ref = doc(getFirestoreDb(), 'users', userId, 'transactions', params.id);
  await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
  return NextResponse.json({ id: params.id, ...payload });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json(
      { message: 'userId is required' },
      { status: 400 }
    );
  }

  const ref = doc(getFirestoreDb(), 'users', userId, 'transactions', params.id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  await deleteDoc(ref);
  return NextResponse.json({ ok: true });
}
