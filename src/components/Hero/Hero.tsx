"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Container from "../ui/Container";
import Headline from "../ui/Headline";
import Link from "next/link";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [headline, setHeadline] = useState<any>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchHeroData() {
      // 1. Fetch Headline (Section 1)
      const { data: headlineData } = await supabase
        .from("articles")
        .select(`id, title, excerpt, slug`)
        .eq("home_section", "headline")
        .order("published_at", { ascending: false })
        .limit(1);

      let currentHeadline = null;

      if (headlineData && headlineData.length > 0) {
        currentHeadline = headlineData[0];
        setHeadline(currentHeadline);
      } else {
        // Fallback for headline
        const { data: fallbackHeadline } = await supabase
          .from("articles")
          .select(`id, title, excerpt, slug`)
          .order("published_at", { ascending: false })
          .limit(1);
        if (fallbackHeadline && fallbackHeadline.length > 0) {
          currentHeadline = fallbackHeadline[0];
          setHeadline(currentHeadline);
        }
      }

      // 2. Fetch Slideshow (Section 2)
      const { data: slidesData } = await supabase
        .from("articles")
        .select(`
          id, title, excerpt, image_url, published_at, slug,
          categories (name)
        `)
        .eq("home_section", "slideshow")
        .order("published_at", { ascending: false })
        .limit(3);

      if (slidesData && slidesData.length >= 3) {
        setSlides(slidesData);
      } else {
        // Fallback for slides: Fetch latest news and filter out headline manually
        const { data: fallbackSlides } = await supabase
          .from("articles")
          .select(`id, title, excerpt, image_url, published_at, slug, categories(name)`)
          .order("published_at", { ascending: false })
          .limit(10); // Fetch more to ensure we have enough after filtering
        
        if (fallbackSlides) {
          const filtered = fallbackSlides
            .filter(a => a.id !== currentHeadline?.id)
            .slice(0, 3);
          setSlides(filtered);
        }
      }
      
      setLoading(false);
    }

    fetchHeroData();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-slate-50 border-b border-primary/5">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  return (
    <section className="relative pt-6 md:pt-10 pb-12 md:pb-16 overflow-hidden border-b border-primary/5">
      <Container>
        <div className="flex flex-col gap-16 md:gap-24">
          
          {/* SECTION 1: MANCHETE PRINCIPAL (SÓ TEXTO) */}
          {headline && (
            <div className="relative w-full border-b-[3px] border-slate-950 pb-10 md:pb-16">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-8 block">Sessão 01 / Manchete de Capa</span>
               <Link href={`/noticia/${headline.slug}`} className="group cursor-pointer w-full block">
                <Headline 
                  variant="massive" 
                  className="group-hover:opacity-75 transition-all duration-500 italic text-[clamp(1.8rem,5vw,4.5rem)]"
                >
                  {headline.title}
                </Headline>
              </Link>
            </div>
          )}

          {/* SECTION 2: ÚLTIMAS NOTÍCIAS (SLIDE + LISTA) */}
          <div className="flex flex-col gap-12">
            <div className="flex items-center gap-5 border-b-2 border-slate-100 pb-6">
               <div className="w-3 h-3 bg-accent" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-950">Sessão 02 / Panorama Regional</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
              {/* SLIDESHOW AREA */}
              <div className="lg:col-span-8 relative w-full overflow-hidden bg-slate-50 group aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/10] border-[3px] border-slate-950 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.08)]">
                <AnimatePresence mode="wait">
                  {slides[currentSlide] && (
                    <motion.div
                      key={slides[currentSlide].id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className="relative w-full h-full cursor-pointer"
                    >
                      <Link href={`/noticia/${slides[currentSlide].slug}`} className="w-full h-full flex flex-col group">
                        <div className="relative flex-1 w-full overflow-hidden">
                          <Image
                            src={slides[currentSlide].image_url || "/placeholder-news.jpg"}
                            alt={slides[currentSlide].title}
                            fill
                            className="object-cover transition-transform duration-[6000ms] group-hover:scale-110"
                          />
                        </div>
                        {/* FOOTER CAPTION (SMALL TEXT) */}
                        <div className="bg-slate-950 p-8 md:p-10 flex flex-col gap-3">
                          <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.3em] block">
                             {slides[currentSlide].categories?.name}
                          </span>
                          <h4 className="text-2xl md:text-4xl font-black italic text-white tracking-tighter leading-[0.9] line-clamp-1">
                            {slides[currentSlide].title}
                          </h4>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Controls - Neo-Brutalist */}
                <div className="absolute bottom-32 right-10 flex gap-4 z-20">
                  <button 
                    onClick={(e) => { e.preventDefault(); setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length); }} 
                    className="w-14 h-14 bg-white border-[3px] border-slate-950 flex items-center justify-center hover:bg-slate-950 hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <ChevronLeft size={24} strokeWidth={3} />
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); setCurrentSlide(prev => (prev + 1) % slides.length); }} 
                    className="w-14 h-14 bg-white border-[3px] border-slate-950 flex items-center justify-center hover:bg-slate-950 hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <ChevronRight size={24} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* LIST SIDEBAR WITHIN SECTION 2 */}
              <div className="lg:col-span-4 flex flex-col gap-10 py-2">
                <div className="flex flex-col gap-4">
                  {slides.map((news, i) => (
                    <Link 
                      key={news.id} 
                      href={`/noticia/${news.slug}`}
                      className={`flex items-start gap-8 group border-b border-slate-100 pb-8 last:border-0 last:pb-0 transition-all duration-500 ${currentSlide === i ? 'pl-6 border-l-[3px] border-l-slate-950 bg-slate-50 py-6 -ml-6' : ''}`}
                      onMouseEnter={() => setCurrentSlide(i)}
                    >
                      <span className={`text-3xl font-black italic tracking-tighter ${currentSlide === i ? 'text-slate-950' : 'text-slate-200'} transition-colors`}>
                        {i + 1}
                      </span>
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 group-hover:text-accent mb-1 transition-colors">
                          {news.categories?.name}
                        </span>
                        <h4 className="text-xl font-black italic leading-[0.95] text-slate-800 group-hover:text-accent transition-all duration-300 line-clamp-2">
                          {news.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
