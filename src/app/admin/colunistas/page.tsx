"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Trash2, Edit, Save, X, 
  Loader2, UserCircle, Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import Headline from "@/components/ui/Headline";
import { motion, AnimatePresence } from "framer-motion";

interface Columnist {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  image_url: string | null;
  created_at: string;
}

export default function ColumnistsAdmin() {
  const [columnists, setColumnists] = useState<Columnist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Columnist | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    image_url: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchColumnists();
  }, []);

  async function fetchColumnists() {
    setLoading(true);
    const { data, error } = await supabase
      .from('columnists')
      .select('*')
      .order('name', { ascending: true });

    if (data) setColumnists(data);
    setLoading(false);
  }

  const createSlug = (name: string) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let error;
      if (isEditing) {
        const { error: updateError } = await supabase.from('columnists').update({
          name: formData.name,
          bio: formData.bio,
          image_url: formData.image_url,
          slug: createSlug(formData.name)
        }).eq('id', isEditing.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('columnists').insert([{
          name: formData.name,
          bio: formData.bio,
          image_url: formData.image_url,
          slug: createSlug(formData.name)
        }]);
        error = insertError;
      }
      
      if (error) {
        console.error("Supabase Error:", error);
        alert(`Erro ao salvar colunista: ${error.message}`);
        return;
      }

      resetForm();
      fetchColumnists();
    } catch (err) {
      console.error("Exception:", err);
      alert("Ocorreu um erro inesperado. Verifique o console.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setIsCreating(false);
    setFormData({ name: "", bio: "", image_url: "" });
  };

  const startEdit = (c: Columnist) => {
    setIsEditing(c);
    setFormData({
      name: c.name,
      bio: c.bio || "",
      image_url: c.image_url || ""
    });
    setIsCreating(true);
  };

  const deleteColumnist = async (id: string) => {
    if (!confirm("Excluir este colunista removerá todos os seus artigos vinculados. Continuar?")) return;
    const { error } = await supabase.from('columnists').delete().eq('id', id);
    if (error) {
      console.error("Delete Error:", error);
      alert(`Erro ao excluir colunista: ${error.message}`);
    } else {
      fetchColumnists();
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-12">
        <div className="flex flex-col gap-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2 block">Nossa Redação Especializada</span>
            <Headline variant="primary" className="text-primary text-6xl mb-0 tracking-tighter">Colunistas_</Headline>
            <p className="font-serif italic text-slate-600 text-xl max-w-xl">
              Gerencie os especialistas e opiniões que trazem profundidade ao portal.
            </p>
          </motion.div>
        </div>
        
        <button 
          onClick={() => { resetForm(); setIsCreating(true); }}
          className="bg-slate-900 text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all flex items-center gap-4 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)]"
        >
          <Plus size={18} /> Novo Colunista
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
                  {isEditing ? `Editar: ${isEditing.name}` : "Novo Colunista"}
                </h3>
                <button type="button" onClick={resetForm}><X size={20} className="text-slate-300 hover:text-red-500" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                   <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome Completo</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Alberto Dines"
                      className="w-full bg-slate-50 border-2 border-slate-100 p-5 text-lg font-serif italic outline-none focus:border-accent transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL da Foto</label>
                    <div className="relative group">
                      <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        value={formData.image_url}
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                        placeholder="https://exemplo.com/foto.jpg"
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 pl-12 text-[10px] font-sans font-black uppercase tracking-widest outline-none focus:border-accent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biografia / Titulação</label>
                  <textarea 
                    rows={6}
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    placeholder="Breve descrição sobre o autor..."
                    className="w-full h-full bg-slate-50 border-2 border-slate-100 p-5 text-sm font-serif italic outline-none focus:border-accent transition-all resize-none"
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
                  Salvar Perfil
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organizando Redação...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {columnists.map((c) => (
            <div 
              key={c.id} 
              className="bg-white border-2 border-slate-100 p-8 hover:border-accent transition-all group relative flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 overflow-hidden shrink-0 group-hover:border-accent transition-colors">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <UserCircle size={80} className="text-slate-100 -m-1" />
                  )}
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => startEdit(c)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-accent hover:bg-white border border-transparent hover:border-accent/10 transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => deleteColumnist(c.id)}
                    className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-accent" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-accent">Colunista Verificado</span>
                </div>
                <h4 className="text-xl font-serif font-black italic text-primary leading-tight group-hover:text-accent transition-colors">
                  {c.name}
                </h4>
                <p className="text-xs text-slate-400 font-serif italic line-clamp-3 leading-relaxed">
                  {c.bio || "Nenhuma biografia cadastrada."}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">@{c.slug}</span>
                <span className="text-[9px] font-bold uppercase text-slate-400">Editorial</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
