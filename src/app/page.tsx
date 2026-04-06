"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header/Header";
import BreakingNews from "@/components/Header/BreakingNews";
import Hero from "@/components/Hero/Hero";
import ColumnistSection from "@/components/Articles/ColumnistSection";
import Sidebar from "@/components/Sidebar/Sidebar";
import NewsFeed from "@/components/NewsFeed/NewsFeed";
import Footer from "@/components/Footer";
import Container from "@/components/ui/Container";

const fadeIn = {
  initial: { opacity: 0.01, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <BreakingNews />
      
      <motion.main {...fadeIn}>
        <Hero />
        
        <ColumnistSection />

        <Container className="grid lg:grid-cols-12 gap-12 py-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <NewsFeed />
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </Container>
      </motion.main>

      <Footer />
    </div>
  );
}
