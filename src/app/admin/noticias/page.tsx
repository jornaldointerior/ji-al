"use client";

import { useState, useEffect } from "react";
import Headline from "@/components/ui/Headline";
import { Edit2, Trash2, ExternalLink, Loader2, Eye, Calendar, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function NoticiasAdminPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setLoading(true);
    // Join with categories table to get the name
    const { data, error } = await supabase
      .from("articles")
      .select(`
        id,
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

  return (
    <div className="flex flex-col gap-10 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 border-b border-primary/10 pb-8 flex-row items-end justify-between">
        <div className="flex flex-col gap-2">
          <Headline variant="tertiary" className="text-primary text-4xl mb-0">Matérias Publicadas</Headline>
          <p className="font-serif italic text-slate-500 text-lg">Gerenciamento editorial de todo o conteúdo do portal.</p>
        </div>
        <Link href="/admin/publicar" className="bg-accent text-white px-8 py-3 text-[10px] uppercase tracking-widest font-black hover:bg-primary transition-colors shadow-lg">
          Nova Matéria +
        </Link>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="w-full flex items-center justify-center p-20 text-slate-400">
             <Loader2 size={32} className="animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <span className="font-serif italic text-2xl text-slate-400">Nenhuma matéria publicada ainda.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest w-16">Data</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest">Editorial</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest hidden md:table-cell">Métricas</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-right w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                  <td className="p-4 align-top w-32 pt-6">
                    <div className="flex flex-col items-start text-xs font-bold text-slate-400 uppercase tracking-widest gap-1">
                      <Calendar size={14} className="mb-1" />
                      <span>{new Date(item.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                      <span className="opacity-50 text-[10px]">{new Date(item.published_at).getFullYear()}</span>
                    </div>
                  </td>
                  <td className="p-4 pt-6">
                    <div className="flex gap-4">
                      {item.image_url ? (
                        <div className="w-24 h-24 bg-slate-200 relative shrink-0 border border-slate-200 grayscale group-hover:grayscale-0 transition-all duration-500">
                          <Image src={item.image_url} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-slate-100 relative shrink-0 border border-slate-200 flex items-center justify-center text-slate-300">
                           <Eye size={24} />
                        </div>
                      )}
                      <div className="flex flex-col gap-2 relative">
                        <span className="text-[9px] uppercase font-black tracking-widest text-accent flex items-center gap-1">
                          <Tag size={10} />
                          {item.categories?.name || "Sem Categoria"}
                        </span>
                        <h4 className="font-serif font-black text-xl italic text-primary leading-tight max-w-xl group-hover:text-accent transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm font-serif italic text-slate-500 line-clamp-2 max-w-xl">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-top pt-6 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Eye size={14} className="text-slate-400" />
                        {item.views_count} views
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-black bg-green-100 text-green-700 w-fit mt-2">
                        Publicado
                      </span>
                    </div>
                  </td>
                  <td className="p-4 align-top pt-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-slate-100 text-slate-500 hover:text-accent hover:bg-slate-200 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="p-2 bg-red-50 text-red-400 hover:text-white hover:bg-red-500 transition-colors"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
