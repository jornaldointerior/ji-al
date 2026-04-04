"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Sidebar from "@/components/Sidebar/Sidebar";
import NewsCard from "@/components/ui/NewsCard";
import Headline from "@/components/ui/Headline";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import BreakingNews from "@/components/Header/BreakingNews";

export default function NoticianPageIndex() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllNews() {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          categories (name)
        `)
        .order("published_at", { ascending: false });

      if (data && !error) {
        setArticles(data);
      }
      setLoading(false);
    }

    fetchAllNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando Notícias...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreakingNews />
      
      <main className="py-12 bg-white flex-1">
        <Container className="grid lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2">
            <header className="mb-12 border-b-4 border-primary pb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent block mb-2">Arquivo</span>
              <Headline as="h1" className="text-5xl md:text-7xl uppercase tracking-widest font-black leading-none text-primary">
                Notícias
              </Headline>
            </header>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {articles.map((news) => (
                <NewsCard
                  key={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  image={news.image_url || "/placeholder-news.jpg"}
                  category={news.categories?.name || "Geral"}
                  date={new Date(news.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  href={`/noticia/${news.slug}`}
                  variant="vertical"
                  className="h-full"
                />
              ))}
            </div>
            
            {articles.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 italic text-slate-400">
                Aguardando novas publicações.
              </div>
            )}
          </section>

          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
