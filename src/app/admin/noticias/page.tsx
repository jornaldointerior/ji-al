"use client";

import { useState, useEffect } from "react";
import Headline from "@/components/ui/Headline";
import { Edit2, Trash2, ExternalLink, Loader2, Eye, Tag, Search, Filter, Plus, Newspaper } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function NoticiasAdminPage() {
  const router = useRouter();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // Calculado via useEffect para evitar SSR — garante URL absoluta correta
  const [siteOrigin, setSiteOrigin] = useState("");

  useEffect(() => {
    setSiteOrigin(window.location.origin);
    fetchNews();
  }, []);

  function articleUrl(slug: string) {
    return `${siteOrigin}/noticia/${slug}/`;
  }

  async function fetchNews() {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select(`
        id,
        slug,
        title,
        excerpt,
        image_url,
        published_at,
        views_count,
        categories (name)
      `)
      .order("published_at", { ascending: false });

    if (data && !error) {
      setNews(data);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (window.confirm("Tem certeza que deseja apagar essa notícia permanentemente?")) {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (!error) {
        setNews(news.filter(n => n.id !== id));
      } else {
        alert("Erro ao remover notícia.");
      }
    }
  }

  const filteredNews = news.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.categories?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-16 max-w-7xl mx-auto pb-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-12">
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2 block">Acervo Editorial</span>
            <Headline variant="primary" className="text-primary text-6xl mb-0 tracking-tighter">Matérias_</Headline>
            <p className="font-serif italic text-slate-600 text-xl max-w-xl">
              Gerencie todo o fluxo de informação e o histórico de publicações do portal.
            </p>
          </motion.div>
        </div>

        <Link href="/admin/publicar" className="group">
          <div className="bg-slate-950 text-white px-10 py-5 text-[11px] uppercase tracking-[0.3em] font-black hover:bg-accent transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(249,115,22,1)] flex items-center gap-3">
            <Plus size={18} />
            Nova Publicação
          </div>
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" size={20} />
          <input
            type="text"
            placeholder="Pesquisar por título ou categoria..."
            className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-16 text-xs font-bold uppercase tracking-widest text-primary outline-none focus:border-slate-900 transition-all placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="h-16 px-8 border-2 border-slate-100 bg-white flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-slate-900 hover:text-primary transition-all">
          <Filter size={18} />
          Filtrar
        </button>
      </div>

      {/* Content List */}
      <div className="flex flex-col border-t border-slate-100">
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center py-40 gap-4 text-slate-300">
            <Loader2 size={48} className="animate-spin text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sincronizando Banco de Dados...</span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-40 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
              <Search size={32} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-serif font-black italic text-3xl text-primary">Nenhum registro encontrado</h3>
              <p className="text-slate-400 font-serif italic text-lg">Tente ajustar sua busca ou publique uma nova matéria.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {filteredNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="group relative flex flex-col md:flex-row gap-10 py-12 px-6 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Article Index & Date */}
                  <div className="flex flex-row md:flex-col items-baseline md:items-start gap-4 md:gap-1 w-32 shrink-0">
                    <span className="text-[40px] font-black text-slate-900 leading-none tracking-tighter opacity-10 group-hover:opacity-20 transition-opacity">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-accent tracking-widest">
                        {new Date(item.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                        {new Date(item.published_at).getFullYear()}
                      </span>
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="w-full md:w-56 h-40 bg-slate-50 border border-slate-100 shrink-0 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out shadow-sm group-hover:shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] group-hover:-translate-y-1">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Newspaper size={40} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-slate-900 px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] text-white z-10">
                      {item.categories?.name || "Geral"}
                    </div>
                  </div>

                  {/* Editorial Content */}
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      {/* Âncora nativa com href absoluto — não é interceptada pelo roteador SPA */}
                      {siteOrigin && item.slug ? (
                        <a
                          href={articleUrl(item.slug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-serif font-black text-2xl md:text-3xl italic text-primary leading-tight hover:text-accent transition-colors underline-offset-8 hover:underline decoration-accent"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <span className="font-serif font-black text-2xl md:text-3xl italic text-primary leading-tight">
                          {item.title}
                        </span>
                      )}
                      <p className="text-lg font-serif italic text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 pt-6 border-t border-slate-50 flex-wrap">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        <Eye size={14} className="text-accent" />
                        {item.views_count || 0} Leituras
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        <Tag size={12} />
                        {item.categories?.name || "Sem Categoria"}
                      </div>
                      <div className="flex-1" />

                      {/* Actions — sempre visíveis */}
                      <div className="flex items-center gap-2">
                        {siteOrigin && item.slug && (
                          <a
                            href={articleUrl(item.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Abrir matéria no portal"
                            className="flex items-center gap-2 px-4 py-2.5 border border-accent text-accent text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
                          >
                            <ExternalLink size={13} />
                            Ver
                          </a>
                        )}
                        <button
                          onClick={() => router.push(`/admin/noticias/editar?id=${item.id}`)}
                          title="Editar matéria"
                          className="p-3 border border-slate-200 bg-white text-slate-600 hover:text-accent hover:border-accent transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          title="Apagar matéria"
                          className="p-3 border border-slate-200 bg-white text-slate-600 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
