
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationResponse, ProductID, ChannelID, GOFLUX_CHANNELS, GOFLUX_PRODUCTS, Persona, ProductConfigData } from "../types";

export const config = {
  runtime: 'edge', // Ensures high performance on platforms like Vercel
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Método não permitido', { status: 405 });
  }

  try {
    const { 
      theme, 
      subthemes, 
      allProductConfigs, 
      allChannelConfigs, 
      selectedProductIDs, 
      selectedChannelIDs, 
      selectedPersonaFilter, 
      modificationInstruction 
    } = await req.json();

    // The API key is securely accessed from environment variables on the server.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    // Filter products based on selection
    const productsToGenerateFor = selectedProductIDs === 'all'
      ? GOFLUX_PRODUCTS
      : GOFLUX_PRODUCTS.filter((p) => (selectedProductIDs as ProductID[]).includes(p.id));

    if (productsToGenerateFor.length === 0) {
      return new Response(JSON.stringify({ products: [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const productContextForAI = productsToGenerateFor
      .map((p) => {
        const config = (allProductConfigs as Record<ProductID, ProductConfigData>)[p.id];
        const nameInPrompt = p.id === ProductID.SAAS ? 'Plataforma' : p.label;
        
        let context = `${p.id} (Nome para IA: ${nameInPrompt}):\n  - Resumo Geral do Produto: ${config.generalDescription}`;

        if (selectedPersonaFilter !== 'none') {
          const personaProfile = config.personaDescriptions[selectedPersonaFilter as Persona];
          if (personaProfile) {
            context += `\n  - Perfil de Público (${selectedPersonaFilter}): ${personaProfile}`;
          }
        }
        return context;
      })
      .join('\n\n');

    // Filter channels based on selection
    const channelsToGenerateFor = selectedChannelIDs === 'all'
      ? GOFLUX_CHANNELS
      : GOFLUX_CHANNELS.filter((c) => (selectedChannelIDs as ChannelID[]).includes(c.id));

    if (channelsToGenerateFor.length === 0) {
      return new Response(JSON.stringify({ products: [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const channelInstructionsForAI = channelsToGenerateFor.map((channel) => {
      const customPrompt = (allChannelConfigs as Record<string, string>)[channel.id];
      return `
        ${channel.label}:
        ${customPrompt}
      `;
    }).join('\n\n');

    let audienceForAI = 'Gestores de logística, donos de transportadoras e profissionais de suprimentos.';
    if (selectedPersonaFilter === Persona.EMBARCADOR) {
      audienceForAI = 'Exclusivamente Embarcadores (clientes de transportadoras).';
    } else if (selectedPersonaFilter === Persona.TRANSPORTADOR) {
      audienceForAI = 'Exclusivamente Transportadores (donos de transportadoras e seus gestores).';
    } else {
      audienceForAI = 'Gestores de logística, donos de transportadoras e profissionais de suprimentos.';
    }

    const revisionDirective = modificationInstruction ? `
      INSTRUÇÃO DE REVISÃO:
      Com base no conteúdo gerado anteriormente (considerando o TEMA CENTRAL, SUBTEMAS e CONTEXTO DOS PRODUTOS fornecidos), 
      por favor, REVISE todo o conteúdo gerado de acordo com a seguinte instrução:
      "${modificationInstruction}"

      Mantenha a estrutura JSON e os formatos de canal exigidos.
      ` : '';

    const prompt = `
      Atue como o "goFlux Content Engine", um redator sênior especializado em Logtech, Fintech e Sustentabilidade para o setor de transporte rodoviário de cargas.
      
      TEMA CENTRAL: ${theme}
      SUBTEMAS ADICIONAIS: ${subthemes || 'Nenhum subtema específico.'}
      
      DIRETRIZES DE MARCA:
      Tom de voz: Profissional, inovador, focado em dados e humano (parceiro do transportador).
      Público: ${audienceForAI}

      CONTEXTO DOS PRODUTOS (USE ESTAS DESCRIÇÕES COMO BASE. Gere conteúdo APENAS para os seguintes IDs de produto. O campo 'name' na resposta JSON deve corresponder ao nome que a IA inferir para o produto, e.g., para o ID 'SAAS' o nome pode ser 'Plataforma'):
      ${productContextForAI}

      Instruções de Saída: Para CADA UM DOS IDs DE PRODUTO listados no CONTEXTO DOS PRODUTOS acima, gere conteúdo NOS SEGUINTES FORMATOS DE CANAL. Siga as premissas de tom profissional, inovador, focado em dados e humano.

      FORMATOS DE CANAL A SEREM GERADOS (APENAS ESTES FORMATOS):
      ${channelInstructionsForAI}

      ${revisionDirective}

      Estrutura do Output para cada produto (JSON):
      Você DEVE retornar um array de objetos JSON, onde cada objeto representa um produto.
      Cada objeto de produto DEVE conter 'id' (correspondendo ao ProductID), 'name' (o nome que você inferiu para o produto, ex: para ID 'SAAS' o nome pode ser 'Plataforma'), e um objeto 'content' que CONTÉM APENAS as chaves dos formatos de canal solicitados.

      Exemplo de saída esperada para um produto se E-mail e Social forem selecionados:
      {
        "products": [
          {
            "id": "Club",
            "name": "Club goFlux",
            "content": {
              "email": {
                "subjects": ["Assunto 1", "Assunto 2", "Assunto 3"],
                "body": "Corpo do email..."
              },
              "social": {
                "artText": "Texto para arte",
                "caption": "Legenda com hashtags e CTA"
              }
            }
          },
          // ... outros produtos
        ]
      }
    `;

    const dynamicContentProperties: { [key: string]: any } = {};
    if (selectedChannelIDs === 'all' || (selectedChannelIDs as ChannelID[]).includes(ChannelID.EMAIL)) {
      dynamicContentProperties.email = {
        type: Type.OBJECT,
        properties: {
          subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
          body: { type: Type.STRING }
        },
        required: ["subjects", "body"]
      };
    }
    if (selectedChannelIDs === 'all' || (selectedChannelIDs as ChannelID[]).includes(ChannelID.SOCIAL)) {
      dynamicContentProperties.social = {
        type: Type.OBJECT,
        properties: {
          artText: { type: Type.STRING },
          caption: { type: Type.STRING }
        },
        required: ["artText", "caption"]
      };
    }
    if (selectedChannelIDs === 'all' || (selectedChannelIDs as ChannelID[]).includes(ChannelID.BLOG)) {
      dynamicContentProperties.blog = {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "summary"]
      };
    }

    const contentSchema = Object.keys(dynamicContentProperties).length > 0
      ? { type: Type.OBJECT, properties: dynamicContentProperties, required: Object.keys(dynamicContentProperties) }
      : { type: Type.OBJECT, properties: {} };

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        products: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              content: contentSchema
            },
            required: ["id", "name", "content"]
          }
        }
      },
      required: ["products"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // CORRIGIDO: Usando o modelo recomendado de acordo com as diretrizes.
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    });

    try {
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      const data = JSON.parse(text);
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Failed to parse Gemini response on backend:", error);
      console.error("Raw AI response text from backend:", response.text);
      return new Response(JSON.stringify({ error: `Erro ao processar a resposta da IA no servidor. Resposta bruta: ${response.text}` }), { status: 500 });
    }
  } catch (error: any) {
    console.error("Server API error:", error);
    return new Response(JSON.stringify({ error: error.message || 'Falha no servidor' }), { status: 500 });
  }
}