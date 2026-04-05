"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Container from "../ui/Container";
import Headline from "../ui/Headline";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Hero() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroNews() {
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
        .order("published_at", { ascending: false })
        .limit(4);

      if (data && !error) {
        setArticles(data);
      }
      setLoading(false);
    }

    fetchHeroNews();
  }, []);

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-slate-50 border-b border-primary/5">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (articles.length === 0) return null;

  const mainNews = articles[0];
  const sideNews = articles.slice(1);

  return (
    <section className="relative pt-6 md:pt-10 pb-12 md:pb-16 overflow-hidden border-b border-primary/5">
      <Container>
        <div className="flex flex-col gap-10 md:gap-20">
          {/* Typographic Header Section */}
          <div className="relative w-full reveal-up">
            <Link href={`/noticia/${mainNews.slug}`} className="group cursor-pointer w-full block">
              <Headline 
                variant="massive" 
                className="stagger-2 group-hover:text-accent transition-colors duration-500 text-[clamp(2.2rem,10vw,10rem)] leading-[0.95] w-full text-left tracking-tight break-words h-auto"
              >
                {mainNews.title}
              </Headline>
            </Link>
          </div>

          {/* Asymmetric Visual & News Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-8 relative w-full reveal-up stagger-3">
              <div className="relative aspect-[16/9] md:aspect-video w-full overflow-hidden border border-primary/10">
                <Image
                  src={mainNews.image_url || "/placeholder-news.jpg"}
                  alt={mainNews.title}
                  fill
                  className="object-contain transition-transform duration-1000 hover:scale-105"
                  priority
                />
              </div>
              <p className="mt-6 md:mt-8 text-lg md:text-xl font-serif italic text-slate-600 leading-relaxed max-w-2xl">
                {mainNews.excerpt}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-10">
              <div className="bg-white p-6 md:p-8 border border-slate-200 shadow-sm reveal-up stagger-3">
                <div className="flex flex-col gap-8">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <Headline variant="accent" className="text-[10px] uppercase font-black tracking-[0.4em]">
                      Últimas Notícias
                    </Headline>
                  </div>
                  {sideNews.map((news, i) => (
                    <Link 
                      key={news.id} 
                      href={`/noticia/${news.slug}`}
                      className="flex flex-col gap-2 group border-b border-slate-50 pb-6 last:border-0 last:pb-0"
                    >
                      <span className="text-[9px] uppercase font-black tracking-widest text-accent mb-1">
                        0{i + 1} / {news.categories?.name}
                      </span>
                      <h4 className="text-lg font-serif font-black leading-tight group-hover:text-accent transition-colors duration-300">
                        {news.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
