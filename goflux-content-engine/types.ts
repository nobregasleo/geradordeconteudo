
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
  SAAS = 'goFlux SAAS',
  NA_CONTA = 'naConta',
  VIEW = 'View'
}
