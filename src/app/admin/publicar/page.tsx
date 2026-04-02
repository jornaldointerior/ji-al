"use client";

import { useState, useEffect } from "react";
import Headline from "@/components/ui/Headline";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Save, Send, Image as ImageIcon, LayoutIcon, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicarPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    categoryId: "",
    isFeatured: false,
    isHero: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase.from("categories").select("id, name");
      if (data && !error) {
        setCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0].id }));
        }
      }
    }
    loadCategories();
  }, []);

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
      let imageUrl = "";

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("articles")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Erro ao fazer upload da imagem. Verifique se o bucket 'articles' é público.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("articles")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      let authorId = null;
      const { data: authors } = await supabase.from('authors').select('id').limit(1);
      if (authors && authors.length > 0) {
         authorId = authors[0].id;
      }

      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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
      });

      if (insertError) {
        throw new Error(`Erro ao salvar no banco: ${insertError.message}`);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        categoryId: categories.length > 0 ? categories[0].id : "",
        isFeatured: false,
        isHero: false,
      });
      setImageFile(null);
      setImagePreview(null);
      
      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao publicar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 max-w-[1400px] mx-auto pb-32">
      {/* Notifications */}
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
              <span className="font-black text-xs tracking-widest uppercase">Publicado com Sucesso</span>
              <span className="text-[10px] opacity-90 uppercase font-bold tracking-tighter">A matéria já está ao vivo no portal.</span>
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
              <span className="font-black text-sm tracking-[0.2em] uppercase">Falha na Publicação</span>
              <span className="text-sm opacity-80 font-serif italic">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-16">
        {/* Header Title Section */}
        <div className="flex flex-col gap-4 border-b-4 border-slate-900 pb-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent mb-4 block">Nova Narrativa</span>
            <Headline variant="primary" className="text-primary text-6xl md:text-8xl mb-4 tracking-tighter leading-tight">
              Redigir Matéria_
            </Headline>
            <p className="font-serif italic text-slate-600 text-2xl max-w-3xl">
              Preencha os campos abaixo para criar uma nova história impactante para o interior.
            </p>
          </motion.div>
        </div>

        {/* Two-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* MAIN EDITORIAL COLUMN (75%) */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            
            {/* Massive Title Field */}
            <div className="flex flex-col gap-4 group">
              <label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-focus-within:text-accent transition-colors">Manchete Superior</label>
              <textarea
                id="title"
                required
                rows={2}
                className="w-full text-5xl md:text-7xl font-serif font-black italic text-primary border-none outline-none bg-transparent resize-none py-4 placeholder:text-slate-300 transition-all focus:placeholder:text-slate-400"
                placeholder="ESCREVA UMA MANCHETE IMPACTANTE AQUI..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <div className="h-1 w-20 bg-slate-100 group-focus-within:w-full group-focus-within:bg-accent transition-all duration-700" />
            </div>

            {/* Excerpt / Linha Fina */}
            <div className="flex flex-col gap-4 bg-slate-50 p-10 border-l-8 border-slate-900 group">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="text-slate-400" size={16} />
                <label htmlFor="excerpt" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Linha Fina (Resumo Editorial)</label>
              </div>
              <textarea
                id="excerpt"
                rows={4}
                className="w-full text-xl md:text-2xl font-serif italic text-slate-600 bg-transparent border-none outline-none resize-none placeholder:text-slate-400"
                placeholder="Um resumo de 2 a 3 linhas que complementa a manchete e atrai o leitor para o conteúdo completo..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col gap-6 pt-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Corpo da Matéria</span>
                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic font-serif">O texto será formatado automaticamente com espaçamento editorial</span>
              </div>
              <textarea
                required
                rows={20}
                className="w-full text-xl leading-[1.8] text-slate-800 border-none outline-none font-serif placeholder:text-slate-300 resize-y min-h-[600px] py-4"
                placeholder="Comece a registrar os fatos, entrevistas e análises aqui. Mantenha o tom profissional e direto do Jornal do Interior..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>

          {/* STICKY SIDEBAR COLUMN (25%) */}
          <aside className="lg:col-span-4 flex flex-col gap-10 sticky top-32">
            
            {/* Image Upload Monolith */}
            <div className="bg-white border-2 border-slate-900 p-8 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3">
                <ImageIcon size={18} className="text-accent" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Mídia de Capa</h3>
              </div>
              
              <div className="relative aspect-video border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center p-6 hover:bg-slate-100 hover:border-accent transition-all cursor-pointer overflow-hidden group">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                  onChange={handleImageChange}
                />
                
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
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black uppercase tracking-tighter text-slate-500">Upload Hero Image</span>
                      <span className="text-[9px] text-slate-400 font-serif italic">Resolução ideal: 1200x800px</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Classification & Settings */}
            <div className="bg-white border-2 border-slate-900 p-8 flex flex-col gap-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <LayoutIcon size={18} className="text-accent" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Configurações</h3>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Canal Editorial</label>
                <select 
                  className="w-full border-2 border-slate-100 p-4 bg-slate-50 uppercase text-[10px] tracking-[0.2em] font-black text-slate-700 outline-none focus:border-slate-900 transition-all appearance-none cursor-pointer"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">Sincronizando...</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  )}
                </select>
              </div>

              {/* Positioning */}
              <div className="flex flex-col gap-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Posicionamento na Home</label>
                
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-4 cursor-pointer group p-3 border border-slate-50 hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 border-2 border-slate-200 checked:bg-accent appearance-none transition-all cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:-top-1 checked:after:left-0.5 checked:after:text-white checked:after:text-xs checked:bg-slate-900"
                      checked={formData.isHero}
                      onChange={(e) => setFormData({ ...formData, isHero: e.target.checked })}
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 group-hover:text-accent transition-colors">Manchete Hero</span>
                      <span className="text-[9px] text-slate-500 italic font-serif leading-tight">Slider central da página inicial</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-4 cursor-pointer group p-3 border border-slate-50 hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 border-2 border-slate-200 checked:bg-accent appearance-none transition-all cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:-top-1 checked:after:left-0.5 checked:after:text-white checked:after:text-xs checked:bg-slate-900"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 group-hover:text-accent transition-colors">Destaque Exclusivo</span>
                      <span className="text-[9px] text-slate-400 italic font-serif leading-tight">Barra lateral de recomendações</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="flex flex-col gap-4 pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-950 text-white p-6 text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-accent transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] disabled:opacity-50 disabled:grayscale group"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enviando Dados...
                  </>
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Publicar Matéria
                  </>
                )}
              </button>

              <button 
                type="button"
                className="w-full bg-white border-2 border-slate-950 p-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-950 flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
              >
                <Save size={16} />
                Gravar Rascunho
              </button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
