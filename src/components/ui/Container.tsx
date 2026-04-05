import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export default function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={cn("mx-auto max-w-7xl px-4 md:px-8 lg:px-12", className)}>
      {children}
    </Component>
  );
}
