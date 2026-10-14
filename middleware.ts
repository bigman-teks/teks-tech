import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE } from "@/lib/auth";
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(COOKIE)?.value);
  const needsAuth = pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || pathname.startsWith("/invitations/create") || pathname.startsWith("/invitations/build") || pathname.startsWith("/invitations/upload") || pathname.startsWith("/invitations/dashboard");
  if (needsAuth && !session) {
    const url = new URL("/login", req.url); url.searchParams.set("next", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin") && session?.role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/invitations/create/:path*", "/invitations/build/:path*", "/invitations/upload/:path*", "/invitations/dashboard/:path*"] };
