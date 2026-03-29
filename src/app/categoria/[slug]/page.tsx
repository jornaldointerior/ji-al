import { getNewsByCategory } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import Sidebar from "@/components/Sidebar/Sidebar";
import NewsCard from "@/components/ui/NewsCard";
import Headline from "@/components/ui/Headline";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Map slugs to display names
  const categoryMap: Record<string, string> = {
    "politica": "Política",
    "economia": "Economia",
    "cultura": "Cultura",
    "esportes": "Esportes",
    "policia": "Polícia",
    "eventos": "Eventos"
  };

  const displayName = categoryMap[params.slug];
  if (!displayName) {
    notFound();
  }

  const articles = getNewsByCategory(displayName);

  return (
    <main className="py-10 bg-white min-h-screen">
      <Container className="grid lg:grid-cols-3 gap-12">
        {/* News Feed Section */}
        <section className="lg:col-span-2">
          <header className="mb-12 border-b-4 border-primary pb-4 flex flex-col gap-2">
            <Headline as="h1" className="text-5xl md:text-7xl uppercase tracking-widest font-black leading-none text-primary">
              {displayName}
            </Headline>
            <p className="text-slate-400 font-sans text-xs uppercase tracking-[0.3em] font-medium">
              Arquivamento Editorial • Jornal do Interior
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {articles.map((news) => (
              <NewsCard
                key={news.id}
                {...news}
                variant="vertical"
                className="h-full border-0 p-0 shadow-none hover:shadow-xl transition-all"
              />
            ))}
          </div>
          
          {articles.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 italic text-slate-400">
              Nenhuma notícia encontrada nesta categoria no momento.
            </div>
          )}
        </section>

        {/* Persistent Sidebar */}
        <aside className="lg:col-span-1">
          <Sidebar />
        </aside>
      </Container>
    </main>
  );
}
