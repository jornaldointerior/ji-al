import { MOCK_NEWS } from "@/lib/mock-data";
import Container from "../ui/Container";
import NewsCard from "../ui/NewsCard";

export default function Hero() {
  const mainNews = MOCK_NEWS[0];
  const secondaryNews = MOCK_NEWS.slice(1, 3);

  return (
    <section className="py-8 bg-white">
      <Container className="grid lg:grid-cols-12 gap-6">
        {/* Main large News */}
        <div className="lg:col-span-8">
          <NewsCard
            {...mainNews}
            className="h-full border-0 p-0 shadow-none hover:shadow-xl transition-shadow transition-transform hover:-translate-y-1"
          />
        </div>

        {/* Aside smaller News with 90/10 tension */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {secondaryNews.map((news) => (
            <NewsCard
              key={news.id}
              {...news}
              className="flex-1 border-0 border-b border-slate-100 p-0 pb-6 last:border-0 rounded-none shadow-none"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
