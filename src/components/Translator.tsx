"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { SparkleIcon, RocketIcon, CheckIcon, CopyIcon, LinkedinLogoIcon, LockSimpleIcon, ArrowsLeftRightIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

const MAX = 1000;

type TranslatorForm = { text: string };

export const Translator = () => {
  const t = useTranslations("translator");
  const { user } = useAuth();
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<TranslatorForm>({ defaultValues: { text: "" } });

  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const text = watch("text");

  const onSubmit = async ({ text }: TranslatorForm) => {
    setError(null);
    setOutput("");

    try {
      const { data } = await axios.post<{ text: string }>("/api/v1/translates", {
        text: text,
        mode: mode
      });
      setOutput(data.text);
    } catch {
      setError(t("error"));
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast(t("copiedToast"), { description: t("copiedToastDesc") });
    setTimeout(() => setCopied(false), 1800);
  };

  const handleShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite?url=${process.env.NEXT_PUBLIC_SITE}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mt-6 pb-16">
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className={cn("pt-4 text-sm font-semibold", mode === "encode" ? "text-primary" : "text-muted-foreground")}>
              {t("modeHuman")}
            </span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{t("modeLabel")}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => { setMode(mode === "encode" ? "decode" : "encode"); setOutput(""); setError(null); }}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    disabled={isSubmitting}
                  >
                    <ArrowsLeftRightIcon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("toggleMode")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className={cn("pt-4 text-sm font-semibold", mode === "decode" ? "text-primary" : "text-muted-foreground")}>
              LinkedIn
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* INPUT */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                {mode === "decode" ? t("inputLabelDecode") : t("inputLabelEncode")}
              </label>
              <Textarea
                {...register("text", { required: true, maxLength: MAX })}
                maxLength={MAX}
                placeholder={mode === "decode" ? t("placeholderDecode") : t("placeholderEncode")}
                className="h-[220px] resize-none rounded-xl border-border bg-background text-base focus-visible:ring-primary"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{mode === "decode" ? t("hintDecode") : t("hintEncode")}</span>
                <span className={cn(text.length > MAX * 0.9 && "text-destructive")}>
                  {text.length}/{MAX}
                </span>
              </div>
              <Button
                type="submit"
                disabled={!text.trim() || isSubmitting || !user}
                className="mt-4 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-elevated hover:bg-primary-hover"
              >
                {isSubmitting ? (
                  <>
                    <ArrowClockwiseIcon className="mr-2 h-5 w-5 animate-spin" />
                    {mode === "decode" ? t("submittingDecode") : t("submittingEncode")}
                  </>
                ) : (
                  <>
                    {mode === "decode" ? t("buttonDecode") : t("buttonEncode")}
                    {user ? <RocketIcon className="ml-2 h-5 w-5" /> : <LockSimpleIcon className="ml-2 h-5 w-5" />}
                  </>
                )}
              </Button>

              {!user && (
                <p className="mt-3 text-center text-sm text-bold-foreground">
                  {t("loginRequired")}
                </p>
              )}
            </div>

            {/* OUTPUT */}
            <div className="rounded-2xl border border-border bg-surface-tint p-5 shadow-soft md:p-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">{mode === "decode" ? t("outputLabelDecode") : t("outputLabelEncode")}</label>
                {output && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {copied ? <CheckIcon className="h-3.5 w-3.5 text-primary" /> : <CopyIcon className="h-3.5 w-3.5" />}
                    {copied ? t("copied") : t("copy")}
                  </button>
                )}
              </div>

              <div className="min-h-[220px] rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                {isSubmitting ? (
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                  </div>
                ) : error ? (
                  <p className="text-destructive">{error}</p>
                ) : output ? (
                  <p className="whitespace-pre-wrap">{output}</p>
                ) : (
                  <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center text-muted-foreground">
                    <SparkleIcon className="mb-2 h-8 w-8 text-accent" weight="fill" />
                    <p className="text-sm">{mode === "decode" ? t("emptyDecode") : t("emptyEncode")}</p>
                  </div>
                )}
              </div>

              {mode === "encode" && (
                <Button
                  type="button"
                  onClick={handleShare}
                  disabled={!output}
                  variant="outline"
                  className="mt-4 h-11 w-full rounded-xl border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <LinkedinLogoIcon className="mr-2 h-4 w-4" />
                  {t("shareLinkedIn")}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Container>
    </section>
  )
};
