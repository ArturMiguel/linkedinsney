"use client"

import { Container } from "@/components/ui/container";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <Container>
        <div className="py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            ✨ Transformando realidade em propósito
          </div>
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Seu chefe não vai entender.
            <br />
            <span className="text-primary">O LinkedIn vai adorar.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
            Cole qualquer texto honesto. Receba um post corporativo impecável.
            <br />
            <span className="text-sm">
              Ou cole um post do LinkedIn e descubra o que a pessoa realmente quis dizer.
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
};
