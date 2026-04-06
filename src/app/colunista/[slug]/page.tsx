import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Sidebar from "@/components/Sidebar/Sidebar";
import Headline from "@/components/ui/Headline";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ArrowRight, UserCircle, PenTool, Calendar, Eye } from "lucide-react";

interface ColumnistParams {
  slug: string;
}

export async function generateStaticParams() {
  try {
    const { data: columnists } = await supabase
      .from("columnists")
      .select("slug");

    const paths = (columnists || []).map((col) => ({
      slug: col.slug,
    }));

    if (paths.length === 0) {
      return [{ slug: 'placeholder-colunista' }];
    }

    return paths;
  } catch (e) {
    return [{ slug: 'placeholder-colunista' }];
  }
}

export default async function ColumnistArchivePage({ params }: { params: Promise<ColumnistParams> }) {
  const { slug } = await params;

  const { data: columnist, error: colError } = await supabase
    .from("columnists")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!columnist || colError) {
    notFound();
  }

  const { data: articles, error: artError } = await supabase
    .from("columnist_articles")
    .select("*")
    .eq("columnist_id", columnist.id)
    .order("published_at", { ascending: false });

  const articlesList = articles || [];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <Container className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 flex flex-col gap-16">
            {/* Nav */}
            <nav>
              <Link href="/colunistas" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-all">
                <ChevronLeft size={16} /> Voltar para Bancada
              </Link>
            </nav>

            {/* Author profile Header */}
            <header className="flex flex-col md:flex-row gap-10 items-center md:items-start bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-16 translate-x-16" />
               
               <div className="w-48 h-48 bg-white border-2 border-white shrink-0 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl">
                  {columnist.image_url ? (
                    <img src={columnist.image_url} alt={columnist.name} className="w-full h-full object-contain" />
                  ) : (
                    <UserCircle size={192} className="text-slate-100" />
                  )}
               </div>

               <div className="flex flex-col gap-6 text-center md:text-left flex-1 relative z-10">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2">Exclusivo: A Coluna de</span>
                     <Headline variant="primary" className="text-4xl md:text-5xl lg:text-6xl mb-0 italic tracking-tighter text-white">
                        {columnist.name}
                     </Headline>
                  </div>
                  <p className="text-lg text-white/70 font-serif leading-relaxed italic border-l-2 border-accent/30 pl-6 py-2">
                    {columnist.bio}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Total de Artigos</span>
                        <span className="text-2xl font-serif font-black italic">{articlesList.length}</span>
                     </div>
                     <div className="w-px h-8 bg-white/10" />
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1">Membro Desde</span>
                        <span className="text-2xl font-serif font-black italic">{new Date(columnist.created_at).getFullYear()}</span>
                     </div>
                  </div>
               </div>
            </header>

            {/* Articles List */}
            <div className="flex flex-col gap-12">
               <div className="flex items-center gap-4">
                  <PenTool size={18} className="text-accent" />
                  <Headline variant="primary" className="text-2xl mb-0 tracking-tighter italic">Contribuições_Recentes</Headline>
                  <div className="h-px bg-slate-100 flex-1" />
               </div>

               <div className="grid grid-cols-1 gap-12">
                  {articlesList.map((art) => (
                    <div 
                      key={art.id}
                      className="group flex flex-col gap-6 border-b border-slate-100 pb-12 last:border-0 transition-opacity duration-500"
                    >
                       <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                          <Calendar size={12} className="text-accent" />
                          <span>{new Date(art.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <Eye size={12} />
                          <span>{art.views_count} Leituras</span>
                       </div>

                       <Link href={`/artigo/${art.slug}`} className="flex flex-col gap-4">
                          <h3 className="text-3xl md:text-4xl font-serif font-black italic text-primary group-hover:text-accent transition-colors leading-tight">
                             "{art.title}"
                          </h3>
                          <p className="text-base text-slate-500 font-serif leading-relaxed line-clamp-2">
                             {art.content.substring(0, 180)}...
                          </p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-accent flex items-center gap-3 mt-2 group/link">
                             Continuar Lendo <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                          </span>
                       </Link>
                    </div>
                  ))}

                  {articlesList.length === 0 && (
                     <div className="py-20 text-center flex flex-col items-center gap-6 bg-slate-50 border-2 border-dashed border-slate-100">
                        <PenTool size={48} className="text-slate-200" />
                        <p className="text-lg font-serif italic text-slate-400">Aguardando as próximas reflexões do autor.</p>
                     </div>
                  )}
               </div>
            </div>
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
