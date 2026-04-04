"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Container from "../ui/Container";

export default function BreakingNews() {
  const [headlines, setHeadlines] = useState<{title: string, slug: string}[]>([]);

  useEffect(() => {
    async function fetchHeadlines() {
      const { data, error } = await supabase
        .from("articles")
        .select("title, slug")
        .order("published_at", { ascending: false })
        .limit(10);

      if (data && !error) {
        setHeadlines(data.map(h => ({ title: h.title, slug: h.slug })));
      }
    }

    fetchHeadlines();
  }, []);

  if (headlines.length === 0) return null;

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
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-16 whitespace-nowrap items-center"
          >
            {[...headlines, ...headlines].map((news, i) => (
              <Link 
                key={i} 
                href={`/noticia/${news.slug}`}
                className="flex items-center gap-4 group cursor-pointer text-primary"
              >
                <span className="text-[11px] font-bold font-sans tracking-wide uppercase group-hover:text-accent transition-colors">
                  {news.title}
                </span>
                <span className="text-slate-200 font-serif italic text-lg">/</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
