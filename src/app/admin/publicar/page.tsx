"use client";

import { useState, useEffect } from "react";
import Headline from "@/components/ui/Headline";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

      // 1. Upload Image to Supabase Storage if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("articles")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Erro ao fazer upload da imagem. O bucket 'articles' pode não estar configurado corretamente público.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("articles")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Fetch an author or create one if none exists for demo purposes
      // (Since we don't have a reliable auth setup for this demo)
      let authorId = null;
      const { data: authors } = await supabase.from('authors').select('id').limit(1);
      if (authors && authors.length > 0) {
         authorId = authors[0].id;
      }

      // 3. Insert Article to Database
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
      // Reset form
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
      
      // Auto dismiss success after 5s
      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao publicar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 border-b border-primary/10 pb-8">
        <Headline variant="tertiary" className="text-primary text-4xl mb-0">Publicar Notícia</Headline>
        <p className="font-serif italic text-slate-500 text-lg">Crie uma nova matéria para o portal Journal do Interior.</p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-800 p-6 border border-green-200 flex items-center gap-4">
          <CheckCircle2 className="text-green-600" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-widest uppercase">Publicado com sucesso</span>
            <span className="text-sm opacity-80">A notícia já está disponível no banco de dados.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 p-6 border border-red-200 flex items-center gap-4">
          <AlertCircle className="text-red-600" />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-widest uppercase">Erro ao Publicar</span>
            <span className="text-sm opacity-80">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Título e Resumo */}
        <div className="bg-white p-8 border border-slate-200 flex flex-col gap-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Editorial</h3>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-bold text-slate-700">Manchete (Título Principal)</label>
            <textarea
              id="title"
              required
              rows={2}
              className="w-full text-3xl md:text-5xl font-serif font-black italic text-primary border-b border-slate-200 focus:border-accent outline-none bg-transparent resize-none py-2 transition-colors placeholder:text-slate-300"
              placeholder="Escreva uma manchete impactante..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="excerpt" className="text-sm font-bold text-slate-700">Sutiã (Linha Fina / Resumo)</label>
            <textarea
              id="excerpt"
              rows={3}
              className="w-full text-lg font-serif italic text-slate-600 border border-slate-200 p-4 focus:border-accent outline-none bg-slate-50 transition-colors placeholder:text-slate-400"
              placeholder="Complemente a manchete com um resumo rápido de até 3 linhas..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>
        </div>

        {/* Mídia */}
        <div className="bg-white p-8 border border-slate-200 flex flex-col gap-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Mídia (Opcional)</h3>
          
          <div className="relative border-2 border-dashed border-slate-300 bg-slate-50 p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer overflow-hidden min-h-[200px]">
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={handleImageChange}
            />
            
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
              <>
                <UploadCloud size={40} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700">Clique ou arraste uma imagem hero</span>
                  <span className="text-sm text-slate-500 font-serif italic">Imagens de alta resolução, horizontais (800x600+)</span>
                </div>
              </>
            )}

            {imagePreview && (
              <div className="absolute inset-0 bg-primary/80 text-white opacity-0 hover:opacity-100 flex flex-col items-center justify-center transition-opacity z-20 pointer-events-none">
                <UploadCloud size={32} className="mb-2" />
                <span className="font-bold tracking-widest text-[10px] uppercase">Trocar Imagem</span>
              </div>
            )}
          </div>
        </div>

        {/* Corpo da Matéria */}
        <div className="bg-white p-8 border border-slate-200 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Corpo da Matéria</h3>
            <span className="text-xs text-slate-400 font-serif italic">Suporta quebras de linha padrão</span>
          </div>
          
          <textarea
            required
            rows={15}
            className="w-full text-lg leading-relaxed text-slate-800 border-none outline-none font-serif placeholder:text-slate-300 resize-y"
            placeholder="Comece a escrever o texto completo da matéria aqui..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>

        {/* Metadados e Configurações */}
        <div className="bg-white p-8 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Classificação</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Categoria</label>
              <select 
                className="border border-slate-200 p-3 bg-slate-50 uppercase text-xs tracking-widest font-bold text-slate-700 outline-none focus:border-accent"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                {categories.length === 0 ? (
                  <option value="">Carregando...</option>
                ) : (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Posicionamento Frontal</h3>
            
            <div className="flex flex-col gap-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-accent"
                  checked={formData.isHero}
                  onChange={(e) => setFormData({ ...formData, isHero: e.target.checked })}
                />
                <span className="text-sm font-bold text-slate-700 group-hover:text-accent transition-colors">Manchete Hero principal (Slider Central)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-accent"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                <span className="text-sm font-bold text-slate-700 group-hover:text-accent transition-colors">Destaque Exclusivo (Barra Lateral Direita)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
          <button 
            type="button"
            className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Salvar como Rascunho
          </button>
          
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-10 py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-accent transition-colors shadow-xl flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Publicando...
              </>
            ) : (
              "Publicar Imediatamente"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
