"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, ArrowRight, MapPin, Send, Loader2 } from "lucide-react";
import Headline from "../ui/Headline";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const WEATHER_LOCATIONS = [
  { city: "Sertânia", temp: 32, status: "Ensolarado", humidity: 34, wind: 12 },
  { city: "Serra Talhada", temp: 35, status: "Céu Limpo", humidity: 28, wind: 15 },
  { city: "Petrolina", temp: 34, status: "Poucas Nuvens", humidity: 30, wind: 10 },
  { city: "Afogados da Ingazeira", temp: 31, status: "Parcialmente Nublado", humidity: 40, wind: 8 },
];

export default function Sidebar() {
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mostRead, setMostRead] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const pollOptions = [
    { id: 1, text: "Sim, é necessário mais fiscalização.", percent: 68 },
    { id: 2, text: "Não, prejudica os pequenos produtores.", percent: 24 },
    { id: 3, text: "Não tenho uma opinião formada.", percent: 8 }
  ];

  useEffect(() => {
    async function fetchSidebarData() {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          published_at,
          slug,
          categories (name)
        `)
        .order("views_count", { ascending: false })
        .limit(7);

      if (data && !error) {
        setMostRead(data);
      }
      setLoading(false);
    }

    fetchSidebarData();

    const timer = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % WEATHER_LOCATIONS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const cityData = WEATHER_LOCATIONS[currentCityIndex];

  return (
    <aside className="w-full h-full flex flex-col gap-12">
      {/* Weather Widget */}
      <div className="bg-white p-6 border border-slate-200 group relative">
        <div className="flex justify-between items-start mb-6">
          <Headline variant="secondary" className="text-[9px] uppercase tracking-[0.4em] font-black text-slate-600">
            Céu do Sertão
          </Headline>
          <div className="flex items-center gap-1.5 text-[9px] font-sans font-black text-accent uppercase tracking-widest">
            <MapPin size={10} />
            {cityData.city}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={cityData.city}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-baseline justify-between"
          >
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-serif font-black text-primary leading-none tracking-tighter">
                {cityData.temp}
              </span>
              <span className="text-xl font-serif font-bold text-slate-400">°C</span>
            </div>
            <motion.div 
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-accent"
            >
              {cityData.temp > 32 ? (
                <Sun size={48} strokeWidth={1.5} />
              ) : (
                <Cloud size={48} strokeWidth={1.5} />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-2 mb-6">
          <span className="text-[11px] text-primary font-serif font-bold italic lowercase tracking-wide">
            {cityData.status}
          </span>
        </div>
        
        <div className="pt-5 border-t border-slate-100 flex justify-between text-[9px] text-slate-600 font-sans font-black uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span>Umidade {cityData.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Vento {cityData.wind}kmh</span>
          </div>
        </div>
      </div>

      {/* Poll Widget */}
      <div className="bg-white p-8 border border-slate-200 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
        <div className="flex items-center gap-3 mb-6">
          <Headline variant="accent" className="text-[10px] leading-none">
            Enquete
          </Headline>
          <div className="h-px bg-slate-100 flex-1" />
        </div>
        
        <p className="text-xl font-serif font-black text-primary mb-8 leading-[1.25] tracking-tight">
          Você concorda com as novas diretrizes de fiscalização agrícola no interior?
        </p>
        
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="wait">
            {!hasVoted ? (
              <motion.div 
                key="poll-options"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {pollOptions.map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => {
                      setSelectedOption(opt.id);
                      setHasVoted(true);
                    }}
                    className="text-left w-full p-4 border border-slate-100 text-[10px] font-sans font-black uppercase tracking-widest text-slate-700 hover:border-accent hover:bg-slate-50 hover:text-primary transition-all flex justify-between items-center group/btn"
                  >
                    {opt.text}
                    <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all text-accent" />
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="poll-results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {pollOptions.map((opt) => (
                  <div key={opt.id} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-sans font-black uppercase tracking-widest text-primary">
                      <span className={cn(selectedOption === opt.id && "text-accent")}>
                        {opt.text}
                      </span>
                      <span>{opt.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-none overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${opt.percent}%` }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className={cn("h-full", selectedOption === opt.id ? "bg-accent" : "bg-primary")}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 text-[9px] text-slate-500 font-sans font-black uppercase tracking-[0.3em] text-center italic">
                  Voto computado. Obrigado!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Most Read List */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-2">
          <Headline variant="primary" className="text-lg leading-none italic">
            Mais Lidas
          </Headline>
          <div className="h-0.5 bg-primary flex-1" />
        </div>
        
        {loading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-100">
            {mostRead.map((news, index) => (
              <Link key={news.id} href={`/noticia/${news.slug}`} className="group py-6 first:pt-0 last:pb-0 flex gap-6 items-start">
                <span className="text-4xl font-serif font-black text-slate-200 group-hover:text-accent transition-colors leading-[0.7] pt-1">
                  {String(index + 1)}
                </span>
                <div className="flex flex-col gap-2 flex-1">
                  <span className="text-[8px] uppercase font-black text-accent font-sans tracking-[0.3em]">{news.categories?.name}</span>
                  <p className="text-sm font-serif font-black leading-snug text-primary group-hover:text-accent transition-colors line-clamp-2 uppercase- tracking-tight">
                    {news.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-[9px] text-slate-400 font-sans font-black uppercase tracking-widest">
                      {new Date(news.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Static Ad Space */}
      <div className="bg-slate-50 h-80 border border-slate-200 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:bg-slate-100 transition-colors">
        <div className="mb-4 px-3 py-1 bg-white border border-slate-200 text-[8px] uppercase tracking-[0.3em] font-black text-slate-300">Anúncio</div>
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-300 group-hover:text-slate-500 transition-colors">
          Espaço Reservado
        </span>
      </div>

      {/* Acesso Exclusivo Widget */}
      <div className="bg-primary p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-accent" />
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-1000" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Acesso Exclusivo</h4>
            <div className="h-px bg-white/10 flex-1" />
          </div>
          
          <p className="text-xl font-serif italic text-white/90 mb-8 leading-tight">
            Assine para receber furos e análises profundas.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="relative group/input">
              <input 
                type="email" 
                placeholder="SEU MELHOR E-MAIL" 
                className="w-full bg-white/5 border border-white/10 px-5 py-4 text-[10px] uppercase tracking-widest focus:border-accent focus:bg-white/10 outline-none transition-all pr-12"
              />
              <Send size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/input:text-accent transition-colors" />
            </div>
            
            <button className="bg-accent text-white py-5 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-white hover:text-primary transition-all duration-500 shadow-xl flex items-center justify-center gap-3">
              Inscrever Agora
              <ArrowRight size={14} />
            </button>
          </div>
          
          <p className="mt-6 text-[9px] text-white/40 font-sans tracking-widest uppercase text-center">
            Privacidade garantida. Sem spam.
          </p>
        </div>
      </div>
    </aside>
  );
}
