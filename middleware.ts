import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ['/auth/signin'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // Get the token from cookies
  const authToken = request.cookies.get('authToken') || 
                   (request.headers.get('authorization')?.startsWith('Bearer ') ? 
                    request.headers.get('authorization')?.substring(7) : null);

  // Redirect authenticated users away from auth pages
  if (isPublicPath && authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to sign in
  if (!isPublicPath && !authToken) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};