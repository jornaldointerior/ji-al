import { cn } from "@/lib/utils";
import { MOCK_NEWS } from "@/lib/mock-data";
import Link from "next/link";
import Container from "../ui/Container";
import NewsCard from "../ui/NewsCard";
import Headline from "../ui/Headline";

export default function NewsFeed() {
  const categories = ["Alagoas", "Brasil", "Mundo", "Esportes", "Cultura e Entretenimento"];

  return (
    <div className="flex flex-col gap-24 relative">
        {categories.map((cat, idx) => {
          const catNews = MOCK_NEWS.filter(n => n.category.toLowerCase() === cat.toLowerCase()).slice(0, 3);
          
          if (catNews.length === 0) return null;

          const isEven = idx % 2 === 0;

          return (
            <div key={cat} className="flex flex-col gap-12 reveal-up">
              {/* Category Header */}
              <div className="flex items-end justify-between border-b-[6px] border-primary pb-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Sessão</span>
                  <Headline variant="primary" as="h2" className="text-5xl md:text-7xl lowercase italic leading-none">
                    {cat}
                  </Headline>
                </div>
                <Link 
                  href={`/categoria/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                  className="text-[10px] font-sans font-black uppercase text-primary tracking-[0.3em] hover:text-accent transition-colors pb-2 border-b border-primary/10"
                >
                  Arquivo Completo +
                </Link>
              </div>
              
              {/* Dynamic Grid Layout */}
              <div className={cn(
                "grid gap-16",
                isEven ? "lg:grid-cols-12" : "lg:grid-cols-3"
              )}>
                {isEven ? (
                  <>
                    <div className="lg:col-span-8">
                       <NewsCard {...catNews[0]} variant="horizontal" className="h-full" />
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-12">
                       {catNews.slice(1).map(news => (
                         <NewsCard key={news.id} {...news} variant="compact" />
                       ))}
                    </div>
                  </>
                ) : (
                  catNews.map((news) => (
                    <NewsCard
                      key={news.id}
                      {...news}
                    />
                  ))
                )}
              </div>

            </div>
          );
        })}

    </div>
  );
}

