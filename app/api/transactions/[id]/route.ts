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
import { logApiRequest, logApiResponse, logWarn } from '@/lib/server-logger';

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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startedAt = Date.now();
  const { id } = await params;
  logApiRequest(request, {
    route: 'GET /api/transactions/[id]',
    params: { id },
  });
  const response = NextResponse.json({
    id,
    message: 'Use /api/transactions?userId=',
  });
  logApiResponse(request, response.status, startedAt);
  return response;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startedAt = Date.now();
  const body = await request.json().catch(() => null);
  logApiRequest(request, {
    route: 'PUT /api/transactions/[id]',
    body,
  });
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    logWarn('api.validation', {
      route: 'PUT /api/transactions/[id]',
      issues: parsed.error.issues,
    });
    return NextResponse.json(formatZodError(parsed.error), { status: 400 });
  }

  const { userId, ...payload } = parsed.data;
  const { id } = await params;
  const ref = doc(getFirestoreDb(), 'users', userId, 'transactions', id);
  await updateDoc(ref, { ...payload, updatedAt: serverTimestamp() });
  const response = NextResponse.json({ id, ...payload });
  logApiResponse(request, response.status, startedAt);
  return response;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startedAt = Date.now();
  const userId = request.nextUrl.searchParams.get('userId');
  logApiRequest(request, {
    route: 'DELETE /api/transactions/[id]',
    params: { userId: userId || undefined },
  });
  if (!userId) {
    logWarn('api.validation', {
      route: 'DELETE /api/transactions/[id]',
      reason: 'missing_userId',
    });
    return NextResponse.json(
      { message: 'userId is required' },
      { status: 400 }
    );
  }

  const { id } = await params;
  const ref = doc(getFirestoreDb(), 'users', userId, 'transactions', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    logWarn('api.not_found', {
      route: 'DELETE /api/transactions/[id]',
      id,
    });
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  await deleteDoc(ref);
  const response = NextResponse.json({ ok: true });
  logApiResponse(request, response.status, startedAt);
  return response;
}
