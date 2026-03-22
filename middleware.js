// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "sensai_token";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/resume", "/cover-letter", "/interview", "/career", "/admin"];

// Routes that require admin role
const ADMIN_ROUTES = ["/admin"];

// Routes only for unauthenticated users
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // No token — redirect to login for protected routes
  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Authenticated user trying to access login/signup → go to dashboard
      if (isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      // Non-admin trying to access admin route
      if (isAdminRoute && payload.role !== "ADMIN") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }

      // Inject user info into headers for server components
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.id);
      requestHeaders.set("x-user-email", payload.email);
      requestHeaders.set("x-user-role", payload.role);
      requestHeaders.set("x-user-name", payload.name || "");

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      // Invalid/expired token — clear it and redirect to login
      if (isProtected) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        const response = NextResponse.redirect(url);
        response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
