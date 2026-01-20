

export interface ContentPart {
  email?: { // Changed to optional
    subjects: string[]; // Changed from 'subject: string'
    body: string;
  };
  social?: { // Changed to optional
    artText: string;
    caption: string;
  };
  blog?: { // Changed to optional
    title: string;
    summary: string[];
  };
}

export interface ProductContent {
  name: string;
  id: string;
  content: ContentPart;
}

export interface GenerationResponse {
  products: ProductContent[];
}

export enum ProductID {
  CLUB = 'Club',
  CARBON_FREE = 'carbonFree',
  SAAS = 'SAAS', // Internal ID remains SAAS
  NA_CONTA = 'naConta',
  VIEW = 'View'
}

export enum Persona {
  EMBARCADOR = 'Embarcador',
  TRANSPORTADOR = 'Transportador',
}

export interface ProductConfigData {
  generalDescription: string; // The main description for the product
  personaDescriptions: Record<Persona, string>; // Now stores audience profiles (demographic/psychographic)
}

export interface ProductMetadata {
  id: ProductID;
  label: string;
  icon: string;
  defaultGeneralDescription: string; // Renamed for clarity
  defaultPersonaDescriptions: Record<Persona, string>; // Now stores default audience profiles
  colorClass: string; // Tailwind class for text color
  bgColorClass: string; // Tailwind class for background color
}

export const GOFLUX_PRODUCTS: ProductMetadata[] = [
  { 
    id: ProductID.CLUB, 
    label: 'Club', 
    icon: 'fa-users', 
    defaultGeneralDescription: 'Hub para transportadoras focado em comunidade, benefícios exclusivos e rede de contatos.',
    defaultPersonaDescriptions: {
      [Persona.EMBARCADOR]: 'Empresários e gestores de logística de empresas embarcadoras de pequeno e médio porte, com idade entre 35-55 anos. Buscam otimização de custos, eficiência na cadeia de suprimentos e soluções tecnológicas para gestão de fretes. Valorizam transparência, segurança e a oportunidade de encontrar transportadoras parceiras inovadoras. Frequentam eventos do setor e utilizam redes sociais profissionais como LinkedIn para informações e tendências, mas com foco em soluções que beneficiem sua operação.',
      [Persona.TRANSPORTADOR]: 'Donos e gestores de transportadoras de cargas, geralmente homens e mulheres entre 40-60 anos, com experiência no setor. Focados em rentabilidade, gestão de frota, segurança da carga e expansão de novos negócios. Interessados em tecnologias que facilitem a operação, acesso a crédito justo e otimização de rotas. Buscam uma comunidade onde possam trocar experiências, encontrar benefícios exclusivos e aumentar sua rede de contatos para parcerias e melhores oportunidades de frete. Presentes em grupos de WhatsApp e fóruns de transportadores, e buscam conteúdo prático e direto que mostre resultados.',
    },
    colorClass: 'text-orange-500', 
    bgColorClass: 'bg-orange-50',
  },
  { 
    id: ProductID.CARBON_FREE, 
    label: 'carbonFree', 
    icon: 'fa-leaf', 
    defaultGeneralDescription: 'Solução de compensação de carbono com foco em ESG na prática, diferencial competitivo e frete verde.',
    defaultPersonaDescriptions: {
      [Persona.EMBARCADOR]: 'Empresas embarcadoras de médio a grande porte, com diretorias e gestores de sustentabilidade ou ESG (30-50 anos), que já possuem ou estão implementando políticas de responsabilidade socioambiental. Buscam fornecedores que apoiem suas metas ESG, minimizem sua pegada de carbono e ofereçam um diferencial de marketing verde. Valorizam relatórios claros, impacto real e parcerias estratégicas. Participam de conselhos e associações de sustentabilidade.',
      [Persona.TRANSPORTADOR]: 'Transportadoras de médio a grande porte, com visão de futuro e gestores engajados (35-55 anos), que entendem a importância da sustentabilidade como um valor de marca e um atrativo para embarcadores. Buscam soluções práticas e acessíveis para compensar suas emissões, comunicar seu compromisso ESG e se diferenciar no mercado. Valorizam a facilidade de implementação e o reconhecimento de mercado por iniciativas verdes. Interessados em como a sustentabilidade pode se traduzir em novos negócios.',
    },
    colorClass: 'text-green-500', 
    bgColorClass: 'bg-green-50',
  },
  { 
    id: ProductID.SAAS, 
    label: 'Plataforma', // Display name is Plataforma
    icon: 'fa-laptop-code', 
    defaultGeneralDescription: 'Plataforma de gestão com foco em digitalização, transparência e redução de custos operacionais.',
    defaultPersonaDescriptions: {
      [Persona.EMBARCADOR]: 'Gestores de logística e suprimentos de indústrias e varejistas de médio porte (28-48 anos), que sofrem com a falta de visibilidade, processos manuais e ineficiência na contratação e gestão de fretes. Buscam ferramentas que centralizem informações, automatizem tarefas e proporcionem maior controle e economia. Valorizam a facilidade de integração, relatórios claros e a capacidade de tomar decisões mais rápidas e assertivas. Utilizam ERPs e CRMs em suas operações.',
      [Persona.TRANSPORTADOR]: 'Empresas de transporte e seus gestores operacionais (30-50 anos) que lidam com a complexidade da roteirização, controle de veículos, documentação e comunicação com motoristas e embarcadores. Buscam uma plataforma intuitiva que simplifique o dia a dia, reduza erros, otimize a utilização da frota e proporcione maior transparência em todas as etapas da operação. Valorizam a redução de papelada, a agilidade no pagamento e a organização de suas informações financeiras e operacionais.',
    },
    colorClass: 'text-red-500', 
    bgColorClass: 'bg-red-50',
  },
  { 
    id: ProductID.NA_CONTA, 
    label: 'naConta', 
    icon: 'fa-wallet', 
    defaultGeneralDescription: 'Banco do transportador focado em fluxo de caixa, facilidade financeira e crédito justo.',
    defaultPersonaDescriptions: {
      [Persona.EMBARCADOR]: 'Embarcadores que buscam segurança e agilidade nas transações financeiras com suas transportadoras parceiras. Preocupados com a saúde financeira da sua cadeia logística e interessados em soluções que garantam a estabilidade e o bom relacionamento com os prestadores de serviço. Valorizam a transparência e a confiabilidade de uma plataforma que apoie seus parceiros transportadores.',
      [Persona.TRANSPORTADOR]: 'Transportadores autônomos e pequenas e médias empresas de transporte (30-55 anos), que enfrentam dificuldades com o acesso a crédito, burocracia bancária e gestão ineficiente do fluxo de caixa. Buscam uma solução financeira que entenda suas particularidades, ofereça taxas justas, agilize pagamentos e facilite o gerenciamento das finanças. Valorizam a conveniência de um banco digital especializado, com suporte ágil e que ofereça serviços como antecipação de recebíveis e linhas de crédito flexíveis para capital de giro.',
    },
    colorClass: 'text-blue-500', 
    bgColorClass: 'bg-blue-50',
  },
  { 
    id: ProductID.VIEW, 
    label: 'View', 
    icon: 'fa-chart-line', 
    defaultGeneralDescription: 'Inteligência Artificial para frete focada em futuro, análise preditiva e tomada de decisão baseada em dados.',
    defaultPersonaDescriptions: {
      [Persona.EMBARCADOR]: 'Diretores e gestores de supply chain e logística de grandes empresas (38-58 anos), que precisam tomar decisões estratégicas complexas sobre a contratação de fretes, roteirização e planejamento de demanda. Buscam insights acionáveis baseados em IA, previsões de mercado e ferramentas que otimizem a negociação e reduzam riscos. Valorizam a inovação, a capacidade de antecipar cenários e a segurança de dados para garantir vantagem competitiva.',
      [Persona.TRANSPORTADOR]: 'Gestores de planejamento e diretores comerciais de transportadoras de grande porte (35-55 anos), que buscam otimizar suas operações, precificar fretes de forma mais estratégica e identificar novas oportunidades de negócio. Interessados em inteligência de mercado, análise preditiva de demanda e ferramentas que auxiliem na tomada de decisões complexas. Valorizam a visibilidade de mercado, a capacidade de prever tendências e a maximização da rentabilidade da frota.',
    },
    colorClass: 'text-yellow-500', 
    bgColorClass: 'bg-yellow-50',
  },
];

