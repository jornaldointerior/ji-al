"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X as CloseIcon, Facebook, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "../ui/Container";

const CATEGORIES = [
  { name: "Política", href: "/categoria/politica" },
  { name: "Economia", href: "/categoria/economia" },
  { name: "Polícia", href: "/categoria/policia" },
  { name: "Esportes", href: "/categoria/esportes" },
  { name: "Cultura", href: "/categoria/cultura" },
  { name: "Eventos", href: "/categoria/eventos" },
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
        <Container className="flex justify-between items-center text-[11px] font-sans font-medium text-slate-500 uppercase tracking-wider">
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
        "bg-white z-50 transition-all duration-300",
        isScrolled ? "fixed top-0 left-0 right-0 shadow-md py-2" : "relative py-6"
      )}>
        <Container className="flex justify-between items-center">
          <Link href="/" className="group">
            <h1 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tighter text-primary">
              JORNAL DO <span className="text-accent underline decoration-4 underline-offset-4">INTERIOR</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-[-4px] group-hover:text-primary transition-colors">
              Credibilidade e Verdade
            </p>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.name} 
                href={cat.href}
                className="text-xs uppercase font-sans font-bold tracking-widest text-slate-600 hover:text-primary transition-colors relative group"
              >
                {cat.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className={cn(
                  "bg-slate-100 border-none text-xs font-sans px-4 py-2 transition-all duration-300 focus:ring-1 focus:ring-primary rounded-none",
                  isSearchOpen ? "w-48 opacity-100" : "w-0 opacity-0 pointer-events-none"
                )}
              />
              <button 
                className="p-2 text-slate-600 hover:text-primary transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {isSearchOpen ? <CloseIcon size={18} /> : <Search size={20} />}
              </button>
            </div>
            <button 
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white lg:hidden pt-24 overflow-y-auto">
          <Container className="flex flex-col gap-6 py-10">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.name} 
                href={cat.href}
                className="text-2xl font-sans font-bold text-primary border-b border-slate-100 pb-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
