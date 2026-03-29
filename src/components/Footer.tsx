import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send } from "lucide-react";
import Link from "next/link";
import Container from "./ui/Container";

export default function Footer() {
  return (
    <footer className="bg-primary pt-16 pb-8 text-white mt-auto">
      <Container className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-sans font-extrabold tracking-tighter">
            JORNAL DO <span className="text-accent underline decoration-white decoration-4 underline-offset-4">INTERIOR</span>
          </h2>
          <p className="text-xs font-sans font-medium text-slate-300 leading-relaxed max-w-xs">
            Desde 1985 levando a verdade e os acontecimentos mais relevantes do sertão para o seu dia a dia. Credibilidade em cada palavra.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-accent transition-colors"><Facebook size={18} /></a>
            <a href="#" className="hover:text-accent transition-colors"><Instagram size={18} /></a>
            <a href="#" className="hover:text-accent transition-colors"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-sans font-black uppercase tracking-widest">Institucional</h3>
          <ul className="flex flex-col gap-3 text-xs font-sans font-bold text-slate-300">
            <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Sobre o Jornal</a></li>
            <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Anuncie Conosco</a></li>
            <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-white transition-colors uppercase tracking-widest">Trabalhe Conosco</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-sans font-black uppercase tracking-widest">Categorias</h3>
          <ul className="grid grid-cols-2 gap-3 text-xs font-sans font-bold text-slate-300 uppercase tracking-widest">
            <li><Link href="/categoria/politica" className="hover:text-white transition-colors">POLÍTICA</Link></li>
            <li><Link href="/categoria/economia" className="hover:text-white transition-colors">ECONOMIA</Link></li>
            <li><Link href="/categoria/policia" className="hover:text-white transition-colors">POLÍCIA</Link></li>
            <li><Link href="/categoria/cultura" className="hover:text-white transition-colors">CULTURA</Link></li>
            <li><Link href="/categoria/esportes" className="hover:text-white transition-colors">ESPORTES</Link></li>
            <li><Link href="/categoria/eventos" className="hover:text-white transition-colors">EVENTOS</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-sans font-black uppercase tracking-widest">Newsletter</h3>
          <p className="text-xs font-sans font-medium text-slate-300">
            Assine nossa newsletter e receba notícias em primeira mão no seu e-mail.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Seu e-mail..." 
              className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-xs font-sans focus:outline-none focus:border-accent transition-colors"
            />
            <button className="bg-white text-primary px-4 py-2 hover:bg-accent hover:text-white transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </Container>

      <Container className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-sans font-bold text-slate-400">
        <p>© 2026 JORNAL DO INTERIOR. TODOS OS DIREITOS RESERVADOS.</p>
        <p>DESENVOLVIDO POR <span className="text-white">JI AL DIGITAL</span></p>
      </Container>
    </footer>
  );
}
