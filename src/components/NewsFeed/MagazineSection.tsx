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
          <div className="flex items-end justify-between border-b-4 border-slate-900 pb-6">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Editoria JI</span>
              <Headline variant="primary" className="text-5xl md:text-7xl tracking-tighter mb-0">
                {title}<span style={{ color: accentColor }}>_</span>
              </Headline>
            </div>
            <Link 
              href={`/categoria/${categoryName.toLowerCase().replace(/ /g, "-")}`}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-accent transition-colors group mb-2"
            >
              Arquivo Completo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid Layout (Matching Alagoas Example) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Main Story (Left/Large) */}
            <div className="md:col-span-7 flex flex-col gap-6 group">
              <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                <Image
                  src={main.image_url || "/placeholder-news.jpg"}
                  alt={main.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 bg-white border-2 border-slate-900 px-4 py-2">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">{categoryName}</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Link href={`/noticia/${main.slug}`}>
                  <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter leading-tight group-hover:text-accent transition-colors line-clamp-2">
                    {main.title}
                  </h3>
                </Link>
                <p className="text-sm md:text-base text-slate-600 font-serif leading-relaxed max-w-xl line-clamp-2">
                  {main.excerpt}
                </p>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  {new Date(main.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}.
                </span>
              </div>
            </div>

            {/* Side Stories (Right/Stack) */}
            <div className="md:col-span-5 flex flex-col gap-10">
              {others.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-5 gap-6 group border-b border-slate-50 pb-10 last:border-0 last:pb-0">
                  <div className="sm:col-span-2 relative aspect-video sm:aspect-square border border-slate-200">
                    <Image
                      src={item.image_url || "/placeholder-news.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white border border-slate-900 px-2 py-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">{categoryName}</span>
                    </div>
                  </div>
                  <div className="sm:col-span-3 flex flex-col gap-3 justify-center">
                    <Link href={`/noticia/${item.slug}`}>
                      <h4 className="text-xl font-black italic tracking-tighter leading-tight group-hover:text-accent transition-colors overflow-hidden text-ellipsis line-clamp-2">
                        {item.title}...
                      </h4>
                    </Link>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {new Date(item.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}.
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
