import prisma from '@/lib/prisma';
import { SignInOptionsDTO } from '@/types/SignInOptionsDTO';
import { SignInTypeEnum } from '@/types/SignInTypeEnum';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function verifyGoogleToken(credential: string) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
  if (!response.ok) throw new Error("Token do Google inválido.");

  const payload = await response.json();

  if (payload.aud !== process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID) {
    throw new Error("Token não pertence a este aplicativo.");
  }

  return payload;
}

export async function POST(request: NextRequest) {
  try {
    const json: SignInOptionsDTO = await request.json();

    let userPayload: any = null;

    switch (json.type) {
      case SignInTypeEnum.GOOGLE:
        if (!json.google?.credential) {
          throw new Error("Credencial Google não informada.")
        };
        userPayload = await verifyGoogleToken(json.google.credential);
        break;
      default:
        throw new Error("Tipo de autenticação desconhecido.");
    }

    const credential = json.google!.credential;
    const decoded = jwtDecode(credential);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "linkedinsney_token",
      value: credential,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(decoded.exp! * 1000),
      maxAge: decoded.exp! - decoded.iat!
    });

    await prisma.user.upsert({
      where: {
        email: userPayload.email
      },
      update: {
        name: userPayload.name
      },
      create: {
        email: userPayload.email,
        name: userPayload.name
      },
    });

    return NextResponse.json({
      name: userPayload.name,
      email: userPayload.email,
      picture: userPayload.picture,
    }, {
      status: 200
    });

  } catch (error: any) {
    return NextResponse.json({
      message: error.message
    }, {
      status: 401
    });
  }
}
