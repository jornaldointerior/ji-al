import Image from "next/image";
import { MOCK_NEWS } from "@/lib/mock-data";
import Container from "../ui/Container";
import Headline from "../ui/Headline";
import Link from "next/link";

export default function Hero() {
  const mainNews = MOCK_NEWS[0];
  const sideNews = MOCK_NEWS.slice(1, 4);

  return (
    <section className="relative pt-20 pb-16 overflow-hidden border-b border-primary/5">
      <Container>
        <div className="flex flex-col gap-20">
          {/* Typographic Header Section - Optimized for Absolute Edge-to-Edge 2-line impact */}
          <div className="relative z-10 w-full reveal-up">
            <Link href={mainNews.href} className="group cursor-pointer w-full block">
              <Headline variant="massive" className="stagger-2 group-hover:text-accent transition-colors duration-500 !leading-[0.9] text-[clamp(3rem,7.4vw,11rem)] !text-wrap-none w-full text-left tracking-tight">
                {mainNews.title}
              </Headline>
            </Link>
          </div>

          {/* Asymmetric Visual & News Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Main Visual - Now Expanded to col-span-8 */}
            <div className="lg:col-span-8 relative h-[540px] w-full reveal-up stagger-3">
              <div className="absolute -inset-4 bg-slate-50/50 -z-10 translate-x-4 translate-y-4 border border-primary/5" />
              <div className="h-full w-full overflow-hidden border border-primary/10">
                <Image
                  src={mainNews.image}
                  alt={mainNews.title}
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                  priority
                />
              </div>
              <p className="mt-8 text-xl font-serif italic text-slate-600 leading-relaxed max-w-2xl">
                {mainNews.excerpt}
              </p>
            </div>

            {/* Side Fragments - Now col-span-4, styled as Sidebar Widgets */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              {/* Frutos da Edição Widget */}
              <div className="bg-white p-8 border border-slate-200 shadow-sm reveal-up stagger-3">
                <div className="flex items-center gap-3 mb-8">
                   <Headline variant="secondary" className="text-[10px] leading-none opacity-50">
                     Frutos da Edição
                   </Headline>
                   <div className="h-px bg-slate-100 flex-1" />
                </div>
                
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

              {/* Acesso Exclusivo Widget */}
              <div className="bg-primary p-8 text-white shadow-xl reveal-up">
                <div className="flex items-center gap-3 mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Acesso Exclusivo</h4>
                  <div className="h-px bg-white/10 flex-1" />
                </div>
                <p className="text-sm font-serif italic text-white/60 mb-6">Assine para receber furos e análises profundas diretamente.</p>
                <div className="flex flex-col gap-3">
                  <input 
                    type="email" 
                    placeholder="SEU MELHOR E-MAIL" 
                    className="bg-white/5 border border-white/10 px-4 py-3 text-[10px] uppercase tracking-widest focus:border-white focus:bg-white/10 outline-none transition-all"
                  />
                  <button className="bg-accent text-white py-4 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-white hover:text-primary transition-all duration-500 shadow-lg">
                    Inscrever Agora +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
