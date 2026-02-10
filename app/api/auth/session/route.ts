import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { formatZodError } from '@/lib/validations/zod';

const sessionSchema = z.object({
  token: z.string().min(1, 'Session token is required'),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(formatZodError(parsed.error), { status: 400 });
  }

  const { token } = parsed.data;

  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', '', { path: '/', maxAge: 0 });
  return response;
}
