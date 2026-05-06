"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";
import { Alert } from "@/lib/Alert";

type Translation = {
  id: string;
  original_text: string;
  translated_text: string;
  mode: string;
  created_at: string;
};

type ApiResponse = {
  data: Translation[];
  total: number;
  page: number;
  hasMore: boolean;
};

export default function HistoryPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTranslations = async (pageNum: number, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const { data } = await axios.get<ApiResponse>(`/api/v1/translates?page=${pageNum}`);
      setTranslations((prev) => (append ? [...prev, ...data.data] : data.data));
      setHasMore(data.hasMore);
      setPage(data.page);
    } catch (error: any) {
      Alert.error("", error.response.data.message);
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTranslations(1);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12">
          <Container>
            <div className="mb-8 flex items-center gap-4">
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
                  <ClockCounterClockwiseIcon className="h-6 w-6 text-primary" />
                  Histórico de Traduções
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Suas traduções anteriores, da mais recente à mais antiga.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div className="space-y-3">
                      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-48 animate-pulse rounded bg-muted" />
                      <div className="mt-4 h-3 w-full animate-pulse rounded bg-muted" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                      <div className="mt-4 h-3 w-full animate-pulse rounded bg-muted" />
                      <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : translations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
                <ClockCounterClockwiseIcon className="mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm">Nenhuma tradução ainda.</p>
                <p className="mt-1 text-xs">
                  Volte para a{" "}
                  <Link href="/" className="text-primary underline-offset-2 hover:underline">
                    página inicial
                  </Link>{" "}
                  e faça sua primeira tradução.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {translations.map((translation) => (
                  <div
                    key={translation.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                  >
                    <div className="mb-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(translation.created_at).toLocaleString("pt-BR")}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${translation.mode === "encode" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                          {translation.mode === "encode" ? "Humano" : "Linkedin"}
                        </span>
                        <p className="text-sm text-foreground">{translation.original_text}</p>
                      </div>
                      <div>
                        <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${translation.mode === "encode" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {translation.mode === "encode" ? "Linkedisney" : "Humano"}
                        </span>
                        <p className="whitespace-pre-wrap text-sm text-foreground">
                          {translation.translated_text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasMore && !loading && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => fetchTranslations(page + 1, true)}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Carregando..." : "Carregar mais"}
                </Button>
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
