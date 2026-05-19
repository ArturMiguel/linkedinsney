"use client"

import { Container } from "@/components/ui/container";
import { useTranslations } from "next-intl";

export const Hero = () => {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <Container>
        <div className="py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
            ✨ {t("badge")}
          </div>
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t("titleLine1")}
            <br />
            <span className="text-primary">{t("titleLine2")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
            {t("description")}
            <br />
            <span className="text-sm">
              {t("descriptionSub")}
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
};
