import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/AuthService";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/history")) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();

  if (!cookieStore.has("linkedinsney_token")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    await AuthService.verifyToken(cookieStore.get("linkedinsney_token")!.value);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
