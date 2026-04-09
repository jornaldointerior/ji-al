import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import Sidebar from "@/components/Sidebar/Sidebar";
import Headline from "@/components/ui/Headline";
import { ChevronLeft, Share2, Printer, Bookmark } from "lucide-react";

interface ArticleParams {
  slug: string;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';


export default async function ArticlePage({ params }: { params: Promise<ArticleParams> }) {
  const { slug } = await params;

  const { data: news, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories (name)
    `)
    .eq("slug", slug)
    .single();

  if (error || !news) {
    notFound();
  }

  // NOTE: In a static build environment, client-side interactions should handle increments if needed.
  // For build-time generation, we just fetch the content.

  return (
    <article className="py-10 bg-white min-h-screen">
      <Container className="grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Breadcrumb & Navigation */}
          <nav className="flex items-center justify-between border-b border-slate-100 pb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-sans font-black uppercase text-slate-400 hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} />
              Voltar para o Início
            </Link>

            <div className="flex items-center gap-4 text-slate-400">
              <button className="hover:text-primary transition-colors cursor-pointer"><Share2 size={18} /></button>
              <button className="hover:text-primary transition-colors cursor-pointer"><Bookmark size={18} /></button>
              <button className="hover:text-primary transition-colors cursor-pointer"><Printer size={18} /></button>
            </div>
          </nav>

          {/* Header Section */}
          <header className="flex flex-col gap-6">
            <div className="inline-block bg-primary text-white text-[10px] uppercase tracking-widest font-black px-3 py-1.5 font-sans w-fit shadow-lg">
              {news.categories?.name || "Geral"}
            </div>

            <Headline as="h1" className="text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-primary">
              {news.title}
            </Headline>

            <p className="text-xl md:text-2xl text-slate-500 font-serif leading-relaxed italic border-l-4 border-accent pl-6 py-2">
              {news.excerpt}
            </p>

            <div className="flex items-center gap-4 text-[11px] font-sans font-black uppercase text-slate-400 tracking-tighter">
              <span>Por Jornal do Interior</span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              <span>{new Date(news.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden shadow-2xl bg-slate-50">
            <Image
              src={news.image_url || "/placeholder-news.jpg"}
              alt={news.title}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Body Content */}
          <div className="prose prose-slate prose-lg max-w-none font-serif leading-relaxed text-slate-800 text-xl tracking-wide selection:bg-accent/30">
            <div dangerouslySetInnerHTML={{ __html: news.content }} />
          </div>

          {/* Footer Tags */}
          <footer className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
            {["Educação", "Nordeste", "Desenvolvimento", news.categories?.name].filter(Boolean).map(tag => (
              <span key={tag} className="px-4 py-2 bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest hover:bg-primary hover:text-white transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </footer>
        </div>

        {/* Sidebar Contextual */}
        <aside className="lg:col-span-1">
          <Sidebar />
        </aside>
      </Container>
    </article>
  );
}
