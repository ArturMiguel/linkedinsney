import Link from "next/link";
import { LinkedinLogoIcon, MagicWandIcon, ArrowRightIcon, UserIcon } from "@phosphor-icons/react/dist/ssr";
import { CopyIcon } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/container";

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
  <div className="mb-6 flex items-center gap-2">
    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-soft">
      {from}
    </span>
    <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground" />
    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-soft">
      {to}
    </span>
  </div>
);

const StepCards = ({ steps }: { steps: typeof encodeSteps }) => (
  <div className="grid gap-6 md:grid-cols-3">
    {steps.map((s, i) => (
      <div
        key={s.title}
        className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition-shadow hover:shadow-elevated"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <s.icon className="h-6 w-6" />
        </div>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Passo {i + 1}
        </div>
        <h3 className="mt-1 text-lg font-semibold text-foreground">{s.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
      </div>
    ))}
  </div>
);

export const HowItWorks = () => {
  return (
    <section className="bg-surface-soft py-16">
      <Container>
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Como funciona
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          O Linkedinsney é um tradutor de textos alimentado por inteligência artificial.
          Transforme textos honestos em posts corporativos impecáveis, ou cole um post do LinkedIn e descubra o que a pessoa realmente quis dizer.
        </p>
        <div className="mt-10">
          <ModeLabel from="Humano" to="LinkedIn" />
          <StepCards steps={encodeSteps} />
        </div>
        <div className="mt-10">
          <ModeLabel from="LinkedIn" to="Humano" />
          <StepCards steps={decodeSteps} />
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
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
