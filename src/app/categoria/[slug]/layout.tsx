export function generateStaticParams() {
  return [
    { slug: "alagoas" },
    { slug: "brasil" },
    { slug: "mundo" },
    { slug: "esportes" },
    { slug: "cultura-e-entretenimento" }
  ];
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
