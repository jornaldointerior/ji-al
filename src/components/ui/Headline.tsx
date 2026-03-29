import { cn } from "@/lib/utils";

interface HeadlineProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  variant?: "primary" | "secondary" | "accent";
}

export default function Headline({
  children,
  as: Component = "h2",
  className,
  variant = "primary",
}: HeadlineProps) {
  const variants = {
    primary: "text-primary font-bold tracking-tight font-sans",
    secondary: "text-muted font-medium font-sans",
    accent: "text-accent font-bold font-sans",
  };

  return (
    <Component className={cn(variants[variant], className)}>
      {children}
    </Component>
  );
}
