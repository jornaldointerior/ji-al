"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import NewsCard from "../ui/NewsCard";
import Headline from "../ui/Headline";
import { Loader2 } from "lucide-react";

export default function NewsFeed() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categories = ["Alagoas", "Brasil", "Mundo", "Esportes", "Cultura e Entretenimento"];

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          excerpt,
          image_url,
          published_at,
          slug,
          categories (name)
        `)
        .order("published_at", { ascending: false });

      if (data && !error) {
        setArticles(data);
      }
      setLoading(false);
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-accent" size={32} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando Notícias...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-24 relative">
        {categories.map((cat, idx) => {
          const catNews = articles
            .filter(n => n.categories?.name?.toLowerCase() === cat.toLowerCase())
            .slice(0, 3);
          
          if (catNews.length === 0) {
            return (
              <div key={cat} className="flex flex-col gap-12 reveal-up opacity-50 grayscale">
                <div className="flex items-end justify-between border-b-[6px] border-slate-200 pb-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Sessão</span>
                    <Headline variant="secondary" as="h2" className="text-5xl md:text-7xl italic leading-none text-slate-300">
                      {cat}
                    </Headline>
                  </div>
                </div>
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Nenhum registro ainda</span>
                  <p className="font-serif italic text-slate-500">Publicações desta categoria aparecerão aqui.</p>
                </div>
              </div>
            );
          }

          const isEven = idx % 2 === 0;

          return (
            <div key={cat} className="flex flex-col gap-12 reveal-up">
              {/* Category Header */}
              <div className="flex items-end justify-between border-b-[6px] border-primary pb-6">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Sessão</span>
                  <Headline variant="primary" as="h2" className="text-5xl md:text-7xl italic leading-none">
                    {cat}
                  </Headline>
                </div>
                <Link 
                  href={`/categoria/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "-")}`}
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
                       <NewsCard 
                         title={catNews[0].title}
                         excerpt={catNews[0].excerpt}
                         image={catNews[0].image_url || "/placeholder-news.jpg"}
                         category={catNews[0].categories?.name || "Geral"}
                         date={new Date(catNews[0].published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                         href={`/noticia/${catNews[0].slug}`}
                         variant="horizontal" 
                         className="h-full" 
                        />
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-12">
                       {catNews.slice(1).map(news => (
                         <NewsCard 
                           key={news.id} 
                           title={news.title}
                           excerpt={news.excerpt}
                           image={news.image_url || "/placeholder-news.jpg"}
                           category={news.categories?.name || "Geral"}
                           date={new Date(news.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                           href={`/noticia/${news.slug}`}
                           variant="compact" 
                          />
                       ))}
                    </div>
                  </>
                ) : (
                  catNews.map((news) => (
                    <NewsCard
                      key={news.id}
                      title={news.title}
                      excerpt={news.excerpt}
                      image={news.image_url || "/placeholder-news.jpg"}
                      category={news.categories?.name || "Geral"}
                      date={new Date(news.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      href={`/noticia/${news.slug}`}
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

