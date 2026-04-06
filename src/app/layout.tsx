import type { Metadata } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jornal do Interior | Notícias de Confiança",
  description: "O portal de notícias mais completo do interior, com política, economia, cultura e eventos em tempo real.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import GlobalTracker from "@/components/analytics/GlobalTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif">
        <GlobalTracker />
        {children}
      </body>
    </html>
  );
}
