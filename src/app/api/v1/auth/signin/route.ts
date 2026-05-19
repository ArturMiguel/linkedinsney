import prisma from '@/lib/prisma';
import { AuthService } from '@/lib/AuthService';
import { SignInOptionsDTO } from '@/types/SignInOptionsDTO';
import { SignInTypeEnum } from '@/types/SignInTypeEnum';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';

async function verifyGoogleToken(credential: string, t: Awaited<ReturnType<typeof getTranslations>>) {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
  if (!response.ok) throw new Error(t("invalidGoogleToken"));

  const payload = await response.json();

  if (payload.aud !== process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID) {
    throw new Error(t("tokenMismatch"));
  }

  return payload;
}

export async function POST(request: NextRequest) {
  try {
    const t = await getTranslations("api");
    const json: SignInOptionsDTO = await request.json();

    let userPayload: any = null;

    switch (json.type) {
      case SignInTypeEnum.GOOGLE:
        if (!json.google?.credential) throw new Error(t("googleCredentialMissing"));
        userPayload = await verifyGoogleToken(json.google.credential, t);
        break;
      default:
        throw new Error(t("unknownAuthType"));
    }

    const user = await prisma.user.upsert({
      where: {
        email: userPayload.email
      },
      update: {
        name: userPayload.name
      },
      create: {
        email: userPayload.email,
        name: userPayload.name,
      },
    });

    const session = {
      id: user.id,
      name: userPayload.name,
      email: userPayload.email,
      picture: userPayload.picture,
    };
    const token = await AuthService.issueToken(session);
    const cookieStore = await cookies();
    await AuthService.setSessionCookie(cookieStore, token);

    return NextResponse.json({
      user: session
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
