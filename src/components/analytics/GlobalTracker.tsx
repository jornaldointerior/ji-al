"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function GlobalTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    // Evitar incremento duplicado se o pathname não mudou (StrictMode, etc)
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    // Não contar acessos às áreas administrativas para não inflar a métrica
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
      return;
    }

    async function trackVisit() {
      try {
        const { error } = await supabase.rpc('increment_site_views');
        if (error && Object.keys(error).length > 0) {
          console.warn("Analytics tracker indisponível momentaneamente.");
        }
      } catch (err) {
        // Silently fail if tracker is blocked or network drops
      }
    }

    trackVisit();
  }, [pathname]);

  return null; // Componente invisível
}
