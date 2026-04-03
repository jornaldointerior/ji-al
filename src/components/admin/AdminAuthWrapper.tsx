"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkSessionSequentially = async () => {
      // 1. Aguarda um tempo fixo para o navegador processar os cookies/localStorage
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (!mounted) return;

      try {
        // 2. Tenta obter a sessão de forma definitiva
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // console.log("Acesso Negado: Redirecionando para login...");
          router.replace("/login/");
        } else {
          // console.log("Acesso Autorizado para:", session.user.email);
          setLoading(false);
        }
      } catch (err) {
        // console.error("Erro crítico na verificação:", err);
        router.replace("/login/");
      }
    };

    checkSessionSequentially();

    // Listener apenas para SIGNED_OUT após a entrada
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" && mounted) {
        setLoading(true);
        router.replace("/login/");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
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
