import { AuthService } from "@/lib/AuthService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const user = await AuthService.authenticate(cookieStore);

  if (!user) {
    return NextResponse.json({
      message: "Não autenticado."
    }, {
      status: 401
    });
  }

  return NextResponse.json(user);
}
