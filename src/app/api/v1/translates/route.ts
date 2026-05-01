import { jwtDecode } from "jwt-decode";
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
  - O texto deve soar sincero e levemente exagerado, nunca sarcástico de forma explícita
  - Adicione uma reflexão filosófica ou chamada para engajamento no final, variando entre: \"E você, já parou para pensar nisso?\", \"Comenta aqui o que você acha 👇\", \"Qual foi o seu aprendizado hoje?\", \"Me conta nos comentários 💬\"
  - Nunca reconheça problemas como problemas — tudo é \"desafio\", \"aprendizado\" ou \"oportunidade de melhoria\"
  - Use emojis corporativos moderadamente (mas sempre use algum): 🚀 💡 🙏 ✨ 💼
  - Não use formatações como negrito, itálico, sublinhado ou qualquer símbolo markdown, incluindo **, __, ##
  - Use \n para quebras de linha entre parágrafos
  - Ao final do texto, quebre linha com \n e adicione exatamente 3 hashtags relevantes ao contexto da mensagem, no formato #PalavraChave
  - Responda APENAS com o texto traduzido, sem explicações ou comentários adicionais
  - O texto deve conter até 3 parágrafos, sendo o primeiro focado na transformação do problema, o segundo detalhando o aprendizado ou oportunidade e o terceiro convidando à reflexão ou engajamento, seguido das hashtags
`;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("linkedinsney_token")?.value;

  if (!token) {
    return NextResponse.json({
      error: "Não autenticado."
    }, {
      status: 401
    });
  }

  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (decoded.exp * 1000 < Date.now()) {
      return NextResponse.json({
        error: "Sessão expirada."
      }, {
        status: 401
      });
    }
  } catch {
    return NextResponse.json({
      error: "Token inválido."
    }, {
      status: 401
    });
  }

  const { text } = await req.json();

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({
      error: "Informe o texto a ser traduzido"
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

  const content: string = data?.message?.content ?? "";

  return NextResponse.json({
    result: content.replace(/\*/g, "")
  });
}
