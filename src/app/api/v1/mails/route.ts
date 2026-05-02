import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({
      message: "Preencha todos os campos."
    }, {
      status: 400
    });
  }

  if (message.length > 1000) {
    return NextResponse.json({
      message: "Mensagem muito longa."
    }, {
      status: 400

    });
  }

  await axios.post(`${process.env.RESEND_API_URL}/emails`, {
    from: process.env.RESEND_FROM_EMAIL,
    to: process.env.RESEND_TO_EMAIL,
    reply_to: email,
    subject: `[Contato Linkedinsney] ${subject}`,
    html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <hr />
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`
    },
  });

  return NextResponse.json({
    ok: true
  });
}
