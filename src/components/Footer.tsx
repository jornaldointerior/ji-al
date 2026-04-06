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
    <footer className="bg-slate-950 pt-24 pb-12 text-white mt-auto border-t-[4px] border-accent">
      <Container className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">

        {/* About */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-black italic tracking-tighter leading-none uppercase">JORNAL DO INTERIOR.</h2>
            <p className="text-[11px] font-bold text-slate-400 leading-relaxed max-w-xs uppercase tracking-widest">
              Levando a verdade e os acontecimentos mais relevantes para o seu dia a dia desde 2024.
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" aria-label="Facebook" className="hover:text-accent transition-all hover:-translate-y-1"><Facebook size={20} strokeWidth={2.5} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-accent transition-all hover:-translate-y-1"><Instagram size={20} strokeWidth={2.5} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-accent transition-all hover:-translate-y-1"><Twitter size={20} strokeWidth={2.5} /></a>
          </div>
        </div>

        {/* Institutional */}
        <div className="flex flex-col gap-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Institucional</h3>
          <ul className="flex flex-col gap-4 text-[11px] font-black text-white">
            {INSTITUTIONAL.map(link => (
              <li key={link.href}>
                {link.href.startsWith("mailto") ? (
                  <a
                    href={link.href}
                    className="hover:text-accent transition-all uppercase tracking-widest relative z-50 inline-block hover:translate-x-1"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="hover:text-accent transition-all uppercase tracking-widest relative z-50 inline-block hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="text-accent hover:opacity-70 transition-all uppercase tracking-widest relative z-50 inline-block hover:translate-x-1"
              >
                Painel Administrativo
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Editorias</h3>
          <ul className="flex flex-col gap-4 text-[11px] font-black text-white uppercase tracking-widest">
            {CATEGORIES.map(cat => (
              <li key={cat.href}>
                <Link href={cat.href} className="hover:text-accent transition-all inline-block hover:translate-x-1">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Newsletter</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            Assine nossa newsletter e receba notícias em primeira mão no seu e-mail corporativo.
          </p>
          <form
            onSubmit={e => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
              if (email) window.open(`mailto:contato@jornaldointerior.com.br?subject=Newsletter&body=Cadastro: ${email}`);
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="SEU MELHOR E-MAIL..."
              className="bg-slate-900 border-[2px] border-slate-800 px-5 py-4 text-[11px] font-black tracking-widest focus:outline-none focus:border-accent transition-all placeholder:text-slate-700"
            />
            <button
              type="submit"
              className="bg-white text-slate-950 px-6 py-4 font-black uppercase tracking-[0.3em] text-[11px] hover:bg-accent hover:text-white transition-all cursor-pointer relative z-50 active:scale-[0.98]"
            >
              Inscrever-se AGORA
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
