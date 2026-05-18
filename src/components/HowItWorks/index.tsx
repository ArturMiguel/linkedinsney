import Link from "next/link";
import { LinkedinLogoIcon, MagicWandIcon, ArrowRightIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import { CopyIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";
import type { Icon } from "@phosphor-icons/react";

const encodeSteps = [
  { icon: CopyIcon, title: "Cole seu texto", desc: "Aquela verdade nua e crua." },
  { icon: MagicWandIcon, title: "Clique em traduzir", desc: "A mágica do propósito acontece." },
  { icon: LinkedinLogoIcon, title: "Poste no LinkedIn", desc: "Receba likes e abraços corporativos." },
];

const decodeSteps = [
  { icon: LinkedinLogoIcon, title: "Cole o post do LinkedIn", desc: "Aquele textão cheio de propósito." },
  { icon: MagicWandIcon, title: "Clique em traduzir", desc: "A magia do desnudamento corporativo." },
  { icon: UserIcon, title: "Leia a confissão", desc: "O que a pessoa realmente quis dizer." },
];

const ModeLabel = ({ from, to }: { from: string; to: string }) => (
  <div className="mb-4 flex items-center gap-2">
    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-soft">
      {from}
    </span>
    <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-soft">
      {to}
    </span>
  </div>
);

const StepList = ({ steps }: { steps: { icon: Icon; title: string; desc: string }[] }) => (
  <div className="space-y-3">
    {steps.map((s, i) => (
      <div key={s.title} className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <s.icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            <span className="mr-1.5 text-xs text-muted-foreground">{i + 1}.</span>
            {s.title}
          </p>
          <p className="text-xs text-muted-foreground">{s.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

export const HowItWorks = () => {
  return (
    <section className="bg-surface-soft py-12">
      <Container>
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Como funciona
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Transforme textos honestos em posts corporativos ou descubra o que alguém realmente quis dizer.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <ModeLabel from="Humano" to="LinkedIn" />
            <StepList steps={encodeSteps} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <ModeLabel from="LinkedIn" to="Humano" />
            <StepList steps={decodeSteps} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Ao usar o Linkedinsney, você concorda com nossos{" "}
          <Link href="/agreements/terms-of-use" className="underline underline-offset-2 hover:text-foreground">
            Termos de Uso
          </Link>{" "}
          e nossa{" "}
          <Link href="/agreements/privacy-policy" className="underline underline-offset-2 hover:text-foreground">
            Política de Privacidade
          </Link>
          .
        </p>
      </Container>
    </section>
  );
};
