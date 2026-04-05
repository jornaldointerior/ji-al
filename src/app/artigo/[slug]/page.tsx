"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Sidebar from "@/components/Sidebar/Sidebar";
import Headline from "@/components/ui/Headline";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Share2, Printer, Bookmark, Loader2, ArrowRight, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ArticleParams {
  slug: string;
}

export default function ColumnArticlePage({ params }: { params: Promise<ArticleParams> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      const { data, error } = await supabase
        .from("columnist_articles")
        .select(`
          *,
          columnists (*)
        `)
        .eq("slug", slug)
        .single();

      if (data && !error) {
        setArticle(data);
        // Increment views
        await supabase
          .from("columnist_articles")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", data.id);
      }
      setLoading(false);
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!article) notFound();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <Container className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Nav */}
            <nav className="flex items-center justify-between border-b border-slate-100 pb-5">
              <Link href="/colunistas" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-all">
                <ChevronLeft size={16} /> Bancada de Colunistas
              </Link>
              <div className="flex items-center gap-5 text-slate-300">
                <Share2 size={18} className="hover:text-accent cursor-pointer" />
                <Bookmark size={18} className="hover:text-accent cursor-pointer" />
                <Printer size={18} className="hover:text-accent cursor-pointer" />
              </div>
            </nav>

            {/* Header */}
            <header className="flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <div className="h-px bg-accent w-8" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Artigo de Opinião</span>
               </div>
               
               <Headline as="h1" className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-primary italic">
                  {article.title}
               </Headline>

               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 border-2 border-slate-900 overflow-hidden shrink-0">
                    {article.columnists?.image_url ? (
                      <img src={article.columnists.image_url} alt={article.columnists.name} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <UserCircle size={40} className="text-slate-200" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Link href={`/colunista/${article.columnists?.slug}`} className="text-sm font-serif font-black italic text-primary hover:text-accent transition-colors">
                      Por {article.columnists?.name}
                    </Link>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Publicado em {new Date(article.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
               </div>
            </header>

            {/* Featured Image */}
            {article.image_url && (
              <div className="relative aspect-[16/9] w-full overflow-hidden border-2 border-slate-900 shadow-2xl">
                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-slate prose-xl max-w-none font-serif leading-relaxed text-slate-800 tracking-wide">
               <span className="float-left text-9xl font-serif font-black text-slate-900 mr-4 mt-2 line-height-none border-b-8 border-accent leading-[0.7]">{article.content.charAt(0)}</span>
               <div 
                 className="whitespace-pre-wrap pt-4"
                 dangerouslySetInnerHTML={{ __html: article.content.substring(1) }} 
               />
            </div>

            {/* Author Footer Card */}
            <footer className="mt-16 pt-16 border-t-2 border-slate-900 bg-slate-50 p-10 flex flex-col md:flex-row gap-10 items-center md:items-start group">
               <div className="w-32 h-32 bg-white border-2 border-slate-900 shrink-0 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                  {article.columnists?.image_url ? (
                    <img src={article.columnists.image_url} alt={article.columnists.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle size={100} className="text-slate-100" />
                  )}
               </div>
               <div className="flex flex-col gap-4 text-center md:text-left flex-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Sobre o Autor</span>
                    <h3 className="text-3xl font-serif font-black italic text-primary">{article.columnists?.name}</h3>
                  </div>
                  <p className="text-base text-slate-600 font-serif leading-relaxed italic">
                    {article.columnists?.bio}
                  </p>
                  <Link href={`/colunista/${article.columnists?.slug}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-accent flex items-center justify-center md:justify-start gap-3 mt-4 group/link">
                    Acompanhar Coluna Completa <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
               </div>
            </footer>
          </div>

          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
