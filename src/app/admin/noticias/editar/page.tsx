"use client";

import { useEffect, useState, Suspense } from "react";
import ArticleForm from "@/components/admin/ArticleForm";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function EditArticleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticle() {
      if (!id) {
        setError("ID da matéria não fornecido.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Matéria não encontrada.");
      } else {
        setInitialData(data);
      }
      setLoading(false);
    }

    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="animate-spin text-accent" size={32} />
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <h2 className="text-2xl font-black font-serif italic text-primary">{error || "Matéria não encontrada"}</h2>
        <button 
          onClick={() => router.push("/admin/noticias")}
          className="text-[10px] uppercase font-black tracking-widest text-accent hover:text-primary transition-colors"
        >
          Voltar para Lista
        </button>
      </div>
    );
  }

  return <ArticleForm mode="edit" initialData={initialData} />;
}

export default function EditArticlePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[500px]"><Loader2 className="animate-spin text-accent" size={32} /></div>}>
      <EditArticleContent />
    </Suspense>
  );
}
