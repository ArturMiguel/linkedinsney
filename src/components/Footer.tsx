"use client"

import { LinkedinLogoIcon } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/container";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-surface-soft">
      <Container>
        <div className="grid gap-8 py-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {t("tagline")}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="mt-2 text-xs text-muted-foreground/60">
              {t("disclaimer")}
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground md:items-center">
            <a href="/contact" className="transition-colors hover:text-foreground">{t("contact")}</a>
            <a href="/agreements/terms-of-use" target="_blank" className="transition-colors hover:text-foreground">{t("termsOfUse")}</a>
            <a href="/agreements/privacy-policy" target="_blank" className="transition-colors hover:text-foreground">{t("privacyPolicy")}</a>
          </nav>
          <div className="flex gap-3 md:justify-end">
            <a
              href="https://www.linkedin.com/in/arturmiguelrocha"
              target="_blank"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-primary"
            >
              <LinkedinLogoIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
