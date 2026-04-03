"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Headline from "@/components/ui/Headline";
import Container from "@/components/ui/Container";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    // Reset state on initialization
    setLoading(false);
    setSuccess(false);
    return () => { isMounted.current = false; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    // Timeout de segurança para soltar o botão se algo travar (ex: rede Hostinger lenta)
    const loginTimeout = setTimeout(() => {
      if (isMounted.current) {
        setLoading(false);
      }
    }, 5000);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        clearTimeout(loginTimeout);
        throw authError;
      }

      setSuccess(true);
      // O redirect para /admin/ deve disparar o AdminAuthWrapper
      // que agora aguarda 1.2s para garantir a sincronia
      router.replace("/admin/");
    } catch (err: any) {
      clearTimeout(loginTimeout);
      setLoading(false);
      setError(err.message || "Erro ao realizar login. Verifique suas credenciais.");
    }
  };

  // Precisamos garantir que o componente não tente atualizar o estado se for desmontado
  let mounted = true;
  useEffect(() => {
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        className="w-full max-w-md"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-colors mb-12 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o Portal
        </Link>

        <div className="bg-white border border-slate-200 p-8 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />
          
          <div className="flex flex-col gap-2 mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent">Acesso Restrito</span>
            <Headline variant="primary" className="text-4xl italic">
              Login Administrativo
            </Headline>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@jornaldointerior.com.br"
                  className="w-full bg-slate-50 border border-slate-200 px-10 py-4 text-sm focus:border-primary focus:bg-white outline-none transition-all font-serif font-medium"
                />
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Senha</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 px-10 py-4 text-sm focus:border-primary focus:bg-white outline-none transition-all font-serif font-medium"
                />
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 mt-2"
              >
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-sans font-bold text-red-700 leading-relaxed uppercase tracking-wider">
                  {error}
                </p>
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-l-4 border-green-500 p-4 flex items-start gap-3 mt-2"
              >
                <div className="bg-green-500 rounded-full p-1">
                  <LogIn size={12} className="text-white" />
                </div>
                <p className="text-[11px] font-sans font-bold text-green-700 leading-relaxed uppercase tracking-wider">
                  Acesso Autorizado! Redirecionando...
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="mt-4 w-full bg-primary text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : success ? (
                "Entrando..."
              ) : (
                <>
                  Entrar no Sistema
                  <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
              © 2026 JORNAL DO INTERIOR • CONTROLE INTERNO
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
