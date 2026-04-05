"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Sidebar from "@/components/Sidebar/Sidebar";
import NewsCard from "@/components/ui/NewsCard";
import Headline from "@/components/ui/Headline";
import { Loader2 } from "lucide-react";

interface CategoryParams {
  slug: string;
}

export async function generateStaticParams() {
  const categories = [
    "alagoas",
    "brasil",
    "mundo",
    "esportes",
    "cultura-e-entretenimento"
  ];

  return categories.map((slug) => ({
    slug,
  }));
}

export default function CategoryPage({ params }: { params: Promise<CategoryParams> }) {
  const { slug } = use(params);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Map slugs to display names
  const categoryMap: Record<string, string> = {
    "alagoas": "Alagoas",
    "brasil": "Brasil",
    "mundo": "Mundo",
    "esportes": "Esportes",
    "cultura-e-entretenimento": "Cultura e Entretenimento"
  };

  const displayName = categoryMap[slug];

  useEffect(() => {
    async function fetchCategoryNews() {
      if (!displayName) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          categories!inner (name)
        `)
        .eq("categories.name", displayName)
        .order("published_at", { ascending: false });

      if (data && !error) {
        setArticles(data);
      }
      setLoading(false);
    }

    fetchCategoryNews();
  }, [slug, displayName]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando Categoria...</span>
      </div>
    );
  }

  if (!displayName) {
    notFound();
  }

  return (
    <main className="py-10 bg-white min-h-screen">
      <Container className="grid lg:grid-cols-3 gap-12">
        {/* News Feed Section */}
        <section className="lg:col-span-2">
          <header className="mb-12 border-b-4 border-primary pb-4 flex flex-col gap-2">
            <Headline as="h1" className="text-5xl md:text-7xl uppercase tracking-widest font-black leading-none text-primary">
              {displayName}
            </Headline>
            <p className="text-slate-400 font-sans text-xs uppercase tracking-[0.3em] font-medium">
              Arquivamento Editorial • Jornal do Interior
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {articles.map((news) => (
              <NewsCard
                key={news.id}
                title={news.title}
                excerpt={news.excerpt}
                image={news.image_url || "/placeholder-news.jpg"}
                category={news.categories?.name || displayName}
                date={new Date(news.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                href={`/noticia/${news.slug}`}
                variant="vertical"
                className="h-full border-0 p-0 shadow-none hover:shadow-xl transition-all"
              />
            ))}
          </div>
          
          {articles.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 italic text-slate-400">
              Nenhuma notícia encontrada nesta categoria no momento.
            </div>
          )}
        </section>

        {/* Persistent Sidebar */}
        <aside className="lg:col-span-1">
          <Sidebar />
        </aside>
      </Container>
    </main>
  );
}
