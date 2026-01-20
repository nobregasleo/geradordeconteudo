
export interface ContentPart {
  email: {
    subject: string;
    body: string;
  };
  social: {
    artText: string;
    caption: string;
  };
  blog: {
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
  SAAS = 'SAAS',
  NA_CONTA = 'naConta',
  VIEW = 'View'
}

export interface ProductMetadata {
  id: ProductID;
  label: string;
  icon: string;
  defaultDescription: string;
}

export const GOFLUX_PRODUCTS: ProductMetadata[] = [
  { 
    id: ProductID.CLUB, 
    label: 'Club', 
    icon: 'fa-users', 
    defaultDescription: 'Hub para transportadoras focado em comunidade, benefícios exclusivos e rede de contatos.' 
  },
  { 
    id: ProductID.CARBON_FREE, 
    label: 'carbonFree', 
    icon: 'fa-leaf', 
    defaultDescription: 'Solução de compensação de carbono com foco em ESG na prática, diferencial competitivo e frete verde.' 
  },
  { 
    id: ProductID.SAAS, 
    label: 'SAAS', 
    icon: 'fa-laptop-code', 
    defaultDescription: 'Plataforma de gestão com foco em digitalização, transparência e redução de custos operacionais.' 
  },
  { 
    id: ProductID.NA_CONTA, 
    label: 'naConta', 
    icon: 'fa-wallet', 
    defaultDescription: 'Banco do transportador focado em fluxo de caixa, facilidade financeira e crédito justo.' 
  },
  { 
    id: ProductID.VIEW, 
    label: 'View', 
    icon: 'fa-chart-line', 
    defaultDescription: 'Inteligência Artificial para frete focada em futuro, análise preditiva e tomada de decisão baseada em dados.' 
  },
];