export enum ChannelID {
  EMAIL = 'email',
  SOCIAL = 'social',
  BLOG = 'blog'
}

export interface ChannelMetadata {
  id: ChannelID;
  label: string;
  icon: string;
  defaultPrompt: string; // This will hold the detailed instructions for the AI
}

export const GOFLUX_CHANNELS: ChannelMetadata[] = [
  {
    id: ChannelID.EMAIL,
    label: 'Email Marketing',
    icon: 'fa-envelope-open-text',
    defaultPrompt: `
       Role adicional: Atue como um Copywriter sênior especializado em Direct Response e E-mail Marketing.
       Tarefa: Escreva um e-mail de venda ou engajamento focado em Gestores de logística, donos de transportadoras e profissionais de suprimentos.
       Contexto para este e-mail (baseado no CONTEXTO DOS PRODUTOS e TEMA CENTRAL):
          * Produto/Serviço: [Infera o nome do produto do CONTEXTO DOS PRODUTOS]
          * Principal dor que resolve: [Infera do CONTEXTO DOS PRODUTOS]
          * Diferencial único: [Infera do CONTEXTO DOS PRODUTOS]
          * Oferta/Objetivo: [Infera do TEMA CENTRAL e CONTEXTO DOS PRODUTOS, e.g., apresentar solução, agendar uma demonstração, etc.]
       Diretrizes de Escrita:
          * Use o framework AIDA (Atenção, Interesse, Desejo, Ação) ou PAS (Problema, Agitação, Solução).
          * O tom deve ser Persuasivo e Profissional.
          * Escreva 3 opções de linhas de assunto (1 com foco em curiosidade, 1 com foco em benefício direto e 1 com foco em urgência).
          * O corpo do e-mail deve ter sentenças curtas e parágrafos de no máximo 3 linhas para facilitar a leitura no mobile.
          * Inclua um P.S. ao final reforçando a escassez ou o principal benefício.
       Restrições: Evite palavras batidas de spam (como "Grátis" em caixa alta, "Ganhe dinheiro", "Clique aqui", etc.) para garantir a entregabilidade.
    `,
  },
  {
    id: ChannelID.SOCIAL,
    label: 'Redes Sociais',
    icon: 'fa-share-nodes',
    defaultPrompt: `
       Texto da Arte (Curto e impactante)
       Legenda (Com hashtags e CTA para link na bio/comentários)
    `,
  },
  {
    id: ChannelID.BLOG,
    label: 'Artigo de Blog',
    icon: 'fa-blog',
    defaultPrompt: `
       Título SEO-friendly
       Resumo estruturado em 3 tópicos principais.
    `,
  },
];