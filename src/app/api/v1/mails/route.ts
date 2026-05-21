import { AuthService } from "@/lib/AuthService";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

const lastMailSent = new Map<string, number>();

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const t = await getTranslations("api");
  const user = await AuthService.authenticate(cookieStore);

  if (!user) {
    return NextResponse.json({
      message: t("notAuthenticated")
    }, {
      status: 401
    });
  }

  const lastSent = lastMailSent.get(user.id);
  if (lastSent && Date.now() - lastSent < 60000) {
    return NextResponse.json({
      message: t("rateLimitMail")
    }, {
      status: 429
    });
  }

  const { subject, message } = await req.json();

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({
      message: t("fillAllFields")
    }, {
      status: 400
    });
  }

  if (message.length > 3000) {
    return NextResponse.json({
      message: t("messageTooLong")
    }, {
      status: 400
    });
  }

  const safeSubject = escapeHtml(subject);
  const safeName = escapeHtml(user.name);
  const safeEmail = escapeHtml(user.email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  try {
    await axios.post(`${process.env.RESEND_API_URL}/emails`, {
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.RESEND_TO_EMAIL,
      reply_to: user.email,
      subject: `[Contato Linkedinsney] ${subject}`,
      html: `
          <p><strong>Nome:</strong> ${safeName}</p>
          <p><strong>E-mail:</strong> ${safeEmail}</p>
          <p><strong>Assunto:</strong> ${safeSubject}</p>
          <hr />
          <p><strong>Mensagem:</strong></p>
          <p>${safeMessage}</p>
        `,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`
      },
    });
  } catch {
    return NextResponse.json({
      message: t("mailSendError")
    }, {
      status: 500
    });
  }

  lastMailSent.set(user.id, Date.now());

  return NextResponse.json({
    ok: true
  });
}
