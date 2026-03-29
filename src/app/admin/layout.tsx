import Link from "next/link";
import { LayoutDashboard, FileText, PenSquare, Home, Settings, LogOut } from "lucide-react";

export const metadata = {
  title: "Admin | Jornal do Interior",
  description: "Painel administrativo do portal Jornal do Interior.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Brutalist Editorial Style */}
      <aside className="w-64 bg-primary text-white flex flex-col fixed h-full border-r border-primary/20 shadow-2xl z-50">
        <div className="p-6 border-b border-white/10 flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent/80">Painel de Controle</span>
          <h1 className="text-2xl font-serif italic font-black text-white leading-none">
            Jornal do<br />Interior.
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white/70 hover:text-white hover:bg-white/5 transition-all">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/admin/noticias" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white/70 hover:text-white hover:bg-white/5 transition-all">
            <FileText size={18} />
            Gerenciar
          </Link>
          <Link href="/admin/publicar" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-accent/90 hover:text-accent hover:bg-accent/10 transition-all border border-accent/20">
            <PenSquare size={18} />
            Publicar
          </Link>
          <div className="my-4 h-px bg-white/10 w-full" />
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <Home size={18} />
            Ver Portal
          </Link>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.1em] text-white/40 hover:text-accent transition-colors w-full">
            <LogOut size={16} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sistema Online</span>
          </div>
          <div className="flex items-center gap-4">
             <button className="text-slate-400 hover:text-primary transition-colors">
               <Settings size={18} />
             </button>
             <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-serif italic text-primary font-bold">
               A
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 w-full max-w-7xl mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
