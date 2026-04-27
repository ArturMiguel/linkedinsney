"use client"

import Link from "next/link";
import { LinkedinLogoIcon, MagicWandIcon } from "@phosphor-icons/react";
import { CopyIcon } from "@phosphor-icons/react/dist/ssr";

const steps = [
  { icon: CopyIcon, title: "Cole seu texto", desc: "Aquela verdade nua e crua." },
  { icon: MagicWandIcon, title: "Clique em traduzir", desc: "A mágica do propósito acontece." },
  { icon: LinkedinLogoIcon, title: "Poste no LinkedIn", desc: "Receba likes e abraços corporativos." },
];

export const HowItWorks = () => {
  return (
    <section className="bg-surface-soft py-16">
      <div>
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Como funciona
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          O Linkedinsney é um tradutor de textos para posts no LinkedIn alimentado por inteligência artificial.
          Cole qualquer texto honesto e receba em segundos um post corporativo com buzzwords, propósito e emojis.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition-shadow hover:shadow-elevated"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Passo {i + 1}
              </div>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Ao usar o Linkedinsney, você concorda com nossos{" "}
          <Link href="/agreements/terms-of-use" className="underline underline-offset-2 hover:text-foreground">
            Termos de Uso
          </Link>{" "}
          e nossa{" "}
          <Link href="/agreements/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </section>
  );
};
