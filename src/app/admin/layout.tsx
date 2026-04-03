"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, PenSquare, Home, Settings, LogOut, Activity, Bell, Search, X, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const searchArticles = async () => {
      if (searchQuery.trim().length > 2) {
        const { data } = await supabase
          .from('articles')
          .select('id, title, categories(name)')
          .ilike('title', `%${searchQuery}%`)
          .limit(5);
        setSearchResults(data || []);
      } else {
        setSearchResults([]);
      }
    };
    const debounce = setTimeout(searchArticles, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/noticias", icon: FileText, label: "Gerenciar" },
    { href: "/admin/publicar", icon: PenSquare, label: "Publicar" },
  ];

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-accent selection:text-white">
        {/* Sidebar - Floating Monolith */}
        <aside className="w-[280px] bg-slate-950 text-white flex flex-col fixed h-full z-50 border-r border-white/5">
          {/* Logo Section */}
          <div className="p-8 border-b border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-1 relative z-10"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.6em] text-accent">Central de Comando</span>
              <h1 className="text-3xl font-serif italic font-black text-white leading-tight">
                Jornal do<br />Interior.
              </h1>
            </motion.div>
            
            {/* Vertical Watermark */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 rotate-90 text-[40px] font-black text-white/5 whitespace-nowrap pointer-events-none select-none tracking-tighter">
              EST. 2026
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-10 flex flex-col gap-1 px-4">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link 
                    href={item.href} 
                    className={`flex items-center justify-between group px-5 py-4 transition-all duration-300 relative border border-transparent ${
                      isActive 
                        ? "bg-white/5 border-white/10 text-white" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <item.icon size={18} className={isActive ? "text-accent" : "group-hover:text-accent transition-colors"} />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                    </div>
                    {isActive && (
                      <motion.div 
                        layoutId="active-pill"
                        className="w-1.5 h-1.5 bg-accent rounded-full"
                      />
                    )}
                    <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors duration-500" />
                  </Link>
                </motion.div>
              );
            })}
            
            <div className="my-8 h-px bg-white/5 mx-5" />
            
            <Link 
              href="/" 
              className="flex items-center gap-4 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all group"
            >
              <Home size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Ver Portal Externo
            </Link>
          </nav>

          {/* User & Logout */}
          <div className="p-6 border-t border-white/5 bg-slate-900/50">
            <div className="flex items-center gap-4 mb-6 px-2">
              <div className="w-10 h-10 bg-accent flex items-center justify-center font-serif italic text-white font-black text-lg">
                JD
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-wider text-white">Admin Master</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Editorial Level 5</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="group flex items-center justify-between w-full p-4 border border-white/5 hover:border-accent/40 bg-white/0 hover:bg-accent/5 transition-all duration-500"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-white">Encerrar Sessão</span>
              <LogOut size={16} className="text-slate-500 group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 ml-[280px] min-h-screen flex flex-col bg-white">
          {/* Status Header - Ticker Style */}
          <header className="h-20 border-b border-slate-900 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-md z-40">
            <div className="flex items-center gap-8 divide-x divide-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                  <div className="w-0.5 h-3 bg-slate-200" />
                  <div className="w-1.5 h-1.5 bg-green-500/30" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Node Cluster: BRA-01</span>
              </div>
              <div className="pl-8 flex items-center gap-3 text-slate-600">
                <Activity size={14} className="text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest">Memória: 4.2GB / Latência: 12ms</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div 
                className="relative group cursor-pointer"
                onClick={() => setIsNotificationsOpen(true)}
              >
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-[8px] font-black text-white flex items-center justify-center animate-bounce z-10">3</div>
                <Bell size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <div className="w-px h-8 bg-slate-100 mx-2" />
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-6 py-2.5 group hover:border-primary transition-all"
              >
                <Search size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Pesquisar Matéria...</span>
                <span className="text-[9px] font-bold text-slate-500 ml-4 border border-slate-200 px-1 py-0.5 group-hover:border-slate-300">⌘K</span>
              </button>
            </div>
          </header>

          {/* Page Content with Staggered Reveal */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            className="p-12 w-full max-w-[1400px] mx-auto flex-1 selection:bg-accent selection:text-white"
          >
            {children}
          </motion.div>
        </main>

        {/* Global Search Modal */}
        <AnimatePresence>
          {isSearchOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsSearchOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="relative w-full max-w-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-10"
              >
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
                  <Search size={20} className="text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Pesquisar por notícias..."
                    className="flex-1 bg-transparent text-lg text-slate-900 outline-none placeholder:text-slate-300 font-serif italic"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto w-full p-2">
                  {searchResults.length > 0 ? (
                    searchResults.map(result => (
                      <div 
                        key={result.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/admin/noticias/editar?id=${result.id}`);
                        }}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent">{result.categories?.name || "Editorial"}</span>
                          <span className="font-serif italic font-bold text-slate-800 group-hover:text-primary transition-colors">{result.title}</span>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-accent transition-colors md:opacity-0 group-hover:opacity-100" />
                      </div>
                    ))
                  ) : searchQuery.length > 2 ? (
                    <div className="p-8 text-center text-slate-400 font-serif italic">
                      Nenhuma matéria encontrada.
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Notifications Drawer */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsNotificationsOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 z-10 flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-3">
                    <Bell size={16} className="text-accent" />
                    Notificações
                  </h3>
                  <button onClick={() => setIsNotificationsOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 transition-all">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                  {/* Mock Notifications Data */}
                  <div className="flex flex-col gap-2 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-slate-200">
                    <div className="absolute left-1 top-2 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Agora</span>
                    <p className="text-sm font-serif italic text-slate-700">Deploy concluído com sucesso. Suas páginas estáticas foram atualizadas globalmente.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-slate-200">
                    <div className="absolute left-1 top-2 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Há 2 horas</span>
                    <p className="text-sm font-serif italic text-slate-700">Novo acesso gerencial detectado no painel a partir do IP local.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-slate-100">
                    <div className="absolute left-1 top-2 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ontem</span>
                    <p className="text-sm font-serif italic text-slate-700">Backup de segurança do banco de dados concluído.</p>
                  </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-accent transition-colors">Marcar todas como lidas</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminAuthWrapper>
  );
}


