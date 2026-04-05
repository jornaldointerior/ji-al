"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Headline from "../ui/Headline";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserCircle, ArrowRight } from "lucide-react";

interface Columnist {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  latest_article?: {
    title: string;
    slug: string;
  };
}

export default function ColumnistSection() {
  const [columnists, setColumnists] = useState<Columnist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColumnistsWithArticles() {
      setLoading(true);
      // Fetch all columnists
      const { data: cols } = await supabase
        .from('columnists')
        .select('*')
        .limit(4);

      if (cols) {
        const enhancedCols = await Promise.all(cols.map(async (col) => {
          const { data: art } = await supabase
            .from('columnist_articles')
            .select('title, slug')
            .eq('columnist_id', col.id)
            .order('published_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          return { ...col, latest_article: art || undefined };
        }));
        setColumnists(enhancedCols);
      }
      setLoading(false);
    }

    fetchColumnistsWithArticles();
  }, []);

  if (loading || columnists.length === 0) return null;

  return (
    <section className="py-16 border-y-2 border-slate-900 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent">Opinião e Análise</span>
            <Headline variant="primary" className="text-4xl md:text-5xl mb-0 tracking-tighter">Nossos_Colunistas</Headline>
          </div>
          <Link href="/colunistas" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-colors flex items-center gap-3">
             Ver Todos os Especialistas <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {columnists.map((col, index) => (
            <motion.div 
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group flex flex-col gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-slate-100 border-2 border-slate-900 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                  {col.image_url ? (
                    <img 
                      src={col.image_url} 
                      alt={col.name} 
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" 
                    />
                  ) : (
                    <UserCircle size={80} className="text-slate-200 -m-1" />
                  )}
                  <div className="absolute inset-0 border-4 border-white/20" />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg font-serif font-black italic text-primary leading-tight">
                    {col.name}
                  </h4>
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent mt-1">Colunista JI</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 min-h-[80px]">
                {col.latest_article ? (
                  <Link href={`/artigo/${col.latest_article.slug}`} className="group/art">
                    <p className="text-sm font-serif font-bold text-slate-700 group-hover/art:text-accent transition-colors leading-snug line-clamp-3">
                      "{col.latest_article.title}"
                    </p>
                  </Link>
                ) : (
                  <p className="text-xs font-serif italic text-slate-400">
                    Acompanhando os fatos para a próxima coluna.
                  </p>
                )}
              </div>

              <div className="h-px bg-slate-100 w-full group-hover:bg-accent group-hover:w-1/2 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
