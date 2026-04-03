"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Redirecionamento seguro usando o router do Next.js
    const redirectToLogin = () => {
      router.replace("/login/");
    };

    // Registrar o listener de autenticação primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log("Auth Event:", event, !!session); // Debug em produção se necessário

      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (session) {
          setLoading(false);
        } else {
          // Se não houver sessão no INITIAL_SESSION, tentamos um check final por precaução
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          if (!currentSession) {
            redirectToLogin();
          } else {
            setLoading(false);
          }
        }
      }

      if (event === "SIGNED_OUT") {
        setLoading(true);
        redirectToLogin();
      }
    });

    // Timeout de segurança: Se nada acontecer em 1.5s, forçamos um check final
    // Útil para redes muito lentas onde o evento INITIAL_SESSION pode demorar
    const safetyTimeout = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        redirectToLogin();
      } else {
        setLoading(false);
      }
    }, 1500);

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-accent animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Verificando Credenciais...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
