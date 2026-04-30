"use client"

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";

const examples = [
  {
    input: "Fui demitido hoje. Estou perdido e com medo do futuro.",
    output:
      "Hoje encerro um ciclo e abro um novo capítulo cheio de possibilidades. Gratidão pela jornada! 🚀 #NovoComeço #Resiliencia",
  },
  {
    input: "A reunião de 2h podia ter sido um e-mail.",
    output: "Hoje participei de um alinhamento estratégico transformador. Comunicação é tudo! 💙 #Lideranca #Colaboracao",
  },
  {
    input: "Trabalhei no fim de semana de novo. Estou exausto.",
    output: "Dedicação não tem hora. Quem ama o que faz, transforma sábado em propósito. 🙏 #Mindset #Gratidao",
  },
];

function useCountUp(target: number, duration = 1500) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.floor(p * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

export const SocialProof = () => {
  const count = useCountUp(28473);
  return (
    <section className="bg-background py-16">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-gradient-hero p-6 text-center shadow-soft">
          <div className="text-4xl font-extrabold text-primary tabular-nums sm:text-5xl">
            {count.toLocaleString("pt-BR")}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            posts corporativos já traduzidos com propósito ✨
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {examples.map((ex, i) => (
            <article
              key={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
            >
              <p className="text-sm italic text-muted-foreground">"{ex.input}"</p>
              <div className="my-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                <ArrowRightIcon className="h-3.5 w-3.5" />
                Versão Linkedisney
              </div>
              <p className="text-sm text-foreground">{ex.output}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
