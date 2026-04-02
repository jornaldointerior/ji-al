"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, PenSquare, Home, Settings, LogOut, Activity, Bell, Search } from "lucide-react";
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
              <div className="relative group cursor-pointer">
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-[8px] font-black text-white flex items-center justify-center animate-bounce z-10">3</div>
                <Bell size={20} className="text-slate-600 group-hover:text-primary transition-colors" />
              </div>
              <div className="w-px h-8 bg-slate-100mx-2" />
              <button className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-6 py-2.5 group hover:border-primary transition-all">
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
      </div>
    </AdminAuthWrapper>
  );
}


