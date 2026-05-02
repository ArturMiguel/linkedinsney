"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircleIcon, EnvelopeSimpleIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import { Alert } from "@/lib/Alert";
import axios from "axios";
import * as cowsay from "cowsay";
import { useAuth } from "@/providers/AuthProvider";

const SUBJECTS = [
  "Dúvidas sobre o serviço",
  "Sugestões e melhorias",
  "Reportar um bug",
  "Encerramento de conta",
  "Outros assuntos",
];

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  useEffect(() => {
    console.info(cowsay.say({ text: `Olá, dev!\nCaso encontre algo estranho neste site\n(além deste aviso), conte pra gente em\n${process.env.NEXT_PUBLIC_SITE}/contact` }), "\n^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, watch, reset, control, formState: { isSubmitting } } = useForm<ContactForm>();
  const { setLoading } = useAuth();

  function onSubmit(data: ContactForm) {
    setLoading(true);
    axios.post("/api/v1/mails", data).then(() => {
      setSubmitted(true);
      reset();
    }).catch(() => {
      Alert.error("", "Não foi possível enviar sua mensagem. Tente novamente ou escreva diretamente para linkedinsney@artcode.dev.", 5000);
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
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Entre em Contato</h1>
                <p className="mt-2 text-muted-foreground">
                  Encontrou um bug, tem uma sugestão ou quer encerrar sua conta? Fale com a gente.
                </p>
                <div className="mt-4 flex flex-col xl:flex-row gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <EnvelopeSimpleIcon className="h-4 w-4 shrink-0 text-primary" /> linkedinsney@artcode.dev
                  </div>
                  <a
                    href="https://www.linkedin.com/in/arturmiguelrocha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LinkedinLogoIcon className="h-4 w-4 shrink-0 text-primary" /> linkedin.com/in/arturmiguelrocha
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircleIcon className="mb-4 h-12 w-12 text-primary" weight="fill" />
                    <h2 className="text-lg font-semibold text-foreground">Mensagem recebida!</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Retornaremos o mais breve possível.</p>
                    <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
                      Enviar outra mensagem
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <div className="grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Nome <span className="text-destructive">*</span></FieldLabel>
                        <Input {...register("name", { required: true })} type="text" />
                      </Field>
                      <Field>
                        <FieldLabel>E-mail <span className="text-destructive">*</span></FieldLabel>
                        <Input {...register("email", { required: true })} type="email" />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>Assunto <span className="text-destructive">*</span></FieldLabel>
                      <Controller
                        name="subject"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um assunto" />
                            </SelectTrigger>
                            <SelectContent>
                              {SUBJECTS.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Mensagem <span className="text-destructive">*</span></FieldLabel>
                      <Textarea
                        {...register("message", { required: true })}
                        rows={5}
                        maxLength={1000}
                        placeholder="Descreva sua dúvida ou sugestão com a honestidade que o LinkedIn nunca permitiria..."
                      />
                      <small>{watch("message")?.length ?? 0}/1000</small>
                    </Field>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                      </Button>
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
