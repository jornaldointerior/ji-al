"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, TrendingUp, Users, ArrowUpRight, Plus, Newspaper, Eye, ExternalLink, BarChart2 } from "lucide-react";
import Headline from "@/components/ui/Headline";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    articles: { value: 0, change: "Contagem de Registros" },
    views: { value: "0", change: "Atualizado em tempo real" },
    readers: { value: "0", change: "Visitantes Únicos Estimados" },
  });
  const [topArticles, setTopArticles] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMetrics() {
      const { count: articlesCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true });

      const { data: allArticles } = await supabase
        .from('articles')
        .select('slug, title, views_count')
        .order('views_count', { ascending: false });
      
      const totalViews = allArticles?.reduce((acc, curr) => acc + (curr.views_count || 0), 0) || 0;

      setTopArticles((allArticles || []).slice(0, 5));

      let formattedViews = totalViews.toString();
      if (totalViews >= 1000) {
        formattedViews = (totalViews / 1000).toFixed(1) + "K";
      }

      setMetrics({
        articles: { value: articlesCount || 0, change: "Registros ativos" },
        views: { value: formattedViews, change: "Total acumulado" },
        readers: { value: Math.ceil(totalViews * 0.3).toString(), change: "Sessões Ativas Estimadas" },
      });
    }

    fetchMetrics();
  }, []);


  const stats = [
    { 
      label: "Notícias Publicadas", 
      value: metrics.articles.value.toString(), 
      change: metrics.articles.change, 
      icon: FileText,
      color: "text-primary"
    },
    { 
      label: "Audiência Digital", 
      value: metrics.views.value, 
      change: metrics.views.change, 
      icon: TrendingUp,
      color: "text-accent"
    },
    { 
      label: "Leitores Ativos", 
      value: metrics.readers.value, 
      change: metrics.readers.change, 
      icon: Users,
      color: "text-primary"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as any;

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  } as any;

  return (
    <div className="flex flex-col gap-16">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2 block">Panorama Editorial</span>
          <Headline variant="primary" className="text-primary text-6xl md:text-7xl mb-2 tracking-tighter">
            Visão Geral_
          </Headline>
          <p className="font-serif italic text-slate-400 text-xl max-w-2xl">
            Métricas de performance e engajamento do portal Journal do Interior em tempo real.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid - High Contrast Monoliths */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            variants={item}
            className="group relative bg-white border-2 border-slate-900 p-8 flex flex-col gap-6 hover:shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 border border-slate-100 bg-slate-50 group-hover:bg-accent group-hover:text-white transition-colors">
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={20} className="text-slate-200 group-hover:text-accent transition-colors" />
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
              <p className={`text-6xl font-serif italic font-black ${stat.color} leading-none tracking-tighter`}>
                {stat.value}
              </p>
            </div>
            
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-accent">{stat.change}</span>
              <div className="w-1.5 h-1.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Top Acessos por Matéria */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-4">
            <BarChart2 size={22} className="text-accent" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block">Ranking</span>
              <h3 className="font-serif font-black text-3xl italic text-primary tracking-tighter leading-none">Top Acessos_</h3>
            </div>
          </div>
          <Link
            href="/admin/noticias"
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-accent transition-colors flex items-center gap-2"
          >
            Ver todas <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {topArticles.length === 0 ? (
            <p className="text-slate-400 font-serif italic py-6">Nenhuma matéria com visualizações ainda.</p>
          ) : (
            topArticles.map((article, i) => {
              const maxViews = topArticles[0]?.views_count || 1;
              const pct = Math.round(((article.views_count || 0) / maxViews) * 100);
              return (
                <div key={article.slug} className="group flex items-center gap-6 py-5 hover:bg-slate-50 px-2 transition-colors">
                  <span className="text-[28px] font-black text-slate-100 group-hover:text-slate-200 transition-colors leading-none w-10 shrink-0 text-center">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <span className="font-serif font-black italic text-base text-primary group-hover:text-accent transition-colors line-clamp-1 leading-tight">
                      {article.title}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-500 shrink-0">
                        <Eye size={12} className="text-accent" />
                        {(article.views_count || 0).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`/noticia/${article.slug}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir matéria"
                    className="p-2.5 border border-slate-100 text-slate-400 hover:text-accent hover:border-accent transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative border-4 border-slate-900 bg-slate-900 p-12 md:p-20 overflow-hidden group"
      >
        {/* Background Texture/Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="text-[120px] font-serif font-black italic whitespace-nowrap leading-none -ml-20">
              EDITORIAL_REDAÇÃO_INTERNAL_ACCESS_
            </div>
          ))}
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-6 text-center md:text-left max-w-xl">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Newspaper className="text-accent" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Workflow Ativo</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-black italic text-white leading-tight tracking-tighter">
              Pronto para narrar a próxima história?
            </h2>
            <p className="text-slate-600 text-lg md:text-xl font-serif italic">
              Use nossa ferramenta de publicação avançada para levar a informação ao coração do interior.
            </p>
          </div>

          <Link href="/admin/publicar" className="group relative">
            <div className="absolute -inset-1 bg-accent opacity-30 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-white text-slate-950 px-12 py-6 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-4 hover:bg-accent hover:text-white transition-all duration-300">
              <Plus size={18} />
              Criar Nova Matéria
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-8 mt-8">
        <div className="flex items-center gap-4">
           <div className="w-2 h-2 rounded-full bg-accent" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Última sincronização do banco: Agora</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Journal do Interior Admin v2.1.0</span>
      </div>
    </div>
  );
}

