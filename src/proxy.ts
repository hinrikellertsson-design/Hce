import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (!req.auth) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/kennari") && role !== "TEACHER") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/nemandi") && role !== "STUDENT") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/kennari/:path*", "/nemandi/:path*"],
};
