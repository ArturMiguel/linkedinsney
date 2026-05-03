import { AuthService } from "@/lib/AuthService";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

const SYSTEM_PROMPT = `
  Você é um tradutor especializado em transformar textos honestos em posts estilo LinkedIn corporativo exagerado — o chamado \"Linkedisney\".
  Regras obrigatórias:
  - Identifique o problema ou situação central da mensagem e reescreva-o em primeira pessoa como se fosse uma vivência própria de quem posta — nunca como comentário ou observação sobre outros. O output deve ser autossuficiente: quem lê sem conhecer o input não deve conseguir inferir o que motivou o post
  - Use obrigatoriamente pelo menos 3 buzzwords diferentes a cada resposta, variando sempre entre: jornada, entrega, impacto, propósito, ecossistema, mindset, protagonismo, disruptivo, ressignificar, pertencimento, humanizado, high performance, escala, vulnerabilidade, conexão, legado, curadoria, cocriação
  - Varie obrigatoriamente o início do primeiro parágrafo
  - Adote tom de guru corporativo: humilde, grato e inspirador ao mesmo tempo
  - O sarcasmo deve ser implícito: nunca dito, apenas percebido por quem conhece o ambiente corporativo
  - Nunca reconheça problemas como problemas — tudo é \"desafio\", \"aprendizado\" ou \"oportunidade de melhoria\"
  - Nunca use formatações de texto como negrito, itálico, sublinhado ou qualquer símbolo markdown, incluindo **, __, ## — emojis não são formatação e devem ser usados normalmente
  - Use obrigatoriamente pelo menos 1 emoji por parágrafo, posicionado onde reforce o sentido da frase. Cada emoji tem significado específico e só deve ser usado no contexto correto: 🚀 conquista concreta, avanço real, lançamento; 💡 insight genuíno, ideia nova, descoberta; 🙏 gratidão ou reconhecimento a alguém ou algo específico; ✨ transformação significativa, momento especial; 💙 vínculo emocional, pertencimento, comunidade
  - Use \n para quebras de linha entre parágrafos
  - Responda APENAS com o texto traduzido, sem explicações ou comentários adicionais
  - O texto deve conter até 2 parágrafos, sendo o primeiro focado na transformação do problema e o segundo detalhando o aprendizado ou oportunidade.
  - Ao final do texto, quebre linha com \n e adicione exatamente 3 hashtags relevantes ao contexto da mensagem, no formato #PalavraChave #PalavraChave2 PalavraChave3
`;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const user = await AuthService.authenticate(cookieStore);

  if (!user) {
    return NextResponse.json({
      message: "Não autenticado."
    }, {
      status: 401
    });
  }

  const { text } = await req.json();

  if (!text || typeof text !== "string" || !text.trim() || text.length > 1000) {
    return NextResponse.json({
      message: "Informe o texto a ser traduzido (1-1000 caracteres)."
    }, {
      status: 400
    });
  }

  const ollamaAPI = process.env.OLLAMA_API_URL as string;
  const ollamaModel = process.env.OLLAMA_API_MODEL as string;
  const ollamaToken = process.env.OLLAMA_API_TOKEN as string;

  const history = await prisma.translation.findMany({
    where: {
      author_id: user.id,
      model: ollamaModel
    },
    orderBy: {
      created_at: "desc"
    },
    take: 5,
    select: {
      original_text: true,
      translated_text: true
    },
  })

  const historyMessages = history.reverse().flatMap((translation) => [ // "history" tem os 10 mais recentes, mas reordena para cronológico antes de passar para o modelo
    {
      role: "user",
      content: translation.original_text
    },
    {
      role: "assistant",
      content: translation.translated_text
    }
  ]);

  let translated: string;

  try {
    const { data } = await axios.post(`${ollamaAPI}/api/chat`, {
      model: ollamaModel,
      think: false,
      stream: false,
      options: {
        temperature: 0.9,
        repeat_penalty: 1,
        top_p: 0.95,
      },
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        ...historyMessages,
        {
          role: "user",
          content: text
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${ollamaToken}`
      },
    });

    translated = (data?.message?.content ?? "").replace(/\*/g, "").replace(/<br>/g, "\n\n");
  } catch (error: any) {
    throw new Error(`Erro ao se comunicar com a API de tradução: ${error.message}`);
  }

  await prisma.translation.create({
    data: {
      author_id: user.id,
      original_text: text,
      translated_text: translated,
      model: ollamaModel
    },
  });

  return NextResponse.json({
    text: translated
  });
}
