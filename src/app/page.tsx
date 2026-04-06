"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header/Header";
import BreakingNews from "@/components/Header/BreakingNews";
import Hero from "@/components/Hero/Hero";
import ColumnistSection from "@/components/Articles/ColumnistSection";
import MagazineSection from "@/components/NewsFeed/MagazineSection";
import Footer from "@/components/Footer";

const fadeIn = {
  initial: { opacity: 0.001, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <BreakingNews />
      
      <motion.main {...fadeIn} className="flex flex-col">
        {/* 1 & 2. HERO COMPONENT (Manchete + Slideshow) */}
        <Hero />
        
        {/* 3. NOSSOS COLUNISTAS */}
        <ColumnistSection />

        {/* 4. ALAGOAS */}
        <MagazineSection 
          sectionId="alagoas" 
          title="Alagoas" 
          accentColor="#1e40af" 
          categoryName="Alagoas" 
        />

        {/* 5. BRASIL */}
        <MagazineSection 
          sectionId="brasil" 
          title="Brasil" 
          accentColor="#047857" 
          categoryName="Brasil" 
        />

        {/* 6. MUNDO */}
        <MagazineSection 
          sectionId="mundo" 
          title="Mundo" 
          accentColor="#be123c" 
          categoryName="Mundo" 
        />

        {/* 7. ESPORTES */}
        <MagazineSection 
          sectionId="esportes" 
          title="Esportes" 
          accentColor="#b45309" 
          categoryName="Esportes" 
        />

        {/* 8. CULTURA E ENTRETENIMENTO */}
        <MagazineSection 
          sectionId="cultura" 
          title="Cultura" 
          accentColor="#9d174d" 
          categoryName="Cultura e Entretenimento" 
        />
      </motion.main>

      <Footer />
    </div>
  );
}
