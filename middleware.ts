import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session')?.value;

  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/icons') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico';

  if (isPublicAsset) {
    return NextResponse.next();
  }

  const publicRoutes = ['/login', '/register', '/reset-password'];

  if (!session && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
