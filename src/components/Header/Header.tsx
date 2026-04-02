"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X as CloseIcon, Facebook, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "../ui/Container";

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
                className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-slate-700 hover:text-primary transition-colors relative group py-2"
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
