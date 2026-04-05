"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, PenSquare, Home, LogOut,
  Activity, Bell, Search, X, ChevronRight, ChevronLeft,
  GripVertical, Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import { motion, AnimatePresence } from "framer-motion";

const MIN_WIDTH = 64;
const MAX_WIDTH = 480;
const COLLAPSE_THRESHOLD = 120;
const DEFAULT_WIDTH = 280;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Drag state refs (don't need re-render)
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(DEFAULT_WIDTH);
  const sidebarRef = useRef<HTMLElement>(null);

  // ── Drag handlers ──────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - startX.current;
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + delta));
    setSidebarWidth(newWidth);
    setIsCollapsed(newWidth < COLLAPSE_THRESHOLD);
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }, [onMouseMove]);

  const onDragHandleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [sidebarWidth, onMouseMove, onMouseUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // Toggle collapse
  const toggleCollapse = () => {
    if (isCollapsed) {
      setSidebarWidth(DEFAULT_WIDTH);
      setIsCollapsed(false);
    } else {
      setSidebarWidth(MIN_WIDTH);
      setIsCollapsed(true);
    }
  };

  // ── Keyboard shortcut ───────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Search ──────────────────────────────────────────────────
  useEffect(() => {
    const searchArticles = async () => {
      if (searchQuery.trim().length > 2) {
        const { data } = await supabase
          .from('articles')
          .select('id, slug, title, categories(name)')
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
    { href: "/admin/artigos-coluna", icon: FileText, label: "Artigos" },
    { href: "/admin/colunistas", icon: Users, label: "Colunistas" },
    { href: "/admin/enquetes", icon: Activity, label: "Enquetes" },
    { href: "/admin/acessos", icon: Activity, label: "Acessos" },
  ];

  const effectiveWidth = isCollapsed ? MIN_WIDTH : sidebarWidth;

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-accent selection:text-white">

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside
          ref={sidebarRef}
          className="bg-slate-950 text-white flex flex-col fixed h-full z-50 border-r border-white/5 transition-none overflow-hidden"
          style={{ width: effectiveWidth }}
        >
          {/* Logo */}
          <div className="p-5 border-b border-white/5 relative overflow-hidden group shrink-0">
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-1 relative z-10 min-w-0"
            >
              {!isCollapsed && (
                <>
                  <span className="text-[9px] font-black uppercase tracking-[0.6em] text-accent truncate">Central de Comando</span>
                  <h1 className="text-2xl font-serif italic font-black text-white leading-tight truncate">
                    Jornal do<br />Interior.
                  </h1>
                </>
              )}
              {isCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-widest text-accent text-center w-full block">JI</span>
              )}
            </motion.div>
            {/* Year watermark */}
            {!isCollapsed && (
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 rotate-90 text-[32px] font-black text-white/5 whitespace-nowrap pointer-events-none select-none tracking-tighter">
                EST. 2026
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-2">
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
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-3.5 transition-all duration-200 relative rounded-sm border border-transparent ${
                      isActive
                        ? "bg-white/8 border-white/10 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <item.icon
                      size={18}
                      className={`shrink-0 ${isActive ? "text-accent" : "group-hover:text-accent transition-colors"}`}
                    />
                    {!isCollapsed && (
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] truncate">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="active-pill"
                        className="ml-auto w-1.5 h-1.5 bg-accent rounded-full shrink-0"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            <div className="my-4 h-px bg-white/5 mx-2" />

            <Link
              href="/"
              title={isCollapsed ? "Ver Portal" : undefined}
              className={`flex items-center gap-3 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all group rounded-sm hover:bg-white/5 ${isCollapsed ? "justify-center" : ""}`}
            >
              <Home size={16} className="shrink-0 group-hover:-translate-y-0.5 transition-transform" />
              {!isCollapsed && <span className="truncate">Ver Portal</span>}
            </Link>
          </nav>

          {/* User & Logout */}
          <div className={`border-t border-white/5 bg-slate-900/50 shrink-0 ${isCollapsed ? "p-2" : "p-4"}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-3 mb-4 px-1">
                <div className="w-8 h-8 bg-accent flex items-center justify-center font-serif italic text-white font-black text-sm shrink-0">
                  JD
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white truncate">Admin Master</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter truncate">Editorial Level 5</span>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              title={isCollapsed ? "Encerrar Sessão" : undefined}
              className={`flex items-center w-full p-3 border border-white/5 hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-300 rounded-sm group ${isCollapsed ? "justify-center" : "justify-between"}`}
            >
              {!isCollapsed && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-white truncate">Encerrar Sessão</span>
              )}
              <LogOut size={15} className="text-slate-500 group-hover:text-red-400 shrink-0" />
            </button>
          </div>

          {/* ── Drag Handle ── */}
          <div
            onMouseDown={onDragHandleMouseDown}
            className="absolute top-0 right-0 w-4 h-full flex items-center justify-center cursor-col-resize group z-10 hover:bg-white/5 transition-colors"
            title="Arraste para redimensionar"
          >
            <GripVertical size={12} className="text-white/20 group-hover:text-accent transition-colors" />
          </div>

          {/* ── Collapse/Expand toggle ── */}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
            className="absolute -right-3.5 top-[72px] w-7 h-7 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-accent hover:border-accent transition-all z-20 shadow-lg"
          >
            {isCollapsed
              ? <ChevronRight size={13} className="text-white" />
              : <ChevronLeft size={13} className="text-white" />
            }
          </button>
        </aside>

        {/* ── Main Content ────────────────────────────────────── */}
        <main
          className="flex-1 min-h-screen flex flex-col bg-white transition-none"
          style={{ marginLeft: effectiveWidth }}
        >
          {/* Status Header */}
          <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 bg-white/90 backdrop-blur-md z-40 shadow-sm">
            <div className="flex items-center gap-6 divide-x divide-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 animate-pulse rounded-full" />
                  <div className="w-px h-3 bg-slate-200" />
                  <div className="w-1.5 h-1.5 bg-green-500/30 rounded-full" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">BRA-01 · Online</span>
              </div>
              <div className="pl-6 flex items-center gap-2 text-slate-500">
                <Activity size={13} className="text-accent" />
                <span className="text-[9px] font-black uppercase tracking-widest">4.2GB · 12ms</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="relative cursor-pointer group"
                onClick={() => setIsNotificationsOpen(true)}
              >
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent text-[7px] font-black text-white flex items-center justify-center rounded-full z-10">3</div>
                <Bell size={18} className="text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <div className="w-px h-6 bg-slate-100" />
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-5 py-2 group hover:border-primary transition-all rounded-sm"
              >
                <Search size={15} className="text-slate-500 group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Pesquisar</span>
                <span className="text-[8px] font-bold text-slate-400 ml-2 border border-slate-200 px-1 py-0.5">⌘K</span>
              </button>
            </div>
          </header>

          {/* Page Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="p-10 w-full max-w-[1400px] mx-auto flex-1 selection:bg-accent selection:text-white"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── Global Search Modal ────────────────────────────── */}
        <AnimatePresence>
          {isSearchOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSearchOpen(false)}
                className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                className="fixed left-1/2 -translate-x-1/2 top-[14vh] w-full max-w-xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-[101]"
              >
                <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
                  <Search size={18} className="text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Pesquisar matérias..."
                    className="flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-300 font-serif italic"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button onClick={() => setIsSearchOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <div className="max-h-[55vh] overflow-y-auto p-2">
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
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-accent">{result.categories?.name || "Editorial"}</span>
                          <span className="font-serif italic font-bold text-slate-800 group-hover:text-primary transition-colors">{result.title}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-accent transition-colors" />
                      </div>
                    ))
                  ) : searchQuery.length > 2 ? (
                    <div className="p-8 text-center text-slate-400 font-serif italic">Nenhuma matéria encontrada.</div>
                  ) : null}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Notifications Drawer ───────────────────────────── */}
        <AnimatePresence>
          {isNotificationsOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNotificationsOpen(false)}
                className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed right-0 top-0 w-full max-w-xs bg-white h-full shadow-2xl border-l border-slate-200 z-[101] flex flex-col"
              >
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-3">
                    <Bell size={15} className="text-accent" />
                    Notificações
                  </h3>
                  <button onClick={() => setIsNotificationsOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 transition-all">
                    <X size={15} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                  {[
                    { color: "bg-accent", time: "Agora", text: "Deploy concluído. Páginas atualizadas globalmente." },
                    { color: "bg-green-500", time: "Há 2 horas", text: "Novo acesso ao painel detectado." },
                    { color: "bg-slate-300", time: "Ontem", text: "Backup do banco de dados concluído." },
                  ].map((n, i) => (
                    <div key={i} className="flex flex-col gap-1.5 relative pl-5 before:absolute before:left-2 before:top-3 before:bottom-0 before:w-px before:bg-slate-100">
                      <div className={`absolute left-1 top-2 w-2 h-2 rounded-full ${n.color} ring-4 ring-white`} />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{n.time}</span>
                      <p className="text-sm font-serif italic text-slate-600">{n.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-accent transition-colors">Marcar todas como lidas</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AdminAuthWrapper>
  );
}
