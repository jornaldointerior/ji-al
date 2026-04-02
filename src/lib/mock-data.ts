export const MOCK_NEWS = [
  {
    id: "1",
    title: "Sertão de Alagoas ganha novo complexo industrial automotivo em 2026",
    excerpt: "Governo estadual anuncia investimento bilionário que deve gerar mais de 5 mil empregos diretos na região do Pajeú.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    category: "Alagoas",
    date: "28 Março, 2026",
    href: "/noticia/1",
  },
  {
    id: "2",
    title: "Justiça eleitoral define novas regras para campanhas no interior",
    excerpt: "Medidas visam aumentar a transparência e combater o uso de desinformação em cidades com menos de 50 mil habitantes.",
    image: "https://images.unsplash.com/photo-1589391028033-661706692883?auto=format&fit=crop&q=80&w=800",
    category: "Brasil",
    date: "28 Março, 2026",
    href: "/noticia/2",
  },
  {
    id: "3",
    title: "Seca severa atinge plantações de milho e preocupa produtores",
    excerpt: "Falta de chuvas nos últimos 45 dias pode reduzir safra em até 40% em relação ao ano passado.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    category: "Brasil",
    date: "27 Março, 2026",
    href: "/noticia/3",
  },
  {
    id: "4",
    title: "Operação Impacto desarticula quadrilha de roubo de cargas",
    excerpt: "Polícia Civil apreende armamento pesado e recupera mercadorias avaliadas em R$ 2 milhões.",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    category: "Brasil",
    date: "27 Março, 2026",
    href: "/noticia/4",
  },
  {
    id: "5",
    title: "Festival de Sanfona atrai milhares e movimenta turismo local",
    excerpt: "Evento celebra tradição musical e registra ocupação hoteleira de 100% durante o final de semana.",
    image: "https://images.unsplash.com/photo-1514525253361-bee87387342b?auto=format&fit=crop&q=80&w=800",
    category: "Cultura e Entretenimento",
    date: "26 Março, 2026",
    href: "/noticia/5",
  },
  {
    id: "6",
    title: "Sertânia anuncia novas obras de saneamento básico",
    excerpt: "Projeto deve beneficiar mais de 10 mil famílias em diversos bairros da periferia.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb194806a?auto=format&fit=crop&q=80&w=800",
    category: "Alagoas",
    date: "26 Março, 2026",
    href: "/noticia/6",
  },
  {
    id: "7",
    title: "Sertão FC avança para a semi-final do Campeonato Pernambucano",
    excerpt: "Com golaço no último minuto, time do interior garante vaga em jogo disputado em Petrolina.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    category: "Esportes",
    date: "25 Março, 2026",
    href: "/noticia/7",
  },
  {
    id: "8",
    title: "Regional de Vôlei: Final será em Serra Talhada este ano",
    excerpt: "Cidade se prepara para receber mais de 20 delegações de todo o Nordeste no ginásio municipal.",
    image: "https://images.unsplash.com/photo-1592656670411-b919908b8d47?auto=format&fit=crop&q=80&w=800",
    category: "Esportes",
    date: "24 Março, 2026",
    href: "/noticia/8",
  },
  {
    id: "11",
    title: "Maratona do Sertão confirma 2 mil inscritos para a edição 2026",
    excerpt: "Evento de atletismo cresce 30% em relação ao ano anterior e atrai corredores de elite.",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800",
    category: "Esportes",
    date: "23 Março, 2026",
    href: "/noticia/11",
  },
  {
    id: "12",
    title: "Inauguração de nova UPA reforça atendimento de saúde",
    excerpt: "Unidade conta com equipamentos modernos e equipe multidisciplinar para urgências.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    category: "Brasil",
    date: "25 Março, 2026",
    href: "/noticia/12",
  },
  {
    id: "9",
    title: "Prefeitura lança programa de incentivo a startups",
    excerpt: "Editais oferecem suporte financeiro e mentoria para jovens empreendedores da região.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800",
    category: "Brasil",
    date: "24 Março, 2026",
    href: "/noticia/9",
  },
  {
    id: "10",
    title: "Exposição fotográfica retrata a beleza do Rio Pajeú",
    excerpt: "Artistas locais mostram perspectivas únicas sobre o rio que é a alma do sertão.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
    category: "Cultura e Entretenimento",
    date: "24 Março, 2026",
    href: "/noticia/10",
  },
];

export const getNewsById = (id: string) => {
  return MOCK_NEWS.find((n) => n.id === id);
};

export const getNewsByCategory = (category: string) => {
  return MOCK_NEWS.filter((n) => n.category.toLowerCase() === category.toLowerCase());
};

export const RELATED_CONTENT = `
  <p>O cenário econômico do interior vem passando por uma transformação sem precedentes. Com a chegada de novos investimentos e a modernização da infraestrutura local, as oportunidades de emprego e renda têm crescido exponencialmente em cidades que antes dependiam exclusivamente da agricultura de subsistência.</p>
  
  <p>Segundo especialistas ouvidos pelo <strong>Jornal do Interior</strong>, a tendência é que esse crescimento se consolide nos próximos cinco anos, transformando a região em um novo polo tecnológico e industrial do Nordeste. "Estamos vendo uma migração reversa", explica o economista João Silva. "Pessoas que antes iam para as capitais agora estão voltando para suas cidades de origem em busca de qualidade de vida e bons empregos".</p>

  <blockquote>
    "O interior não é mais apenas o lugar do passado, é o lugar onde o futuro do Brasil está sendo construído com suor e inovação."
  </blockquote>

  <p>Apesar do otimismo, ainda há desafios significativos. A capacitação de mão de obra local e o fornecimento estável de energia e internet de alta velocidade são pontos que exigem atenção imediata tanto do poder público quanto da iniciativa privada.</p>
`;
