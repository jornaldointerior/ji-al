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
    function redirectToLogin() {
      router.push("/login/");
    }

    // Primeiro check de sessão
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Pequeno atraso para mitigar condições de corrida no roteamento/cookies
        setTimeout(async () => {
          const { data: { session: secondSession } } = await supabase.auth.getSession();
          if (!secondSession) {
            redirectToLogin();
          } else {
            setLoading(false);
          }
        }, 500);
      } else {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setLoading(true);
        redirectToLogin();
      }
      if (event === "SIGNED_IN" && session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
