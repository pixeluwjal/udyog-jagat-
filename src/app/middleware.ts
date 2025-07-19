import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedPaths = ["/dashboard", "/profile"];

  if (protectedPaths.some((p) => path.startsWith(p))) {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}