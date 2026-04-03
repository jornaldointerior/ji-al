"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session once on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes (logout, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setLoading(true);
        router.push("/login");
      }
      if (event === "SIGNED_IN" && session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps: only run once on mount — NOT on every router change

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-accent animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verificando Credenciais...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
