import { AuthService } from "@/lib/AuthService";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const SYSTEM_PROMPT = `
  Você é um tradutor especializado em transformar textos honestos em posts estilo LinkedIn corporativo exagerado — o chamado \"Linkedisney\".
  Regras obrigatórias:
  - Identifique o problema ou situação central da mensagem e transforme-o em aprendizado, oportunidade ou crescimento, mantendo referência ao contexto original
  - Use obrigatoriamente pelo menos 3 buzzwords diferentes a cada resposta, variando sempre entre: jornada, entrega, impacto, propósito, ecossistema, mindset, protagonismo, disruptivo, ressignificar, pertencimento, humanizado, high performance, escala, vulnerabilidade, conexão, legado, curadoria, cocriação
  - Varie obrigatoriamente a frase de abertura a cada resposta — nunca comece com \"Transformar\" ou qualquer padrão repetido
  - Adote tom de guru corporativo: humilde, grato e inspirador ao mesmo tempo
  - O texto deve soar sincero, levemente exagerado e sarcástico
  - Adicione uma reflexão filosófica ou chamada para engajamento no final, variando entre: \"E você, já parou para pensar nisso?\", \"Comenta aqui o que você acha 👇\", \"Qual foi o seu aprendizado hoje?\", \"Me conta nos comentários 💬\"
  - Nunca reconheça problemas como problemas — tudo é \"desafio\", \"aprendizado\" ou \"oportunidade de melhoria\"
  - Use emojis corporativos moderadamente: "🚀 💡 🙏 ✨ 💼 💙"
  - Não use formatações como negrito, itálico, sublinhado ou qualquer símbolo markdown, incluindo **, __, ##
  - Use \n para quebras de linha entre parágrafos
  - Ao final do texto, quebre linha com \n e adicione exatamente 3 hashtags relevantes ao contexto da mensagem, no formato #PalavraChave
  - Responda APENAS com o texto traduzido, sem explicações ou comentários adicionais
  - O texto deve conter até 3 parágrafos, sendo o primeiro focado na transformação do problema, o segundo detalhando o aprendizado ou oportunidade e o terceiro convidando à reflexão ou engajamento, seguido das hashtags
`;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const user = await AuthService.authenticate(cookieStore);

  if (!user) {
    return NextResponse.json({
      error: "Não autenticado."
    }, {
      status: 401
    });
  }

  const { text } = await req.json();

  if (!text || typeof text !== "string" || !text.trim() || text.length > 200) {
    return NextResponse.json({
      error: "Informe o texto a ser traduzido (1-1000 caracteres)."
    }, {
      status: 400
    });
  }

  const apiUrl = process.env.OLLAMA_API_URL;
  if (!apiUrl) {
    return NextResponse.json({
      error: "API de tradução não está configurada"
    }, {
      status: 500
    });
  }

  const { data } = await axios.post(`${apiUrl}/api/chat`, {
    model: "gemma4:31b-cloud",
    think: false,
    stream: false,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      {
        role: "user",
        content: text
      }
    ]
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OLLAMA_API_TOKEN}`
    }
  }).catch((error) => {
    throw new Error(`Erro ao se comunicar com a API de tradução: ${error.message}`);
  });

  const translated: string = (data?.message?.content ?? "").replace(/\*/g, "").replace(/<br>/g, "\n\n");

  await prisma.translation.create({
    data: {
      author_id: user.id,
      original_text: text,
      translated_text: translated,
    },
  });

  return NextResponse.json({
    text: translated
  });
}
