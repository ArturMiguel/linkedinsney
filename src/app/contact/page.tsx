"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircleIcon, EnvelopeSimpleIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { Alert } from "@/lib/Alert";
import axios from "axios";
import * as cowsay from "cowsay";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "next-intl";

const SUBJECT_KEYS = [
  "serviceQuestions",
  "suggestions",
  "reportBug",
  "accountClosure",
  "other",
] as const;

type ContactForm = {
  subject: string;
  message: string;
};

export default function ContactPage() {
  const t = useTranslations("contact");
  const { user, setLoading } = useAuth();

  useEffect(() => {
    console.info(cowsay.say({ text: `Olá, dev!\nCaso encontre algo estranho neste site\n(além deste aviso), conte pra gente em\n${process.env.NEXT_PUBLIC_SITE}/contact` }), "\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch, reset, control, formState: { isSubmitting } } = useForm<ContactForm>();

  function onSubmit(data: ContactForm) {
    setLoading(true);
    axios.post("/api/v1/mails", data).then(() => {
      setSubmitted(true);
      reset();
    }).catch((error) => {
      Alert.error("", error.response?.data?.message ?? t("errorMessage", { email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL as string }), 5000);
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-16">
          <Container>
            <div className="mx-auto md:w-10/12 lg:w-6/12">
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
                <p className="mt-2 text-muted-foreground">
                  {t("description")}
                </p>
                <div className="mt-4 flex flex-col xl:flex-row gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <EnvelopeSimpleIcon className="h-4 w-4 shrink-0 text-primary" /> {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircleIcon className="mb-4 h-12 w-12 text-primary" weight="fill" />
                    <h2 className="text-lg font-semibold text-foreground">{t("successTitle")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("successDescription")}</p>
                    <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
                      {t("sendAnother")}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <Field>
                      <FieldLabel>{t("subject")} <span className="text-destructive">*</span></FieldLabel>
                      <Controller
                        name="subject"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectSubject")} />
                            </SelectTrigger>
                            <SelectContent>
                              {SUBJECT_KEYS.map((key) => (
                                <SelectItem key={key} value={t(`subjects.${key}`)}>{t(`subjects.${key}`)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>{t("message")} <span className="text-destructive">*</span></FieldLabel>
                      <Textarea
                        {...register("message", { required: true })}
                        rows={5}
                        maxLength={3000}
                        placeholder={t("messagePlaceholder")}
                      />
                      <small>{watch("message")?.length ?? 0}/3000</small>
                    </Field>

                    <div>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !user}
                        className="w-full"
                      >
                        {isSubmitting ? t("submitting") : t("submit")}
                        {!user && <LockSimpleIcon className="ml-2 h-5 w-5" />}
                      </Button>

                      {!user && (
                        <p className="mt-3 text-center text-sm text-bold-foreground">
                          {t("loginRequired")}
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
