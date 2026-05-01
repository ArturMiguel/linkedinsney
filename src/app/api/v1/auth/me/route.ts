import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("linkedinsney_token")?.value;

    if (!token) {
      return NextResponse.json({
        message: "Não autenticado."
      }, {
        status: 401
      });
    }

    const decoded = jwtDecode<{ name: string; email: string; picture: string; exp: number }>(token);

    if (decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({
        message: "Token expirado."
      }, {
        status: 401
      });
    }

    return NextResponse.json({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    });
  } catch {
    return NextResponse.json({
      message: "Token inválido."
    }, {
      status: 401
    });
  }
}
