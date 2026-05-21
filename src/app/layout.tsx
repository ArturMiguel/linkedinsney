import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://linkedinsney.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Linkedinsney - Tradutor de Posts para LinkedIn",
    template: "%s | Linkedinsney",
  },
  description: "Cole qualquer texto honesto e receba um post corporativo impecável com buzzwords, propósito e emojis. O gerador de posts para LinkedIn com IA que transforma realidade em jornada.",
  keywords: [
    "gerador de posts LinkedIn",
    "tradutor corporativo",
    "linkedisney",
    "linkedinsney",
    "posts LinkedIn com IA",
    "buzzwords corporativos",
    "gerador de texto corporativo",
    "post LinkedIn automático",
    "humor corporativo",
    "satirizar LinkedIn",
    "propósito mindset jornada",
  ],
  authors: [{
    name: "Artur Miguel (artur@artcode.dev)"
  }],
  creator: "Artur Miguel (artur@artcode.dev)",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Linkedinsney",
    title: "Linkedinsney - Tradutor de Posts para LinkedIn",
    description: "Seu texto honesto virou propósito. Cole qualquer mensagem e receba um post corporativo cheio de buzzwords e impacto. Powered by IA.",
    images: [
      {
        url: "/logo.png",
        alt: "Linkedinsney - Tradutor de Posts para LinkedIn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkedinsney - Tradutor de Posts para LinkedIn",
    description: "Cole seu texto honesto e receba um post corporativo digno do LinkedIn. Buzzwords, propósito e emojis inclusos.",
    images: ["/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={cn("h-full", "antialiased", geistSans.variable, jetbrainsMono.variable)} suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <NextIntlClientProvider>
            <AuthProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
              <Toaster position="top-center" richColors closeButton />
            </AuthProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
