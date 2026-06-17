import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static assets, api, and the access page itself
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/access' ||
    pathname.includes('.') // Skip files like .png, .svg, etc.
  ) {
    return NextResponse.next();
  }

  // Get the auth cookie
  const authCookie = request.cookies.get('site_pwd_auth');
  
  // If not authenticated, redirect to /access
  if (authCookie?.value !== 'authenticated') {
    const accessUrl = new URL('/access', request.url);
    // Optionally preserve the original URL
    if (pathname !== '/') {
      accessUrl.searchParams.set('from', pathname);
    }
    return NextResponse.redirect(accessUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
