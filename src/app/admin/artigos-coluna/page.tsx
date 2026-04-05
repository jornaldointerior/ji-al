"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Trash2, Edit, Save, X, 
  Loader2, FileText, PenTool,
  Calendar, Eye, ExternalLink,
  ChevronRight, AlertCircle, UploadCloud,
  Image as ImageIcon
} from "lucide-react";
import Headline from "@/components/ui/Headline";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/admin/Editor"), { 
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-slate-50 border-2 border-slate-900 border-dashed flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">Carregando Editor...</div>
});

interface Columnist {
  id: string;
  name: string;
}

interface ColumnArticle {
  id: string;
  title: string;
  slug: string;
  columnist_id: string;
  published_at: string;
  views_count: number;
  columnists?: { name: string };
}

export default function ColumnArticlesAdmin() {
  const [articles, setArticles] = useState<ColumnArticle[]>([]);
  const [columnists, setColumnists] = useState<Columnist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    columnist_id: "",
    image_url: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: arts } = await supabase
      .from('columnist_articles')
      .select('*, columnists(name)')
      .order('published_at', { ascending: false });
    
    const { data: cols } = await supabase
      .from('columnists')
      .select('id, name')
      .order('name', { ascending: true });

    if (arts) setArticles(arts as any);
    if (cols) setColumnists(cols);
    setLoading(false);
  }

  const createSlug = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substr(2, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.columnist_id) return alert("Selecione um colunista.");
    
    setSubmitting(true);
    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("articles")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("articles")
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      if (editingId) {
        await supabase.from('columnist_articles').update({
          title: formData.title,
          content: formData.content,
          columnist_id: formData.columnist_id,
          image_url: finalImageUrl
        }).eq('id', editingId);
      } else {
        await supabase.from('columnist_articles').insert([{
          ...formData,
          image_url: finalImageUrl,
          slug: createSlug(formData.title)
        }]);
      }
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar artigo. Verifique o console.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ title: "", content: "", columnist_id: "", image_url: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  const startEdit = (a: any) => {
    setEditingId(a.id);
    setFormData({
      title: a.title,
      content: a.content,
      columnist_id: a.columnist_id,
      image_url: a.image_url || ""
    });
    setImagePreview(a.image_url || null);
    setIsCreating(true);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Excluir este artigo permanentemente?")) return;
    await supabase.from('columnist_articles').delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-12">
        <div className="flex flex-col gap-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2 block">Pensamento e Crítica</span>
            <Headline variant="primary" className="text-primary text-6xl mb-0 tracking-tighter">Artigos de Coluna_</Headline>
            <p className="font-serif italic text-slate-600 text-xl max-w-xl">
              Publique e gerencie os textos dos colunistas oficiais do portal.
            </p>
          </motion.div>
        </div>
        
        <button 
          onClick={() => { resetForm(); setIsCreating(true); }}
          className="bg-slate-900 text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all flex items-center gap-4 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)]"
        >
          <Plus size={18} /> Novo Artigo
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-2 border-slate-900 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-black italic text-2xl text-primary">
                  {editingId ? "Editar Artigo" : "Redigir Novo Artigo"}
                </h3>
                <button type="button" onClick={resetForm}><X size={20} className="text-slate-300 hover:text-red-500" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título do Artigo</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Um título impactante..."
                      className="w-full bg-slate-50 border-2 border-slate-100 p-5 text-lg font-serif italic outline-none focus:border-accent transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Autor / Colunista</label>
                    <select 
                      required
                      value={formData.columnist_id}
                      onChange={e => setFormData({...formData, columnist_id: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 p-5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent transition-all appearance-none"
                    >
                      <option value="">Selecione o autor...</option>
                      {columnists.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagem de Destaque</label>
                    <div className="relative aspect-video border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-4 hover:bg-slate-100 hover:border-accent transition-all cursor-pointer overflow-hidden group">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }} 
                      />
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white border border-white px-3 py-1.5">Mudar Imagem</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <UploadCloud size={32} className="text-slate-300 group-hover:text-accent transition-colors" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Clique para anexar</span>
                        </div>
                      )}
                    </div>
                    {/* Fallback URL input toggle or field */}
                    <div className="mt-2">
                       <input 
                        value={formData.image_url}
                        onChange={e => {
                          setFormData({...formData, image_url: e.target.value});
                          if (!imageFile) setImagePreview(e.target.value);
                        }}
                        placeholder="Ou cole a URL da imagem aqui..."
                        className="w-full bg-slate-50 border-2 border-slate-100 p-3 text-[8px] font-black uppercase tracking-widest outline-none focus:border-accent transition-all"
                      />
                    </div>
                  </div>
                </div>

                  <div className="flex flex-col gap-2 h-full">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Texto do Artigo (Corpo)</label>
                    <Editor 
                      content={formData.content} 
                      onChange={html => setFormData({...formData, content: html})} 
                    />
                  </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  disabled={submitting}
                  className="bg-accent text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Publicar Artigo
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando Arquivo...</span>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-900 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-white uppercase text-[9px] font-black tracking-[0.2em]">
                  <th className="p-6">Data</th>
                  <th className="p-6">Título e Autor</th>
                  <th className="p-6 text-center">Acessos</th>
                  <th className="p-6 text-right pr-12">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((art) => (
                  <tr key={art.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-6 whitespace-nowrap">
                       <div className="flex items-center gap-3">
                          <Calendar size={14} className="text-accent" />
                          <span className="text-[10px] font-black text-slate-400">{new Date(art.published_at).toLocaleDateString('pt-BR')}</span>
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                             <PenTool size={10} /> {art.columnists?.name}
                          </span>
                          <span className="font-serif font-black italic text-primary group-hover:text-accent transition-colors leading-tight line-clamp-1">{art.title}</span>
                       </div>
                    </td>
                    <td className="p-6 text-center">
                       <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 border border-slate-100 text-[10px] font-black text-slate-500">
                          <Eye size={12} className="text-accent" />
                          {art.views_count}
                       </div>
                    </td>
                    <td className="p-6 text-right pr-8">
                       <div className="flex justify-end gap-2">
                         <button 
                            onClick={() => startEdit(art)}
                            className="p-3 text-slate-300 hover:text-accent transition-colors"
                         >
                            <Edit size={16} />
                         </button>
                         <button 
                            onClick={() => deleteArticle(art.id)}
                            className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                         >
                            <Trash2 size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {articles.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-6">
               <FileText size={48} className="text-slate-100" />
               <p className="font-serif italic text-slate-400">Nenhum artigo publicado ainda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
