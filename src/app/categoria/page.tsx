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
import Link from "next/link";

const CATEGORIES_LIST = [
  { name: "Alagoas", slug: "alagoas" },
  { name: "Brasil", slug: "brasil" },
  { name: "Mundo", slug: "mundo" },
  { name: "Esportes", slug: "esportes" },
  { name: "Cultura e Entretenimento", slug: "cultura-e-entretenimento" },
];

export default function CategoriaPageIndex() {
  const [articlesByCategory, setArticlesByCategory] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategorizedNews() {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          categories (name)
        `)
        .order("published_at", { ascending: false });

      if (data && !error) {
        const grouped: Record<string, any[]> = {};
        data.forEach(article => {
          const catName = article.categories?.name || "Geral";
          if (!grouped[catName]) grouped[catName] = [];
          if (grouped[catName].length < 2) grouped[catName].push(article);
        });
        setArticlesByCategory(grouped);
      }
      setLoading(false);
    }

    fetchCategorizedNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando Categorias...</span>
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
            <header className="mb-16 border-b-4 border-primary pb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent block mb-2">Editorial</span>
              <Headline as="h1" className="text-5xl md:text-7xl uppercase tracking-widest font-black leading-none text-primary">
                Sessões
              </Headline>
            </header>

            <div className="flex flex-col gap-20">
              {CATEGORIES_LIST.map((cat) => (
                <div key={cat.slug} className="flex flex-col gap-8 group">
                  <div className="flex items-end justify-between border-b border-primary/10 pb-4">
                     <Headline as="h2" className="text-4xl italic group-hover:text-accent transition-colors">
                        {cat.name}
                     </Headline>
                     <Link 
                        href={`/categoria/${cat.slug}`}
                        className="text-[10px] font-sans font-black uppercase text-primary tracking-[0.3em] hover:text-accent transition-colors"
                     >
                        Ver Tudo +
                     </Link>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {articlesByCategory[cat.name]?.map((news) => (
                      <NewsCard
                        key={news.id}
                        title={news.title}
                        excerpt={news.excerpt}
                        image={news.image_url || "/placeholder-news.jpg"}
                        category={news.categories?.name || cat.name}
                        date={new Date(news.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                        href={`/noticia/${news.slug}`}
                        variant="vertical"
                        className="h-full"
                      />
                    )) || (
                      <div className="col-span-2 py-10 bg-slate-50 border border-dashed border-slate-200 text-center text-xs font-sans uppercase tracking-widest text-slate-400">
                        Nenhuma publicação recente em {cat.name}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
