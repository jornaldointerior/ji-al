"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, ArrowRight, Star, Wind, Droplets, MapPin } from "lucide-react";
import Headline from "../ui/Headline";
import { MOCK_NEWS } from "@/lib/mock-data";
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
  
  const mostRead = MOCK_NEWS.slice(1, 8); // Skip Hero for 'Most Read'

  const pollOptions = [
    { id: 1, text: "Sim, é necessário mais fiscalização.", percent: 68 },
    { id: 2, text: "Não, prejudica os pequenos produtores.", percent: 24 },
    { id: 3, text: "Não tenho uma opinião formada.", percent: 8 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % WEATHER_LOCATIONS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const cityData = WEATHER_LOCATIONS[currentCityIndex];

  return (
    <aside className="w-full h-full flex flex-col gap-10">
      {/* Weather Widget */}
      <div className="bg-slate-50 p-6 border border-slate-100 group">
        <div className="flex justify-between items-start mb-4">
          <Headline variant="secondary" className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
            Céu do Sertão
          </Headline>
          <div className="flex items-center gap-1 text-[9px] font-sans font-black text-accent uppercase">
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
            className="flex items-center justify-between"
          >
            <div>
              <div className="text-4xl font-sans font-black text-primary flex items-start">
                {cityData.temp}<span className="text-lg mt-1">°C</span>
              </div>
              <div className="text-[11px] text-accent font-sans font-black uppercase tracking-wider">
                {cityData.status}
              </div>
            </div>
            <motion.div 
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {cityData.temp > 32 ? (
                <Sun className="text-accent" size={52} strokeWidth={1.5} />
              ) : (
                <Cloud className="text-primary" size={52} strokeWidth={1.5} />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-6 pt-4 border-t border-slate-200/50 flex justify-between text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <Droplets size={12} className="text-primary/40" />
            <span>Umidade: {cityData.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind size={12} className="text-primary/40" />
            <span>Vento: {cityData.wind} km/h</span>
          </div>
        </div>
      </div>

      {/* Poll Widget */}
      <div className="bg-white p-6 border border-slate-200 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4 bg-primary px-3 py-1 w-fit shadow-md">
          <Star size={10} className="text-white fill-white" />
          <Headline variant="primary" className="text-[10px] uppercase tracking-widest text-white leading-none">
            Enquete do Dia
          </Headline>
        </div>
        
        <p className="text-base font-sans font-extrabold text-primary mb-6 leading-[1.3] tracking-tight">
          Você concorda com as novas diretrizes de fiscalização agrícola no interior?
        </p>
        
        <div className="flex flex-col gap-3">
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
                    className="text-left w-full p-4 border border-slate-100 text-[11px] font-sans font-black uppercase tracking-widest text-slate-500 hover:border-accent hover:bg-slate-50 hover:text-primary transition-all flex justify-between items-center group/btn"
                  >
                    {opt.text}
                    <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="poll-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 py-2"
              >
                {pollOptions.map((opt) => (
                  <div key={opt.id} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-sans font-black uppercase tracking-widest text-primary">
                      <span className={cn(selectedOption === opt.id && "text-accent")}>
                        {opt.text} {selectedOption === opt.id && "(SEU VOTO)"}
                      </span>
                      <span>{opt.percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${opt.percent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full", selectedOption === opt.id ? "bg-accent" : "bg-primary")}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-[10px] text-slate-300 font-sans font-bold uppercase text-center italic">
                  Obrigado pela sua participação!
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Most Read List */}
      <div className="flex flex-col gap-6">
        <Headline variant="primary" className="text-base flex items-center gap-2 mb-2 border-l-4 border-accent pl-3 uppercase tracking-[0.2em] font-black leading-none">
          Mais <span className="text-accent underline decoration-primary decoration-4 underline-offset-4 decoration-skip-ink-none">Lidas</span>
        </Headline>
        
        <div className="flex flex-col divide-y divide-slate-100">
          {mostRead.map((news, index) => (
            <Link key={news.id} href={news.href} className="group py-5 first:pt-0 last:pb-0 flex gap-4 items-start">
              <span className="text-5xl font-sans font-black text-slate-100/80 group-hover:text-accent/20 transition-colors leading-[0.8] min-w-[3.5rem] tracking-tighter">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-1.5 flex-1 pt-1">
                <span className="text-[9px] uppercase font-black text-accent font-sans tracking-[0.2em]">{news.category}</span>
                <p className="text-xs font-sans font-extrabold leading-snug text-primary group-hover:text-accent transition-colors line-clamp-2 uppercase tracking-tight">
                  {news.title}
                </p>
                <span className="text-[10px] text-slate-400 font-sans font-medium uppercase">{news.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Static Ad Space */}
      <div className="bg-slate-100 h-64 border border-dashed border-slate-300 flex items-center justify-center p-6 text-center group cursor-pointer hover:bg-slate-200 transition-colors">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-300 group-hover:text-slate-500 transition-colors">
          Espaço Publicitário
        </span>
      </div>
    </aside>
  );
}
