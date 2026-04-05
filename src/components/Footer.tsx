"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";
import Container from "./ui/Container";

const CATEGORIES = [
  { label: "Alagoas", href: "/categoria/alagoas" },
  { label: "Brasil", href: "/categoria/brasil" },
  { label: "Mundo", href: "/categoria/mundo" },
  { label: "Esportes", href: "/categoria/esportes" },
  { label: "Cultura e Entretenimento", href: "/categoria/cultura-e-entretenimento" },
];

const INSTITUTIONAL = [
  { label: "Sobre o Jornal", href: "/sobre" },
  { label: "Anuncie Conosco", href: "mailto:contato@jornaldointerior.com.br" },
  { label: "Política de Privacidade", href: "/privacidade" },
  { label: "Trabalhe Conosco", href: "mailto:redacao@jornaldointerior.com.br" },
];

export default function Footer() {
  return (
    <footer className="bg-primary pt-16 pb-8 text-white mt-auto">
      <Container className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* About */}
        <div className="flex flex-col gap-6">
          <p className="text-xs font-sans font-medium text-slate-200 leading-relaxed max-w-xs">
            Levando a verdade e os acontecimentos mais relevantes para o seu dia a dia.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-accent transition-colors"><Facebook size={18} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-accent transition-colors"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Institutional */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-sans font-black uppercase tracking-widest">Institucional</h3>
          <ul className="flex flex-col gap-3 text-xs font-sans font-bold text-slate-200">
            {INSTITUTIONAL.map(link => (
              <li key={link.href}>
                {link.href.startsWith("mailto") ? (
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors uppercase tracking-widest relative z-50"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors uppercase tracking-widest relative z-50"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            {/* Acesso Restrito — Link component for SPA navigation */}
            <li>
              <Link
                href="/admin"
                className="text-accent hover:text-white transition-colors uppercase tracking-widest relative z-50"
              >
                Acesso Restrito
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-sans font-black uppercase tracking-widest">Categorias</h3>
          <ul className="flex flex-col gap-3 text-xs font-sans font-bold text-slate-200 uppercase tracking-widest">
            {CATEGORIES.map(cat => (
              <li key={cat.href}>
                <Link href={cat.href} className="hover:text-accent transition-colors relative z-50">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-sans font-black uppercase tracking-widest">Newsletter</h3>
          <p className="text-xs font-sans font-medium text-slate-200">
            Assine nossa newsletter e receba notícias em primeira mão no seu e-mail.
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
              if (email) window.open(`mailto:contato@jornaldointerior.com.br?subject=Newsletter&body=Cadastro: ${email}`);
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Seu e-mail..."
              className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-xs font-sans focus:outline-none focus:border-accent transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-primary px-4 py-2 hover:bg-accent hover:text-white transition-colors cursor-pointer relative z-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </Container>

      <Container className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-sans font-bold text-slate-300">
        <p>© 2026 JORNAL DO INTERIOR. TODOS OS DIREITOS RESERVADOS.</p>
        <p>
          DESENVOLVIDO POR{" "}
          <a
            href="https://mickaaportifolio-xcsv.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-accent transition-colors relative z-50"
          >
            MICKA BANDEIRA
          </a>
        </p>
      </Container>
    </footer>
  );
}
