import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = "https://linkedisney.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Linkedisney — Tradutor de Posts para LinkedIn",
    template: "%s | Linkedisney",
  },
  description:
    "Cole qualquer texto honesto e receba um post corporativo impecável com buzzwords, propósito e emojis. O gerador de posts para LinkedIn com IA que transforma realidade em jornada.",
  keywords: [
    "gerador de posts LinkedIn",
    "tradutor corporativo",
    "linkedisney",
    "posts LinkedIn com IA",
    "buzzwords corporativos",
    "gerador de texto corporativo",
    "post LinkedIn automático",
    "humor corporativo",
    "satirizar LinkedIn",
    "propósito mindset jornada",
  ],
  authors: [{ name: "Linkedisney" }],
  creator: "Linkedisney",
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
    siteName: "Linkedisney",
    title: "Linkedisney — Tradutor de Posts para LinkedIn",
    description: "Seu texto honesto virou propósito. Cole qualquer mensagem e receba um post corporativo cheio de buzzwords e impacto. Powered by IA.",
    images: [
      {
        url: "/logo.png",
        alt: "Linkedisney — Tradutor de Posts para LinkedIn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkedisney — Tradutor de Posts para LinkedIn",
    description: "Cole seu texto honesto e receba um post corporativo digno do LinkedIn. Buzzwords, propósito e emojis inclusos.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", geistSans.variable, jetbrainsMono.variable)}>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
