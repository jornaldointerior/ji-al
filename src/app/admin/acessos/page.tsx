"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  BarChart3, TrendingUp, Globe, MousePointer2, 
  ArrowUpRight, Newspaper, Calendar, Filter,
  Eye, LayoutDashboard
} from "lucide-react";
import Headline from "@/components/ui/Headline";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    globalHits: 0,
    articleViews: 0,
    topArticles: [] as any[],
    categoryPerformance: [] as any[]
  });

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      
      // 1. Cabecalho Global (Hits Totais)
      const { data: globalStats } = await supabase
        .from('site_stats')
        .select('value')
        .eq('key', 'global_hits')
        .single();

      // 2. Artigos e Categorias
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, slug, views_count, categories(name)')
        .order('views_count', { ascending: false });

      if (articles) {
        const totalArticleViews = articles.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
        
        // Agrupar por categoria
        const categoryMap = new Map();
        articles.forEach((art: any) => {
          const categories = art.categories;
          const catName = (Array.isArray(categories) ? categories[0]?.name : categories?.name) || "Geral";
          categoryMap.set(catName, (categoryMap.get(catName) || 0) + (art.views_count || 0));
        });

        const categoryStats = Array.from(categoryMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        setStats({
          globalHits: Number(globalStats?.value || 0),
          articleViews: totalArticleViews,
          topArticles: articles.slice(0, 10),
          categoryPerformance: categoryStats
        });
      }
      
      setLoading(false);
    }

    fetchAnalytics();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-slate-100 border-t-accent rounded-full animate-spin" />
           <BarChart3 className="absolute inset-0 m-auto text-accent/50" size={24} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Processando Big Data...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-12">
        <div className="flex flex-col gap-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2 block">Performance em Tempo Real</span>
            <Headline variant="primary" className="text-primary text-6xl mb-0 tracking-tighter">Acessos_</Headline>
            <p className="font-serif italic text-slate-600 text-xl max-w-xl">
              Análise profunda de tráfego, engajamento e alcance orgânico do portal.
            </p>
          </motion.div>
        </div>
        <div className="flex gap-4">
            <button className="bg-slate-50 border border-slate-200 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-slate-900 hover:text-primary transition-all flex items-center gap-3">
               <Calendar size={16} /> Últimos 30 dias
            </button>
            <button className="bg-slate-900 text-white px-6 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]">
               <Filter size={16} /> Exportar Relatório
            </button>
        </div>
      </div>

      {/* Main Scoreboard */}
      <motion.div 
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <motion.div variants={item} className="bg-slate-950 p-10 text-white relative overflow-hidden group border-b-8 border-accent">
            <Globe className="absolute -right-8 -top-8 text-white/5 group-hover:text-accent/10 transition-colors" size={160} />
            <div className="relative z-10 flex flex-col gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Alcance Global do Site</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-serif italic font-black tracking-tighter">{stats.globalHits.toLocaleString('pt-BR')}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent">Hits</span>
                </div>
                <p className="text-xs text-slate-400 font-serif italic max-w-[200px]">Total de visualizações capturadas em todas as páginas do domínio.</p>
            </div>
        </motion.div>

        <motion.div variants={item} className="bg-white border-2 border-slate-900 p-10 relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <Newspaper className="absolute -right-6 -bottom-6 text-slate-50 group-hover:text-accent/5 transition-colors" size={140} />
            <div className="relative z-10 flex flex-col gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Leituras de Notícias</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-serif italic font-black text-primary tracking-tighter">{stats.articleViews.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-accent">
                    <TrendingUp size={14} />
                    <span>84% do Tráfego Total</span>
                </div>
            </div>
        </motion.div>

        <motion.div variants={item} className="bg-slate-50 border border-slate-100 p-10 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Conversão de Leitura</span>
                <span className="text-4xl font-serif italic font-black text-slate-800">1.8m <span className="text-xs uppercase">Avg</span></span>
            </div>
            <div className="mt-auto flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black uppercase text-slate-500">Taxa de Rejeição</span>
                    <span className="text-xs font-bold font-serif italic text-primary">32.4%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "32.4%" }} transition={{ delay: 1, duration: 1 }} className="h-full bg-slate-800" />
                </div>
            </div>
        </motion.div>
      </motion.div>

      {/* Detailed Charts Row */}
      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* Top News Bar Chart */}
        <div className="lg:col-span-8 bg-white border-2 border-slate-900 p-10 flex flex-col gap-10">
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
             <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-accent" />
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">Performance por Matéria</h3>
             </div>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic font-serif">Exibindo top 10</span>
          </div>

          <div className="flex flex-col gap-4">
            {stats.topArticles.map((art, i) => {
              const max = stats.topArticles[0].views_count || 1;
              const pct = (art.views_count / max) * 100;
              return (
                <div key={art.id} className="flex flex-col gap-1.5 group cursor-pointer">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                    <span className="text-slate-500 group-hover:text-primary transition-colors max-w-[80%] truncate">
                      {i + 1}. {art.title}
                    </span>
                    <span className="group-hover:text-accent transition-colors">{art.views_count.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="h-4 bg-slate-50 border border-slate-100 overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                      className="absolute inset-0 bg-primary group-hover:bg-accent transition-colors origin-left"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Performance */}
        <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-slate-900 text-white p-10 flex flex-col gap-8 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)]">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent">Canais mais Fortes</h3>
                <div className="flex flex-col gap-6">
                    {stats.categoryPerformance.map((cat, i) => (
                        <div key={cat.name} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className={i === 0 ? "text-accent" : "text-slate-400"}>{cat.name}</span>
                                <span>{cat.value.toLocaleString('pt-BR')}</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(cat.value / (stats.categoryPerformance[0]?.value || 1)) * 100}%` }}
                                    className={`h-full ${i === 0 ? "bg-accent" : "bg-white"}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Link href="/admin" className="flex-1 border-2 border-slate-900 p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-950 hover:text-white transition-all group">
                <LayoutDashboard size={40} className="text-slate-200 group-hover:text-accent transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Voltar ao Dashboard</span>
                <ArrowUpRight size={20} className="text-slate-200" />
            </Link>
        </div>
      </div>
    </div>
  );
}
