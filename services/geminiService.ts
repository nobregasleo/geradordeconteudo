
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResponse, ProductID } from "../types";

export const generateMarketingContent = async (theme: string, subthemes: string): Promise<GenerationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Atue como o "goFlux Content Engine", um redator sênior especializado em Logtech, Fintech e Sustentabilidade para o setor de transporte rodoviário de cargas.
    
    TEMA CENTRAL: ${theme}
    SUBTEMAS POR PRODUTO: ${subthemes}
    
    Gere conteúdos de marketing para os 5 produtos goFlux:
    1. Club (Hub para transportadoras): Comunidade, benefícios, rede de contatos.
    2. carbonFree (Compensação): ESG, frete verde, diferencial competitivo.
    3. goFlux SAAS (Plataforma): Digitalização, transparência, redução de custos.
    4. naConta (Banco): Fluxo de caixa, crédito justo, facilidade financeira.
    5. View (IA): Futuro, análise preditiva, dados.

    Para cada produto, forneça:
    - E-mail Marketing (Assunto curto e impactante; Corpo com Dor > Solução > CTA).
    - Redes Sociais (Texto da Arte curto; Legenda com hashtags e CTA).
    - Artigo de Blog (Título SEO; Resumo em 3 tópicos).

    O tom deve ser profissional, inovador, focado em dados e humano.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "O nome técnico do produto (ex: Club, carbonFree, etc)" },
                name: { type: Type.STRING, description: "Nome legível do produto" },
                content: {
                  type: Type.OBJECT,
                  properties: {
                    email: {
                      type: Type.OBJECT,
                      properties: {
                        subject: { type: Type.STRING },
                        body: { type: Type.STRING }
                      }
                    },
                    social: {
                      type: Type.OBJECT,
                      properties: {
                        artText: { type: Type.STRING },
                        caption: { type: Type.STRING }
                      }
                    },
                    blog: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.ARRAY, items: { type: Type.STRING } }
                      }
                    }
                  }
                }
              },
              required: ["id", "name", "content"]
            }
          }
        },
        required: ["products"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data as GenerationResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Erro ao processar a resposta da IA.");
  }
};
