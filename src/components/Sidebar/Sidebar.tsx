"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, ArrowRight, MapPin, Send, Loader2 } from "lucide-react";
import Headline from "../ui/Headline";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const WEATHER_CITIES = [
  { name: "Maceió", lat: -9.6498, lon: -35.7089 },
  { name: "Arapiraca", lat: -9.7516, lon: -36.6601 },
  { name: "Delmiro Gouveia", lat: -9.3894, lon: -37.9994 },
  { name: "Piranhas", lat: -9.6239, lon: -37.7558 },
  { name: "Palmeira dos Índios", lat: -9.4072, lon: -36.6311 },
  { name: "Santana do Ipanema", lat: -9.3783, lon: -37.2436 },
  { name: "Penedo", lat: -10.2897, lon: -36.5855 },
  { name: "União dos Palmares", lat: -9.1601, lon: -36.0315 },
  { name: "Marechal Deodoro", lat: -9.7107, lon: -35.8947 },
  { name: "Coruripe", lat: -10.1256, lon: -36.1756 }
];

export default function Sidebar() {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [mostRead, setMostRead] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  
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

    async function fetchWeather() {
      try {
        const results = await Promise.all(WEATHER_CITIES.map(async (city) => {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`);
          const data = await res.json();
          
          const code = data.current.weather_code;
          let status = "Limpo";
          if (code > 0 && code <= 3) status = "Nublado";
          else if (code >= 45 && code <= 48) status = "Nevoeiro";
          else if (code >= 51 && code <= 67) status = "Chuva";
          else if (code >= 71 && code <= 86) status = "Chuva";
          else if (code >= 95) status = "Tempestade";

          return {
            city: city.name,
            temp: Math.round(data.current.temperature_2m),
            status: status,
            humidity: data.current.relative_humidity_2m
          };
        }));
        setWeatherData(results);
      } catch (err) {
        console.error("Weather error:", err);
      } finally {
        setWeatherLoading(false);
      }
    }

    fetchSidebarData();
    fetchWeather();
  }, []);

  return (
    <aside className="w-full h-full flex flex-col gap-12">
      {/* Weather Widget */}
      <div className="bg-white p-6 border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
        <div className="flex justify-between items-center mb-6">
          <Headline variant="secondary" className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-600">
            Céu de Alagoas
          </Headline>
          <Cloud size={16} className="text-accent" />
        </div>
        
        {weatherLoading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            {weatherData.map((data) => (
              <div key={data.city} className="flex flex-col border-b border-dashed border-slate-100 pb-2 last:border-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[10px] font-sans font-black text-primary uppercase tracking-tighter truncate max-w-[100px]">
                    {data.city}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <span className="text-lg font-serif font-black text-primary">{data.temp}</span>
                    <span className="text-[10px] font-serif font-bold text-slate-400">°C</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[8px] uppercase font-black tracking-widest text-slate-400">
                  <span>{data.status}</span>
                  <span className="flex items-center gap-1"><MapPin size={8} className="text-accent" /> {data.humidity}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Poll Widget */}
      <div className="bg-white p-6 md:p-8 border border-slate-200 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
        <div className="flex items-center gap-3 mb-6">
          <Headline variant="accent" className="text-[10px] leading-none">
            Enquete
          </Headline>
          <div className="h-px bg-slate-100 flex-1" />
        </div>
        
        <p className="text-lg md:text-xl font-serif font-black text-primary mb-8 leading-[1.25] tracking-tight">
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
                    className="text-left w-full p-4 border border-slate-100 text-[10px] font-sans font-black uppercase tracking-widest text-slate-700 hover:border-accent hover:bg-slate-50 hover:text-primary transition-all flex justify-between items-center min-h-[54px] group/btn"
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
                <span className="text-3xl md:text-4xl font-serif font-black text-slate-200 group-hover:text-accent transition-colors leading-[0.7] pt-1">
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
      <div className="bg-slate-50 h-64 md:h-80 border border-slate-200 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:bg-slate-100 transition-colors">
        <div className="mb-4 px-3 py-1 bg-white border border-slate-200 text-[8px] uppercase tracking-[0.3em] font-black text-slate-300">Anúncio</div>
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-300 group-hover:text-slate-500 transition-colors">
          Espaço Reservado
        </span>
      </div>

      {/* Acesso Exclusivo Widget */}
      <div className="bg-primary p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-accent" />
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-1000" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Acesso Exclusivo</h4>
            <div className="h-px bg-white/10 flex-1" />
          </div>
          
          <p className="text-lg md:text-xl font-serif italic text-white/90 mb-8 leading-tight">
            Assine para receber furos e análises profundas.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="relative group/input">
              <input 
                type="email" 
                placeholder="SEU MELHOR E-MAIL" 
                className="w-full bg-white/5 border border-white/10 px-5 py-4 text-base md:text-[10px] uppercase tracking-widest focus:border-accent focus:bg-white/10 outline-none transition-all pr-12"
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
