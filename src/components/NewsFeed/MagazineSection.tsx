import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Container from "../ui/Container";
import Headline from "../ui/Headline";
import { ArrowRight } from "lucide-react";

interface MagazineSectionProps {
  sectionId: string;
  title: string;
  accentColor?: string;
  categoryName: string;
}

export default function MagazineSection({ sectionId, title, accentColor = "#ff4d4d", categoryName }: MagazineSectionProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSectionNews() {
      const { data, error } = await supabase
        .from("articles")
        .select(`id, title, excerpt, image_url, published_at, slug`)
        .eq("home_section", sectionId)
        .order("published_at", { ascending: false })
        .limit(3);

      if (data && data.length > 0) {
        setArticles(data);
      } else {
        // Fallback to category name if nothing pinned to section
        const { data: catData } = await supabase
          .from("categories")
          .select("id")
          .eq("name", categoryName)
          .single();
        
        if (catData) {
          const { data: categoryArticles } = await supabase
            .from("articles")
            .select(`id, title, excerpt, image_url, published_at, slug`)
            .eq("category_id", catData.id)
            .order("published_at", { ascending: false })
            .limit(3);
          if (categoryArticles) setArticles(categoryArticles);
        }
      }
      setLoading(false);
    }

    fetchSectionNews();
  }, [sectionId, categoryName]);

  if (loading || articles.length === 0) return null;

  const [main, ...others] = articles;

  return (
    <section className="py-16 border-b border-slate-100 last:border-0">
      <Container>
        <div className="flex flex-col gap-10">
          {/* Header */}
          <div className="flex items-end justify-between border-b-4 border-slate-950 pb-8">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400">Editoria JI</span>
              <Headline variant="massive" className="text-6xl md:text-8xl tracking-tighter mb-0 italic">
                {title}<span style={{ color: accentColor }}>.</span>
              </Headline>
            </div>
            <Link 
              href={`/categoria/${categoryName.toLowerCase().replace(/ /g, "-")}`}
              className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:opacity-70 transition-all group mb-3"
            >
              Consultar Arquivo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid Layout (Matching Alagoas Example) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Main Story (Left/Large) */}
            <div className="md:col-span-7 flex flex-col gap-8 group">
              <div className="relative aspect-[4/3] md:aspect-[16/10] w-full overflow-hidden border-[3px] border-slate-950 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.08)]">
                <Image
                  src={main.image_url || "/placeholder-news.jpg"}
                  alt={main.title}
                  fill
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 bg-slate-950 px-5 py-3">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{categoryName}</span>
                </div>
              </div>
              <div className="flex flex-col gap-5 pr-4">
                <Link href={`/noticia/${main.slug}`}>
                  <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-[0.9] group-hover:opacity-70 transition-all line-clamp-3">
                    {main.title}
                  </h3>
                </Link>
                <p className="text-base md:text-lg text-slate-600 font-serif leading-relaxed max-w-2xl line-clamp-3">
                  {main.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-8 bg-slate-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    {new Date(main.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Side Stories (Right/Stack) */}
            <div className="md:col-span-5 flex flex-col gap-12 md:gap-14 pt-4">
              {others.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-8 group border-b border-slate-100 pb-12 last:border-0 last:pb-0">
                  <div className="sm:col-span-5 relative aspect-video sm:aspect-square border-[2px] border-slate-950 overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]">
                    <Image
                      src={item.image_url || "/placeholder-news.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="sm:col-span-7 flex flex-col gap-4 justify-center">
                    <Link href={`/noticia/${item.slug}`}>
                      <h4 className="text-2xl font-black italic tracking-tighter leading-[0.95] group-hover:opacity-60 transition-all overflow-hidden text-ellipsis line-clamp-3">
                        {item.title}
                      </h4>
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                      {new Date(item.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
