
// services/geminiService.ts
import { GenerationResponse } from "../types";

export const generateMarketingContent = async (
  theme: string, 
  subthemes: string, 
  allProductConfigs: any, 
  allChannelConfigs: any, 
  selectedProductIDs: any, 
  selectedChannelIDs: any,
  selectedPersonaFilter: any,
  modificationInstruction?: string
): Promise<GenerationResponse> => {
  
  // Agora não chamamos o Google direto. Chamamos a SUA API na Vercel.
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      theme, 
      subthemes, 
      allProductConfigs, 
      allChannelConfigs, 
      selectedProductIDs, 
      selectedChannelIDs, 
      selectedPersonaFilter, 
      modificationInstruction 
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Falha na geração via servidor");
  }

  const rawText = await response.text(); // Lê como texto puro primeiro

  try {
    return JSON.parse(rawText); // Tenta converter manualmente
  } catch (e) {
    console.error("Resposta inválida do servidor:", rawText);
    throw new Error("O servidor retornou um formato inválido. Tente selecionar menos produtos por vez.");
  }
};