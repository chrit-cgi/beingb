import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/api/auth"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname === "/manifest.json" ||
    /\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|map|txt|webmanifest)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Auth.js sets this cookie (prefixed with __Secure- on HTTPS)
  const hasSession =
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token");

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
