"use client"

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import axios from "axios";
import { Alert } from "@/lib/Alert";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("socialProof");
  const examples = t.raw("examples") as { input: string; output: string }[];
  const [target, setTarget] = useState(0);

  const count = useCountUp(target);

  useEffect(() => {
    axios.get("/api/v1/translates/counts").then(({ data }) => {
      setTarget(data.data)
    }).catch((error: any) => {
      Alert.error("", error.response?.data?.message);
    });
  }, []);

  return (
    <section className="bg-background py-16">
      <Container>
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-gradient-hero p-6 text-center shadow-soft">
          <div className="text-4xl font-extrabold text-primary tabular-nums sm:text-5xl">
            {count.toLocaleString("pt-BR")}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("counter")}
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
                {t("exampleLabel")}
              </div>
              <p className="text-sm text-foreground">{ex.output}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
