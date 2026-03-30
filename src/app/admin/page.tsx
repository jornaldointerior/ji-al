import { FileText, TrendingUp, Users } from "lucide-react";
import Headline from "@/components/ui/Headline";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Headline variant="primary" className="text-primary text-3xl mb-0">Visão Geral</Headline>
        <p className="font-serif italic text-slate-500">Acompanhe as métricas do Jornal do Interior hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 border border-slate-200 flex flex-col gap-4 relative overflow-hidden group hover:border-accent/40 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={80} />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 p-2 rounded-lg text-primary">
              <FileText size={20} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Notícias</h3>
          </div>
          <p className="text-4xl font-serif italic font-black text-primary">12</p>
          <div className="text-[10px] uppercase font-bold text-accent">+3 essa semana</div>
        </div>

        <div className="bg-white p-6 border border-slate-200 flex flex-col gap-4 relative overflow-hidden group hover:border-accent/40 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 p-2 rounded-lg text-primary">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Acessos Hoje</h3>
          </div>
          <p className="text-4xl font-serif italic font-black text-primary">1.4K</p>
          <div className="text-[10px] uppercase font-bold text-accent">+12% vs ontem</div>
        </div>

        <div className="bg-white p-6 border border-slate-200 flex flex-col gap-4 relative overflow-hidden group hover:border-accent/40 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/5 p-2 rounded-lg text-primary">
              <Users size={20} />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Assinaturas</h3>
          </div>
          <p className="text-4xl font-serif italic font-black text-primary">48</p>
          <div className="text-[10px] uppercase font-bold text-slate-400">Total de membros ativos</div>
        </div>
      </div>

      <div className="mt-8 bg-white border border-slate-200 p-8 flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="bg-slate-50 p-4 rounded-full text-slate-400 mb-2">
           <FileText size={24} />
        </div>
        <h3 className="font-serif font-black italic text-2xl text-primary">Pronto para publicar?</h3>
        <p className="text-slate-500 max-w-sm">Use a ferramenta de publicação para adicionar novas matérias ao portal.</p>
        <button className="mt-4 bg-accent text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-colors">
          Publicar Notícia +
        </button>
      </div>
    </div>
  );
}
