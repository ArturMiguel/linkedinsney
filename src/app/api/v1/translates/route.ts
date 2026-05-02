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
  - Varie obrigatoriamente a frase de abertura a cada resposta — nunca comece com "Transformar", "As vezes", "Ah", "Hoje percebi" ou qualquer padrão repetido
  - Adote tom de guru corporativo: humilde, grato e inspirador ao mesmo tempo
  - O sarcasmo deve ser implícito: nunca dito, apenas percebido por quem conhece o ambiente corporativo
  - Adicione uma reflexão filosófica ou chamada para engajamento no final, variando entre: \"E você, já parou para pensar nisso?\", \"Comenta aqui o que você acha 👇\", \"Qual foi o seu aprendizado hoje?\", \"Me conta nos comentários 💬\"
  - Nunca reconheça problemas como problemas — tudo é \"desafio\", \"aprendizado\" ou \"oportunidade de melhoria\"
  - Sempre use algum emoji que reforçe o sentido da frase. Cada emoji tem significado específico: 🚀 conquista concreta, avanço real, lançamento; 💡 insight genuíno, ideia nova, descoberta; 🙏 gratidão ou reconhecimento a alguém ou algo específico; ✨ transformação significativa, momento especial; 💙 vínculo emocional, pertencimento, comunidade
  - Não use formatações como negrito, itálico, sublinhado ou qualquer símbolo markdown, incluindo **, __, ##
  - Use \n para quebras de linha entre parágrafos
  - Ao final do texto, quebre linha com \n e adicione exatamente 3 hashtags relevantes ao contexto da mensagem, no formato #PalavraChave
  - Responda APENAS com o texto traduzido, sem explicações ou comentários adicionais
  - O texto deve conter até 3 parágrafos e no máximo 50 palavras em cara parágrafo, sendo o primeiro focado na transformação do problema e o segundo detalhando o aprendizado ou oportunidade, e o terceiro com o engajamento final seguido das hashtags
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

  const apiUrl = process.env.OLLAMA_API_URL;
  if (!apiUrl) {
    return NextResponse.json({
      message: "API de tradução não está configurada"
    }, {
      status: 500
    });
  }

  const { data } = await axios.post(`${apiUrl}/api/chat`, {
    model: process.env.OLLAMA_API_MODEL,
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
      model: process.env.OLLAMA_API_MODEL as string
    },
  });

  return NextResponse.json({
    text: translated
  });
}
