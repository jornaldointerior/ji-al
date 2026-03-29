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
        "group block transition-all duration-300 hover:opacity-95",
        "border border-slate-200 bg-white rounded-none overflow-hidden",
        variant === "horizontal" ? "flex flex-col md:flex-row" : "flex flex-col",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden z-0 bg-slate-100 border-b border-slate-100",
          variant === "horizontal" 
            ? "basis-full md:basis-[40%] h-[200px] md:h-auto shrink-0" 
            : "w-full aspect-video min-h-[180px] shrink-0"
        )}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Handle image error if needed
          }}
        />
        <div className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase tracking-widest font-black px-3 py-1.5 font-sans z-10 shadow-xl border border-white/10">
          {category}
        </div>
      </div>

      <div className={cn("p-5 md:p-6 flex flex-col gap-3", variant === "compact" && "p-3")}>
        <Headline
          as={variant === "compact" ? "h4" : "h3"}
          className={cn(
            "leading-tight group-hover:text-accent transition-colors",
            variant === "compact" ? "text-sm line-clamp-2" : "text-xl line-clamp-3"
          )}
        >
          {title}
        </Headline>
        
        {excerpt && variant !== "compact" && (
          <p className="text-muted text-sm line-clamp-2 font-serif leading-relaxed">
            {excerpt}
          </p>
        )}
        
        <div className="mt-auto text-[10px] text-slate-400 uppercase font-sans font-medium">
          {date}
        </div>
      </div>
    </Link>
  );
}
