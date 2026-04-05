"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X as CloseIcon, Facebook, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "../ui/Container";
import Headline from "../ui/Headline";

const CATEGORIES = [
  { name: "Alagoas", href: "/categoria/alagoas" },
  { name: "Brasil", href: "/categoria/brasil" },
  { name: "Mundo", href: "/categoria/mundo" },
  { name: "Esportes", href: "/categoria/esportes" },
  { name: "Cultura e Entretenimento", href: "/categoria/cultura-e-entretenimento" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-2 hidden md:block">
        <Container className="flex justify-between items-center text-[11px] font-sans font-medium text-slate-700 uppercase tracking-wider">
          <div className="flex gap-4 items-center">
            <span>{new Date().toLocaleDateString("pt-BR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#" className="hover:text-primary transition-colors"><Facebook size={14} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Instagram size={14} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Twitter size={14} /></a>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <div className={cn(
        "bg-white z-50 transition-all duration-300 border-b border-slate-100 sticky top-0 w-full",
        isScrolled ? "py-2 shadow-md" : "py-4 shadow-sm"
      )}>
        <Container className="flex justify-between items-center">
          <Link href="/" className="group flex items-center mx-auto lg:mx-0 py-2">
            <Image 
              src="/logo_ji.png" 
              alt="Jornal do Interior Logo" 
              width={350} 
              height={100} 
              className="h-auto w-full max-w-[240px] md:max-w-[320px] object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className={cn(
            "hidden lg:flex items-center gap-10 transition-all duration-300",
            isScrolled ? "opacity-100" : "opacity-90"
          )}>
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.name} 
                href={cat.href}
                className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-slate-700 hover:text-primary transition-colors relative z-50 group py-2"
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-1 md:gap-2">
            <button 
              className="w-11 h-11 flex items-center justify-center text-primary hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Abrir busca"
            >
              <Search size={20} strokeWidth={2.5} />
            </button>
            <button 
              className="lg:hidden w-11 h-11 flex items-center justify-center text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <CloseIcon size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white transition-opacity duration-300 lg:hidden">
          <button 
            className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <CloseIcon size={28} />
          </button>
          
          <Container className="h-full flex flex-col justify-center py-20">
            <div className="flex flex-col gap-6">
              <Headline variant="accent" className="text-[10px] uppercase font-black tracking-[0.5em] mb-4">
                Categorias
              </Headline>
              {CATEGORIES.map((cat) => (
                <Link 
                  key={cat.name} 
                  href={cat.href}
                  className="text-3xl md:text-5xl font-sans font-black text-primary border-b border-slate-100 pb-6 flex justify-between items-center group transition-colors hover:text-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              ))}
            </div>
            
            <div className="mt-auto pt-10 flex gap-6 border-t border-slate-100">
               <a href="#" className="p-3 bg-slate-50 rounded-full text-primary"><Facebook size={20} /></a>
               <a href="#" className="p-3 bg-slate-50 rounded-full text-primary"><Instagram size={20} /></a>
               <a href="#" className="p-3 bg-slate-50 rounded-full text-primary"><Twitter size={20} /></a>
            </div>
          </Container>
        </div>
      )}

      {/* Global Search Overlay Placeholder */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-primary/95 flex flex-col items-center justify-center p-6 md:p-12">
          <button 
            className="absolute top-6 right-6 text-white p-2"
            onClick={() => setIsSearchOpen(false)}
          >
            <CloseIcon size={32} />
          </button>
          <div className="w-full max-w-4xl">
            <input 
              type="text" 
              placeholder="PESQUISAR NO PORTAL..." 
              className="w-full bg-transparent border-b-2 border-white/20 text-white text-3xl md:text-5xl font-sans font-black uppercase tracking-widest py-6 outline-none focus:border-accent transition-colors"
              autoFocus
            />
            <p className="mt-8 text-white/40 text-[10px] uppercase font-black tracking-[0.4em]">Pressione ESC para sair</p>
          </div>
        </div>
      )}
    </header>
  );
}
