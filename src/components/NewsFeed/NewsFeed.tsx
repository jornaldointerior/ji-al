import { MOCK_NEWS } from "@/lib/mock-data";
import Link from "next/link";
import Container from "../ui/Container";
import NewsCard from "../ui/NewsCard";
import Headline from "../ui/Headline";

export default function NewsFeed() {
  const categories = ["Política", "Economia", "Cultura", "Esportes"];

  return (
    <section className="py-12 bg-white">
      <Container className="flex flex-col gap-16">
        {categories.map((cat) => (
          <div key={cat} className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b-2 border-primary pb-2">
              <Headline variant="primary" className="text-2xl uppercase tracking-tighter">
                {cat}
              </Headline>
              <Link 
                href={`/categoria/${cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}
                className="text-[10px] font-sans font-black uppercase text-accent tracking-widest hover:text-primary transition-colors"
              >
                Ver Tudo +
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_NEWS.filter(n => n.category === cat).map((news) => (
                <NewsCard
                  key={news.id}
                  {...news}
                  className="h-full border-0 p-0 shadow-none hover:shadow-xl transition-shadow transition-transform hover:-translate-y-1"
                />
              ))}
            </div>
          </div>
        ))}

        {/* Inter-section Ad */}
        <div className="w-full bg-slate-50 border border-slate-100 py-10 flex items-center justify-center">
          <span className="text-[10px] tracking-[0.4em] uppercase font-black text-slate-300">
            Publicidade Institucional
          </span>
        </div>
      </Container>
    </section>
  );
}
