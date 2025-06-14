import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath: boolean =
    path === "/login" || path === "/signup" || path === "/verify-email";

  const token = request.cookies.get("token")?.value;

  // User logged in and trying to access public paths like - login/signup. Redirect him to /
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // User not logged in and trying to access secure paths like profile. Redirect him to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
      const { payload } = await jwtVerify(token, secret);

      const response = NextResponse.next();
      response.headers.set("x-user-id", payload.id as string);
      return response;
    } catch (error) {
      console.error("JWT verification failed: ", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// matching path that the middleware would run
export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/profile/:userId*",
    "/verify-email",
    "/api/users/me",
    "/api/users/logout",
  ],
};
