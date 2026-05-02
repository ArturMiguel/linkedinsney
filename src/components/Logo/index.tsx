import { cn } from "@/lib/utils";
import styles from "./styles.module.css";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export const Logo = ({ className, showWordmark = true }: LogoProps) => {
  return (
    <Link href="/">
      <div className={cn("flex items-center gap-2", className)}>
        <img src="/logo.svg" alt="Linkedinsney logo" className={cn("h-9 w-9", styles.logo)} />
        {showWordmark && (
          <span className="text-xl font-extrabold tracking-tight text-foreground">
            Linked<span className="text-primary">in</span>sney
          </span>
        )}
      </div>
    </Link>
  );
};
