import { NextResponse, type NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Global In-Memory Rate Limiter
// DO NOT OPTIMIZE: The shared map ensures that every request hitting
// the edge middleware—from anywhere in the world—counts against the
// *same global counter*. Without this, deploying on Vercel's edge network
// would effectively give every user their own isolated rate limiter,
// rendering the global limit useless and exposing the backend to abuse.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const RATE_LIMIT_MAX = 60; // max requests per window per IP

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Periodic cleanup to avoid unbounded memory growth
  if (rateLimitMap.size > 10_000) {
    for (const [key, record] of rateLimitMap) {
      if (now > record.expiresAt) rateLimitMap.delete(key);
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count += 1;
  return false;
}

// ---------------------------------------------------------------------------
// Proxy
// ---------------------------------------------------------------------------
export async function proxy(request: NextRequest) {
  // 1. Global rate-limit check (before any routing logic)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown-ip';

  if (isRateLimited(ip)) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please slow down.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      },
    );
  }

  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 2. Subdomain routing (admin.terkina.com or admin.localhost:3000)
  const isSubdomain = hostname.startsWith('admin.');
  if (isSubdomain && !pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin${pathname}`;
    return NextResponse.rewrite(url);
  }

  // 3. Redirect legacy /crm paths to /admin
  if (pathname === '/crm') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (pathname.startsWith('/crm/')) {
    const newPath = pathname.replace(/^\/crm/, '/admin');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // 4. Protected paths for Admin Master Hub
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // Check custom auth cookie or session indicator
  const authToken =
    request.cookies.get('sb-access-token')?.value ||
    request.cookies.get('terkina-admin-auth')?.value;

  // Redirect unauthenticated requests to /admin/login
  if (isAdminRoute && !isLoginPage && !authToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users visiting login page to /admin dashboard
  if (isLoginPage && authToken) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
