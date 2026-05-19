"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const locales = [
  { value: "pt-BR", flag: "🇧🇷", label: "Português" },
  { value: "en-US", flag: "🇺🇸", label: "English" },
  { value: "es-ES", flag: "🇪🇸", label: "Español" },
];

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();

  const current = locales.find((l) => l.value === locale)!;

  function handleChange(newLocale: string) {
    document.cookie = `linkedinsney_locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Idioma" className="rounded-md p-1.5 text-lg leading-none">
          {current.flag}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.value}
            onClick={() => handleChange(l.value)}
            className="cursor-pointer gap-2"
          >
            <span className="text-lg leading-none">{l.flag}</span>
            <span>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
