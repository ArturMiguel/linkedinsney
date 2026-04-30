import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className="flex justify-center w-full">
      <div className={cn("w-full md:w-11/12", className)}>
        {children}
      </div>
    </div>
  );
};
