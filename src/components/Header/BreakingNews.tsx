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
    <div className="bg-slate-900 py-1.5 overflow-hidden border-y border-white/5 relative">
      <Container className="flex items-center gap-0">
        <div className="flex-shrink-0 bg-accent text-white px-3 py-1 font-sans font-black text-[9px] uppercase tracking-wider relative z-10 shadow-[4px_0_15px_rgba(0,0,0,0.3)]">
          Urgente
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          {/* Gradient masks for smooth fading */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10" />
          
          <motion.div
            animate={{ x: ["5%", "-100%"] }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-20 whitespace-nowrap py-1"
          >
            {BREAKING_NEWS.map((news, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                <span className="text-slate-200 text-[11px] font-bold font-sans tracking-wide uppercase">
                  {news}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
