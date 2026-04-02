import Image from "next/image";
import { MOCK_NEWS } from "@/lib/mock-data";
import Container from "../ui/Container";
import Headline from "../ui/Headline";
import Link from "next/link";

export default function Hero() {
  const mainNews = MOCK_NEWS[0];
  const sideNews = MOCK_NEWS.slice(1, 4);

  return (
    <section className="relative pt-10 pb-16 overflow-hidden border-b border-primary/5">
      <Container>
        <div className="flex flex-col gap-20">
          {/* Typographic Header Section - Optimized for impact and accessibility */}
          <div className="relative w-full reveal-up">
            <Link href={mainNews.href} className="group cursor-pointer w-full block">
              <Headline 
                variant="massive" 
                className="stagger-2 group-hover:text-accent transition-colors duration-500 text-[clamp(2.5rem,8vw,10rem)] leading-[0.95] w-full text-left tracking-tight break-words h-auto"
              >
                {mainNews.title}
              </Headline>
            </Link>
          </div>

          {/* Asymmetric Visual & News Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Main Visual - Now Expanded to col-span-8 */}
            <div className="lg:col-span-8 relative h-[300px] md:h-[540px] w-full reveal-up stagger-3">
              <div className="absolute -inset-4 bg-slate-50/50 -z-10 translate-x-4 translate-y-4 border border-primary/5 hidden md:block" />
              <div className="h-full w-full overflow-hidden border border-primary/10">
                <Image
                  src={mainNews.image}
                  alt={mainNews.title}
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  priority
                />
              </div>
              <p className="mt-6 md:mt-8 text-lg md:text-xl font-serif italic text-slate-600 leading-relaxed max-w-2xl">
                {mainNews.excerpt}
              </p>
            </div>

            {/* Side Fragments - Now col-span-4, styled as Sidebar Widgets */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              {/* News List Widget */}
              <div className="bg-white p-6 md:p-8 border border-slate-200 shadow-sm reveal-up stagger-3">
                <div className="flex flex-col gap-8">
                  {sideNews.map((news, i) => (
                    <Link 
                      key={news.id} 
                      href={news.href}
                      className="flex flex-col gap-2 group border-b border-slate-50 pb-6 last:border-0 last:pb-0"
                    >
                      <span className="text-[9px] uppercase font-black tracking-widest text-accent mb-1">
                        0{i + 1} / {news.category}
                      </span>
                      <h4 className="text-lg font-serif font-black leading-tight group-hover:text-accent transition-colors duration-300">
                        {news.title}
                      </h4>
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
