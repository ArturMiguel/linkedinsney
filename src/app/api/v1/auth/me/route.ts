import { AuthService } from "@/lib/AuthService";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

export async function GET() {
  const cookieStore = await cookies();
  const user = await AuthService.authenticate(cookieStore);

  if (!user) {
    const t = await getTranslations("api");
    return NextResponse.json({
      message: t("notAuthenticated")
    }, {
      status: 401
    });
  }

  return NextResponse.json(user);
}
