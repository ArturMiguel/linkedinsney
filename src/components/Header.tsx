"use client"

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Logo } from "./Logo";
import { useAuth } from "@/providers/AuthProvider";
import { Alert } from "@/lib/Alert";
import { ThemeToggle } from "./ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SignOutIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";

export const Header = () => {
  const { user, loading, signIn, signOut } = useAuth();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const gsiInitialized = useRef(false);

  function initGsi() {
    const google = (window as any).google;
    if (!google || gsiInitialized.current) return;

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
      callback: async (response: any) => {
        try {
          await signIn(response.credential);
        } catch (error: any) {
          Alert.error("", error.response?.data?.message ?? error.message);
        }
      },
    });

    gsiInitialized.current = true;
    renderGsiButton();
  }

  function renderGsiButton() {
    const google = (window as any).google;
    if (!google || !googleBtnRef.current) return;

    google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "medium",
      text: "signin_with",
      shape: "rectangular",
    });
  }

  useEffect(() => {
    if (!loading && !user) {
      renderGsiButton();
    }
  }, [loading, user]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => initGsi()}
      />

      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <nav className="hidden items-center gap-x-6 text-sm font-medium text-muted-foreground sm:flex">
              <a href="/#translator" className="transition-colors hover:text-foreground">Traduzir</a>
              <a href="/#how-it-works" className="transition-colors hover:text-foreground">Como funciona?</a>
              <Link href="/contact" className="transition-colors hover:text-foreground">Contato</Link>
            </nav>
            <div className="flex items-center gap-x-4">
              <ThemeToggle />
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="h-8 w-8 cursor-pointer rounded-full ring-2 ring-transparent transition-all hover:ring-border"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuLabel className="font-normal">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/history">
                          <ClockCounterClockwiseIcon className="mr-2 h-4 w-4" />
                          Histórico
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                        <SignOutIcon className="mr-2 h-4 w-4" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div ref={googleBtnRef} />
                )
              )}
            </div>
          </div>
        </Container>
      </header>
    </>
  );
};
