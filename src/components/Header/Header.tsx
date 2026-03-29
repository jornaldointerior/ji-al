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
        "bg-white z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "fixed top-0 left-0 right-0 border-slate-200 py-3" : "relative py-10"
      )}>
        <Container className="flex justify-between items-center">
          <Link href="/" className="group flex flex-col items-center mx-auto lg:mx-0">
            <h1 className="text-3xl md:text-5xl font-serif font-black tracking-[-0.05em] text-primary leading-none uppercase">
              Jornal do <span className="text-accent underline decoration-8 underline-offset-8 decoration-primary/10">Interior</span>
            </h1>
            <div className="flex items-center gap-4 w-full mt-4">
              <div className="h-px bg-slate-200 flex-1" />
              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-slate-400 group-hover:text-primary transition-colors whitespace-nowrap">
                Credibilidade e Verdade
              </p>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
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
                className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-slate-500 hover:text-primary transition-colors relative group py-2"
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-primary hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={18} strokeWidth={2.5} />
            </button>
            <button 
              className="lg:hidden p-2 text-primary"
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
