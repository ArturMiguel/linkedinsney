import { SignJWT, jwtVerify } from "jose";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

const COOKIE_NAME = "linkedinsney_token";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_THRESHOLD_SECONDS = 60 * 60;

type CookieStore = ReadonlyRequestCookies | RequestCookies;

export type SessionPayload = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

export class AuthService {
  private static getSecret(): Uint8Array {
    return new TextEncoder().encode(process.env.JWT_SECRET);
  }

  static async issueToken(payload: SessionPayload): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
      .sign(this.getSecret());
  }

  static async verifyToken(token: string): Promise<SessionPayload & { exp: number; iat: number }> {
    const { payload } = await jwtVerify(token, this.getSecret());
    return payload as SessionPayload & { exp: number; iat: number };
  }

  static async setSessionCookie(cookieStore: CookieStore, token: string): Promise<void> {
    (cookieStore as any).set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_DURATION_SECONDS,
    });
  }

  static getToken(cookieStore: CookieStore): string | undefined {
    return cookieStore.get(COOKIE_NAME)?.value;
  }

  static async authenticate(cookieStore: CookieStore): Promise<SessionPayload | null> {
    const token = this.getToken(cookieStore);
    if (!token) return null;

    try {
      const payload = await this.verifyToken(token);
      const timeRemaining = payload.exp - Math.floor(Date.now() / 1000);

      if (timeRemaining < REFRESH_THRESHOLD_SECONDS) {
        const newToken = await this.issueToken({
          id: payload.id,
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        });
        await this.setSessionCookie(cookieStore, newToken);
      }

      return {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      };
    } catch {
      return null;
    }
  }
}
