import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { formatZodError } from '@/lib/validations/zod';
import { logApiRequest, logApiResponse, logWarn } from '@/lib/server-logger';

const sessionSchema = z.object({
  token: z.string().min(1, 'Session token is required'),
});

export async function POST(request: NextRequest) {
  const startedAt = Date.now();
  const body = await request.json().catch(() => null);
  logApiRequest(request, {
    route: 'POST /api/auth/session',
    body,
  });
  const parsed = sessionSchema.safeParse(body);

  if (!parsed.success) {
    logWarn('api.validation', {
      route: 'POST /api/auth/session',
      issues: parsed.error.issues,
    });
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
  logApiResponse(request, response.status, startedAt);
  return response;
}

export async function DELETE(request: NextRequest) {
  const startedAt = Date.now();
  logApiRequest(request, {
    route: 'DELETE /api/auth/session',
  });
  const response = NextResponse.json({ ok: true });
  response.cookies.set('session', '', { path: '/', maxAge: 0 });
  logApiResponse(request, response.status, startedAt);
  return response;
}
