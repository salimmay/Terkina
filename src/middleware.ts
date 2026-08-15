import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Subdomain routing (admin.terkina.com or admin.localhost:3000)
  const isSubdomain = hostname.startsWith('admin.');
  if (isSubdomain && !pathname.startsWith('/crm') && !pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = `/crm${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Protected paths for admin CRM
  const isCrmRoute = pathname.startsWith('/crm') || pathname.startsWith('/admin');
  const isLoginPage = pathname === '/crm/login' || pathname === '/admin/login';

  // Check custom auth cookie or session indicator
  const authToken = request.cookies.get('sb-access-token')?.value || request.cookies.get('terkina-admin-auth')?.value;

  // Redirect unauthenticated requests to login
  if (isCrmRoute && !isLoginPage && !authToken) {
    const loginUrl = new URL('/crm/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users visiting login page to CRM dashboard
  if (isLoginPage && authToken) {
    return NextResponse.redirect(new URL('/crm', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
