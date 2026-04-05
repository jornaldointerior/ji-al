"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Headline from "@/components/ui/Headline";
import Sidebar from "@/components/Sidebar/Sidebar";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import BreakingNews from "@/components/Header/BreakingNews";
import { UserCircle, ArrowRight, Loader2, PenTool } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ColumnistsListPage() {
  const [columnists, setColumnists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchColumnists() {
      const { data } = await supabase
        .from('columnists')
        .select('*')
        .order('name', { ascending: true });
      if (data) setColumnists(data);
      setLoading(false);
    }
    fetchColumnists();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <BreakingNews />

      <main className="flex-1 py-12 md:py-20">
        <Container className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 flex flex-col gap-16">
            <header className="flex flex-col gap-4 border-b-2 border-slate-900 pb-12">
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-accent">Editorial & Opinião</span>
               <Headline variant="primary" className="text-5xl md:text-7xl mb-0 tracking-tighter italic">Nossa_Bancada</Headline>
               <p className="font-serif italic text-slate-500 text-xl max-w-2xl leading-relaxed">
                 Pensadores, jornalistas e especialistas que trazem a análise profunda dos fatos que moldam o interior de Alagoas.
               </p>
            </header>

            {loading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-accent" size={40} /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                {columnists.map((col, index) => (
                  <motion.div 
                    key={col.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col gap-8"
                  >
                    <div className="aspect-square bg-slate-50 border-2 border-slate-900 relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      {col.image_url ? (
                        <img src={col.image_url} alt={col.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle size={200} className="text-slate-100 absolute -bottom-10 -right-10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                        <Link href={`/colunista/${col.slug}`} className="bg-accent text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                          Ver Artigos <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <PenTool size={14} className="text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">Membro Titular</span>
                      </div>
                      <h3 className="text-3xl font-serif font-black italic text-primary leading-tight group-hover:text-accent transition-colors">
                        {col.name}
                      </h3>
                      <p className="text-base text-slate-500 font-serif leading-relaxed line-clamp-4">
                        {col.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <Sidebar />
          </aside>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
