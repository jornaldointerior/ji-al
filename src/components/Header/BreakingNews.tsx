"use client";

import { motion } from "framer-motion";
import Container from "../ui/Container";

const BREAKING_NEWS = [
  "Câmara Municipal de Serrita aprova novas medidas para o setor agrícola.",
  "Acidente na BR-232 causa lentidão no trânsito próximo a Serra Talhada.",
  "Festival Viva o Interior confirma atrações nacionais para o próximo mês.",
  "Abertura de novos cursos técnicos traz esperança de qualificação em Salgueiro.",
];

export default function BreakingNews() {
  return (
    <div className="bg-white border-b border-slate-200 py-2.5 overflow-hidden relative">
      <Container className="flex items-center gap-6">
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-accent font-sans font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
            Urgente
          </span>
        </div>
        
        <div className="h-4 w-px bg-slate-200 flex-shrink-0" />
        
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-16 whitespace-nowrap items-center"
          >
            {[...BREAKING_NEWS, ...BREAKING_NEWS].map((news, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <span className="text-primary text-[11px] font-bold font-sans tracking-wide uppercase group-hover:text-accent transition-colors">
                  {news}
                </span>
                <span className="text-slate-500 font-serif italic text-lg">/</span>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
