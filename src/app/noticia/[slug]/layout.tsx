import { supabase } from "@/lib/supabase";

export async function generateStaticParams() {
  const { data } = await supabase.from("articles").select("slug");
  if (!data) return [];
  return data.map((article) => ({ slug: article.slug }));
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
