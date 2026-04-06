"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Trash2, CheckCircle2, Circle, 
  BarChart3, MessageSquare, Save, X,
  Loader2, AlertCircle
} from "lucide-react";
import Headline from "@/components/ui/Headline";
import { motion, AnimatePresence } from "framer-motion";

interface PollOption {
  id?: string;
  text: string;
  votes: number;
  order: number;
}

interface Poll {
  id: string;
  question: string;
  is_active: boolean;
  created_at: string;
  poll_options: PollOption[];
}

export default function PollsAdmin() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Poll State
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>(["", ""]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPolls();
  }, []);

  async function fetchPolls() {
    setLoading(true);
    const { data, error } = await supabase
      .from('polls')
      .select('*, poll_options(*)')
      .order('created_at', { ascending: false });

    if (data) {
      setPolls(data);
    }
    setLoading(false);
  }

  const handleAddOption = () => setNewOptions([...newOptions, ""]);
  const handleRemoveOption = (index: number) => {
    if (newOptions.length > 2) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
    }
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || newOptions.some(opt => !opt.trim())) return;

    setSubmitting(true);
    try {
      // 1. Create Poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert([{ question: newQuestion, is_active: false }])
        .select()
        .single();

      if (pollError) throw pollError;

      // 2. Create Options
      const optionsToInsert = newOptions.map((text, index) => ({
        poll_id: poll.id,
        text,
        votes: 0,
        order: index
      }));

      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      setIsCreating(false);
      setNewQuestion("");
      setNewOptions(["", ""]);
      fetchPolls();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar enquete.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return; // Already active

    setLoading(true);
    try {
      // Deactivate all
      await supabase.from('polls').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      // Activate this one
      await supabase.from('polls').update({ is_active: true }).eq('id', id);
      fetchPolls();
    } catch (err) {
      console.error(err);
    }
  };

  const deletePoll = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta enquete?")) return;
    
    try {
      await supabase.from('polls').delete().eq('id', id);
      fetchPolls();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-12">
        <div className="flex flex-col gap-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2 block">Engajamento do Leitor</span>
            <Headline variant="primary" className="text-primary text-6xl mb-0 tracking-tighter">Enquetes_</Headline>
            <p className="font-serif italic text-slate-600 text-xl max-w-xl">
              Crie e gerencie as sondagens de opinião que aparecem na barra lateral do portal.
            </p>
          </motion.div>
        </div>
        
        <button 
          onClick={() => setIsCreating(true)}
          className="bg-slate-900 text-white px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent transition-all flex items-center gap-4 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)]"
        >
          <Plus size={18} /> Nova Enquete
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
            <form onSubmit={handleCreatePoll} className="p-10 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-black italic text-2xl text-primary">Nova Sondagem</h3>
                <button type="button" onClick={() => setIsCreating(false)}><X size={20} className="text-slate-300 hover:text-red-500" /></button>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pergunta da Enquete</label>
                <input 
                  autoFocus
                  required
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  placeholder="Ex: Você concorda com as novas medidas?"
                  className="w-full bg-slate-50 border-2 border-slate-100 p-5 text-lg font-serif italic outline-none focus:border-accent transition-all"
                />
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opções de Resposta</label>
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex gap-4">
                    <input 
                      required
                      value={opt}
                      onChange={e => {
                        const updated = [...newOptions];
                        updated[i] = e.target.value;
                        setNewOptions(updated);
                      }}
                      placeholder={`Opção ${i + 1}`}
                      className="flex-1 bg-white border border-slate-200 p-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent"
                    />
                    {newOptions.length > 2 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveOption(i)}
                        className="p-4 border border-slate-100 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={handleAddOption}
                  className="self-start text-[9px] font-black uppercase tracking-widest text-accent hover:text-primary transition-colors flex items-center gap-2 mt-2"
                >
                  <Plus size={14} /> Adicionar Opção
                </button>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  disabled={submitting}
                  className="bg-accent text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Salvar e Publicar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sincronizando Banco de Dados...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {polls.length === 0 ? (
            <div className="p-20 text-center border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center gap-6">
              <MessageSquare size={48} className="text-slate-200" />
              <p className="font-serif italic text-slate-400 text-lg">Nenhuma enquete cadastrada ainda.</p>
              <button 
                onClick={() => setIsCreating(true)}
                className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
              >
                Criar a primeira agora
              </button>
            </div>
          ) : (
            polls.map((poll) => (
              <div 
                key={poll.id} 
                className={`bg-white border-2 p-8 transition-all relative group flex flex-col md:flex-row gap-10 items-start ${
                  poll.is_active ? 'border-accent shadow-[8px_8px_0px_0px_rgba(249,115,22,1)]' : 'border-slate-100'
                }`}
              >
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${poll.is_active ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-300'}`}>
                      <BarChart3 size={18} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {new Date(poll.created_at).toLocaleDateString('pt-BR')} • {poll.poll_options.reduce((acc, curr) => acc + curr.votes, 0)} Votos Totais
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-serif font-black italic text-primary leading-tight">
                    {poll.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {poll.poll_options.sort((a,b) => a.order - b.order).map(opt => (
                      <div key={opt.id} className="flex flex-col gap-1 border-l-2 border-slate-50 pl-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>{opt.text}</span>
                          <span className="text-primary">{opt.votes}</span>
                        </div>
                        <div className="h-1 bg-slate-50 w-full overflow-hidden">
                          <div className="h-full bg-slate-200" style={{ width: '40%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col gap-4 self-stretch justify-center items-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-10 shrink-0">
                  <button 
                    onClick={() => toggleActive(poll.id, poll.is_active)}
                    className={`flex items-center gap-3 px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                      poll.is_active 
                        ? 'bg-accent text-white cursor-default' 
                        : 'bg-white border border-slate-200 text-slate-400 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {poll.is_active ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    {poll.is_active ? 'Ativa no Portal' : 'Ativar Agora'}
                  </button>

                  <button 
                    onClick={() => deletePoll(poll.id)}
                    className="p-4 text-slate-300 hover:text-red-500 transition-colors border border-transparent hover:border-red-100"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Warning Box */}
      <div className="bg-amber-50 border border-amber-100 p-8 flex items-start gap-6">
        <AlertCircle className="text-amber-500 shrink-0" size={24} />
        <div className="flex flex-col gap-1">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-900">Nota de Controle</h5>
          <p className="text-sm font-serif italic text-amber-800 leading-relaxed">
            Apenas uma enquete pode estar ativa por vez. Ao ativar uma nova, a anterior será automaticamente substituída na barra lateral do portal. Os votos são computados em tempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
