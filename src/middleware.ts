import { NextRequest, NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/terms",
  "/privacy",
];

// Define auth routes that should redirect to dashboard if already authenticated
const authRoutes = [
  "/auth/login",
  "/auth/signup",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated by looking for access token in cookies/headers
  // In a real implementation, you might want to verify the token
  const accessToken = request.cookies.get("wais_access_token")?.value;
  const isAuthenticated = !!accessToken;

  // Handle auth routes
  if (authRoutes.includes(pathname)) {
    if (isAuthenticated) {
      // Redirect authenticated users away from auth pages
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Handle public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (!isAuthenticated) {
    // Redirect unauthenticated users to login
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
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
     * - manifest.json (PWA manifest)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\..*).*)",
  ],
};
