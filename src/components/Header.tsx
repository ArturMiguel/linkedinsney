"use client"

import Script from "next/script";
import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Logo } from "./Logo";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "./ui/button";

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
        await signIn(response.credential);
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
            <div className="flex items-center gap-3">
              {!loading && (
                user ? (
                  <>
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="hidden sm:block text-sm text-foreground">{user.name}</span>
                    <Button variant="ghost" size="sm" onClick={signOut}>
                      Sair
                    </Button>
                  </>
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
