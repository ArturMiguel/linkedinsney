import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

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

    const decoded: any = jwtDecode(token);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({
        message: "Sessão expirada."
      }, {
        status: 401
      });
    }

    return NextResponse.json({
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    }, {
      status: 200
    });

  } catch {
    return NextResponse.json({
      message: "Não autenticado."
    }, {
      status: 401
    });
  }
}
