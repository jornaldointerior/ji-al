import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Headline from "./Headline";

interface NewsCardProps {
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  date: string;
  href: string;
  variant?: "horizontal" | "vertical" | "compact";
  className?: string;
}

export default function NewsCard({
  title,
  excerpt,
  image,
  category,
  date,
  href,
  variant = "vertical",
  className,
}: NewsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block transition-all duration-700 bg-transparent",
        variant === "horizontal" ? "flex flex-col md:flex-row gap-8" : "flex flex-col gap-6",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden z-0 bg-secondary border border-primary/5",
          variant === "horizontal" 
            ? "basis-full md:basis-[45%] h-[240px] md:h-[320px] shrink-0" 
            : "w-full aspect-video shrink-0"
        )}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
        />
        <div className="absolute top-4 left-4 bg-white text-primary text-[8px] uppercase tracking-[0.4em] font-black px-3 py-1.5 z-10 border border-primary/10">
          {category}
        </div>
      </div>

      <div className={cn("flex flex-col gap-4 py-2", variant === "compact" && "gap-2")}>
        <div className="flex flex-col gap-3">
          <Headline
            as={variant === "compact" ? "h4" : "h3"}
            className={cn(
              "leading-[1.05] group-hover:text-accent transition-colors duration-500",
              variant === "compact" ? "text-lg line-clamp-2" : "text-3xl md:text-3.5xl line-clamp-3"
            )}
          >
            {title}
          </Headline>
          
          {excerpt && variant !== "compact" && (
            <p className="text-slate-700 text-[14px] line-clamp-2 font-serif italic leading-relaxed border-l border-accent/20 pl-5 mt-1">
              {excerpt}
            </p>
          )}
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[9px] text-primary/65 uppercase font-sans font-black tracking-[0.2em] flex items-center gap-3">
            <span className="w-8 h-[1px] bg-primary/20" />
            {date}
          </span>
          <span className="text-[9px] text-accent font-black tracking-[0.3em] uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            Ler +
          </span>
        </div>
      </div>
    </Link>
  );
}
