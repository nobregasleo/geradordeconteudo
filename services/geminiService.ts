
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResponse, ProductID } from "../types";

export const generateMarketingContent = async (
  theme: string, 
  subthemes: string, 
  productConfigs: Record<string, string>
): Promise<GenerationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const productContext = Object.entries(productConfigs)
    .map(([id, desc]) => `${id}: ${desc}`)
    .join('\n');

  const prompt = `
    Atue como o "goFlux Content Engine", um redator sênior especializado em Logtech, Fintech e Sustentabilidade para o setor de transporte rodoviário de cargas.
    
    TEMA CENTRAL: ${theme}
    SUBTEMAS ADICIONAIS: ${subthemes}
    
    CONTEXTO DOS PRODUTOS (USE ESTAS DESCRIÇÕES COMO BASE):
    ${productContext}

    Instruções de Saída: Para cada um dos produtos acima, gere 3 formatos de conteúdo (E-mail Marketing, Post de Rede Social e Artigo de Blog), seguindo as premissas de tom profissional, inovador e humano.

    Para cada produto, forneça:
    - E-mail Marketing (Assunto curto e impactante; Corpo com Dor > Solução > CTA).
    - Redes Sociais (Texto da Arte curto; Legenda com hashtags e CTA).
    - Artigo de Blog (Título SEO; Resumo em 3 tópicos).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
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
                id: { type: Type.STRING },
                name: { type: Type.STRING },
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
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    const data = JSON.parse(text);
    return data as GenerationResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Erro ao processar a resposta da IA.");
  }
};