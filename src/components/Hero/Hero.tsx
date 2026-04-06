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
            <div className="relative w-full border-b-2 border-slate-900 pb-12">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-6 block">Sessão 01 / Manchete Principal</span>
               <Link href={`/noticia/${headline.slug}`} className="group cursor-pointer w-full block">
                <Headline 
                  variant="massive" 
                  className="group-hover:text-accent transition-colors duration-500 text-[clamp(2.5rem,11vw,12rem)] font-black leading-[0.88] w-full text-left tracking-tighter"
                >
                  {headline.title}
                </Headline>
              </Link>
            </div>
          )}

          {/* SECTION 2: ÚLTIMAS NOTÍCIAS (SLIDE + LISTA) */}
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
               <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-800">Sessão 02 / Últimas Notícias</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* SLIDESHOW AREA */}
              <div className="lg:col-span-8 relative w-full overflow-hidden bg-slate-50 group aspect-[4/3] md:aspect-[3/2] lg:aspect-[16/10] rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <AnimatePresence mode="wait">
                  {slides[currentSlide] && (
                    <motion.div
                      key={slides[currentSlide].id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="relative w-full h-full cursor-pointer"
                    >
                      <Link href={`/noticia/${slides[currentSlide].slug}`} className="w-full h-full flex flex-col group">
                        <div className="relative flex-1 w-full overflow-hidden">
                          <Image
                            src={slides[currentSlide].image_url || "/placeholder-news.jpg"}
                            alt={slides[currentSlide].title}
                            fill
                            className="object-cover transition-transform duration-[4000ms] group-hover:scale-105"
                          />
                        </div>
                        {/* FOOTER CAPTION (SMALL TEXT) */}
                        <div className="bg-white p-6 md:p-8 flex flex-col gap-2">
                          <span className="text-[9px] text-accent font-black uppercase tracking-[0.2em] block">
                             {slides[currentSlide].categories?.name}
                          </span>
                          <h4 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight line-clamp-1">
                            {slides[currentSlide].title}
                          </h4>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Controls - Modern UI */}
                <div className="absolute bottom-24 right-8 flex gap-3 z-20">
                  <button 
                    onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)} 
                    className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-lg border border-slate-100"
                  >
                    <ChevronLeft size={18} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)} 
                    className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all shadow-lg border border-slate-100"
                  >
                    <ChevronRight size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* LIST SIDEBAR WITHIN SECTION 2 */}
              <div className="lg:col-span-4 flex flex-col gap-8 py-2">
                <div className="flex flex-col gap-6">
                  {slides.map((news, i) => (
                    <Link 
                      key={news.id} 
                      href={`/noticia/${news.slug}`}
                      className={`flex items-start gap-6 group border-b border-slate-50 pb-6 last:border-0 last:pb-0 transition-all duration-300 ${currentSlide === i ? 'pl-4 border-l-2 border-l-accent bg-slate-50/50 py-4 -ml-4 rounded-r-xl' : ''}`}
                      onMouseEnter={() => setCurrentSlide(i)}
                    >
                      <span className={`text-2xl font-black italic tracking-tighter ${currentSlide === i ? 'text-accent' : 'text-slate-200'} transition-colors`}>
                        0{i + 1}
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-400 group-hover:text-accent mb-1 transition-colors">
                          {news.categories?.name}
                        </span>
                        <h4 className="text-lg font-bold leading-snug text-slate-800 group-hover:text-accent transition-colors duration-300">
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
