import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath: boolean = path === "/login" || path === "/signup";

  const token = request.cookies.get("token")?.value;

  // User logged in and trying to access public paths like - login/signup. Redirect him to /
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // User not logged in and trying to access secure paths like profile. Redirect him to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// matching path that the middleware would run
export const config = {
  matcher: ["/", "/login", "/signup", "/profile/:userId*"],
};
