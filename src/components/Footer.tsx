"use client"

import { GithubLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/container";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-surface-soft">
      <Container>
        <div className="grid gap-8 py-10 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Transformando realidade em propósito desde já.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              © {new Date().getFullYear()} Linkedinsney. Todos os propósitos reservados.
            </p>
          </div>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground md:items-center">
            <a href="#" className="transition-colors hover:text-foreground">Contato</a>
            <a href="/agreements/privacy-policy" target="_blank" className="transition-colors hover:text-foreground">Política de Privacidade</a>
            <a href="/agreements/terms-of-use" target="_blank" className="transition-colors hover:text-foreground">Termos de Uso</a>
          </nav>
          <div className="flex gap-3 md:justify-end">
            <a
              href="https://github.com/ArturMiguel"
              target="_blank"
              aria-label="Twitter"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubLogoIcon className="h-4 w-4" />
            </a>
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
