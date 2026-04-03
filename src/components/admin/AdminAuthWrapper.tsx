"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hard redirect — window.location garante navegação real no static export
    function redirectToLogin() {
      window.location.href = "/login/";
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        redirectToLogin();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setLoading(true);
        redirectToLogin();
      }
      if (event === "SIGNED_IN" && session) {
        setLoading(false);
      }
      // Ignorar INITIAL_SESSION, TOKEN_REFRESHED, etc. — apenas agir em eventos explícitos
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
