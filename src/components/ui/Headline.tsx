import { cn } from "@/lib/utils";

interface HeadlineProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  variant?: "primary" | "secondary" | "accent" | "massive";
}

export default function Headline({
  children,
  as: Component = "h2",
  className,
  variant = "primary",
}: HeadlineProps) {
  const variants = {
    primary: "text-primary font-black tracking-[-0.04em] font-serif leading-[0.95]",
    secondary: "text-muted font-bold font-sans uppercase tracking-[0.2em] text-[10px]",
    accent: "text-accent font-black font-sans uppercase tracking-[0.3em] text-[11px]",
    massive: "text-primary text-[clamp(2.5rem,8vw,12rem)] font-black font-serif tracking-tighter leading-[0.88]",
  };

  return (
    <Component className={cn(variants[variant], className)}>
      {children}
    </Component>
  );
}
