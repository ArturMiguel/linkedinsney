"use client"

import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Entrar
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover">
            Criar conta
          </Button>
        </div>
      </div>
    </header>
  );
};
