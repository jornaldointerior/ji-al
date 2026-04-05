"use client";

import { useState, useEffect } from "react";
import Headline from "@/components/ui/Headline";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Save, Send, Image as ImageIcon, LayoutIcon, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./Editor"), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-slate-50 border-2 border-slate-900 border-dashed flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">Carregando Ferramentas de Escrita...</div>
});

interface ArticleFormProps {
  initialData?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category_id: string;
    image_url: string | null;
    is_hero: boolean;
    is_featured: boolean;
  };
  mode: "create" | "edit";
}

export default function ArticleForm({ initialData, mode }: ArticleFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    categoryId: initialData?.category_id || "",
    isFeatured: initialData?.is_featured || false,
    isHero: initialData?.is_hero || false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase.from("categories").select("id, name");
      if (data && !error) {
        setCategories(data);
        if (data.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      }
    }
    loadCategories();
  }, [formData.categoryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let imageUrl = initialData?.image_url || "";

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("articles")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Erro ao fazer upload da imagem. Verifique se o bucket 'articles' possui as políticas de RLS corretas.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("articles")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      if (mode === "create") {
        let authorId = null;
        const { data: authors } = await supabase.from('authors').select('id').limit(1);
        if (authors && authors.length > 0) {
           authorId = authors[0].id;
        }

        const { error: insertError } = await supabase.from("articles").insert({
          title: formData.title,
          slug: slug,
          excerpt: formData.excerpt,
          content: formData.content,
          category_id: formData.categoryId,
          author_id: authorId,
          image_url: imageUrl,
          is_hero: formData.isHero,
          is_featured: formData.isFeatured,
          published_at: new Date().toISOString(), // Forçando data exata para evitar falhas de default
        });

        if (insertError) throw new Error(`Erro ao salvar no banco: ${insertError.message}`);
        
        setFormData({
          title: "", excerpt: "", content: "",
          categoryId: categories.length > 0 ? categories[0].id : "",
          isFeatured: false, isHero: false,
        });
        setImageFile(null);
        setImagePreview(null);
      } else if (mode === "edit" && initialData?.id) {
        const { error: updateError } = await supabase.from("articles").update({
          title: formData.title,
          slug: slug,
          excerpt: formData.excerpt,
          content: formData.content,
          category_id: formData.categoryId,
          image_url: imageUrl,
          is_hero: formData.isHero,
          is_featured: formData.isFeatured,
        }).eq("id", initialData.id);

        if (updateError) throw new Error(`Erro ao atualizar no banco: ${updateError.message}`);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao processar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 max-w-[1400px] mx-auto pb-32">
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-10 z-[60] bg-green-500 text-white p-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1),8px_8px_0px_1px_rgba(0,0,0,1)] flex items-center gap-4"
          >
            <CheckCircle2 size={24} />
            <div className="flex flex-col">
              <span className="font-black text-xs tracking-widest uppercase">Operação de Sucesso</span>
              <span className="text-[10px] opacity-90 uppercase font-bold tracking-tighter">
                 {mode === "create" ? "A matéria já está ao vivo no portal." : "A matéria foi atualizada no portal."}
              </span>
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-600 text-white p-8 border-4 border-slate-900 flex items-center gap-6"
          >
            <AlertCircle size={32} />
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-[0.2em] uppercase">Falha na Operação</span>
              <span className="text-sm opacity-80 font-serif italic">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-16">
        <div className="flex flex-col gap-4 border-b-4 border-slate-900 pb-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent mb-4 block">
              {mode === "create" ? "Nova Narrativa" : "Revisão Editorial"}
            </span>
            <Headline variant="primary" className="text-primary text-6xl md:text-8xl mb-4 tracking-tighter leading-tight">
              {mode === "create" ? "Redigir Matéria_" : "Editar Matéria_"}
            </Headline>
            <p className="font-serif italic text-slate-600 text-2xl max-w-3xl">
              {mode === "create" 
                ? "Preencha os campos abaixo para criar uma nova história impactante para o interior."
                : "Ajuste os dados e detalhes da matéria previamente publicada no portal."
              }
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="flex flex-col gap-4 group">
              <label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-focus-within:text-accent transition-colors">Manchete Superior</label>
              <textarea
                id="title" required rows={2}
                className="w-full text-5xl md:text-7xl font-serif font-black italic text-primary border-none outline-none bg-transparent resize-none py-4 placeholder:text-slate-300 transition-all focus:placeholder:text-slate-400"
                placeholder="ESCREVA UMA MANCHETE IMPACTANTE AQUI..."
                value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="h-1 w-20 bg-slate-100 group-focus-within:w-full group-focus-within:bg-accent transition-all duration-700" />
            </div>

            <div className="flex flex-col gap-4 bg-slate-50 p-10 border-l-8 border-slate-900 group">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-slate-400" size={16} />
                <label htmlFor="excerpt" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Linha Fina (Resumo Editorial)</label>
              </div>
              <textarea
                id="excerpt" rows={4}
                className="w-full text-xl md:text-2xl font-serif italic text-slate-600 bg-transparent border-none outline-none resize-none placeholder:text-slate-400"
                placeholder="Um resumo de 2 a 3 linhas que complementa a manchete e atrai o leitor para o conteúdo completo..."
                value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            {/* ── Main Post Body ──────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 ml-2">Corpo da Matéria</span>
              <Editor 
                content={formData.content} 
                onChange={(html) => setFormData({ ...formData, content: html })} 
              />
            </div>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-10 sticky top-32">
            <div className="bg-white border-2 border-slate-900 p-8 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3">
                <ImageIcon size={18} className="text-accent" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Mídia de Capa</h3>
              </div>
              <div className="relative aspect-video border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-6 hover:bg-slate-100 hover:border-accent transition-all cursor-pointer overflow-hidden group">
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" onChange={handleImageChange} />
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white border-2 border-white px-4 py-2">Alterar Imagem</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <UploadCloud size={48} className="text-slate-300 group-hover:text-accent transition-colors" />
                    <span className="text-xs font-black uppercase tracking-tighter text-slate-500">Upload Hero Image</span>
                  </div>
                )}
              </div>
            </div>
            {/* ── Editorial Panel ───────────────────────────────────── */}
            <div className="bg-white border-2 border-slate-900 p-8 flex flex-col gap-8 shadow-[12px_12px_0px_0px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Canal Editorial</label>
                  {categories.length > 0 && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" title="Sincronizado" />}
                </div>
                
                {categories.length === 0 ? (
                  <div className="w-full h-14 bg-slate-50 border-2 border-slate-100 border-dashed flex items-center px-4 animate-pulse">
                    <div className="h-2 w-24 bg-slate-200 rounded" />
                  </div>
                ) : (
                  <div className="relative group">
                    <select 
                      className="w-full border-2 border-slate-100 p-5 bg-slate-50 uppercase text-[10px] tracking-[0.2em] font-black text-slate-900 outline-none focus:border-accent transition-all appearance-none cursor-pointer pr-12 relative z-10"
                      value={formData.categoryId} 
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} 
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-20 group-hover:text-accent transition-colors">
                      <ChevronDown size={14} strokeWidth={3} />
                    </div>
                  </div>
                )}
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Defina onde esta história será arquivada no portal.
                </p>
              </div>

              {/* ── Feature Toggles ────────────────────────────────── */}
              <div className="flex flex-col gap-4 pt-6 border-t border-slate-100">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Distribuição Especial</label>
                
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isHero: !formData.isHero })}
                    className={cn(
                      "flex items-center justify-between p-4 border-2 transition-all group",
                      formData.isHero 
                        ? "border-accent bg-accent/5 translate-x-1 shadow-[4px_4px_0px_0px_rgba(249,115,22,1)]" 
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        formData.isHero ? "text-accent" : "text-slate-500"
                      )}>Manchete Hero</span>
                      <span className="text-[8px] text-slate-400 font-medium">Topo da página inicial</span>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                      formData.isHero ? "border-accent bg-accent" : "border-slate-300"
                    )}>
                      {formData.isHero && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={cn(
                      "flex items-center justify-between p-4 border-2 transition-all group",
                      formData.isFeatured 
                        ? "border-primary bg-primary/5 translate-x-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" 
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        formData.isFeatured ? "text-primary" : "text-slate-500"
                      )}>Destaque Exclusivo</span>
                      <span className="text-[8px] text-slate-400 font-medium">Sessão de análise especial</span>
                    </div>
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
                      formData.isFeatured ? "border-primary bg-primary" : "border-slate-300"
                    )}>
                      {formData.isFeatured && <CheckCircle2 size={10} className="text-white" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <button disabled={loading} type="submit" className="w-full bg-slate-950 text-white p-6 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-accent transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] disabled:opacity-50">
                {loading ? <><Loader2 size={18} className="animate-spin" />Processando...</> : <><Send size={18} /> {mode === "create" ? "Publicar Matéria" : "Salvar Edições"}</>}
              </button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
