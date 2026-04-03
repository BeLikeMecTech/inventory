
import { GoogleGenAI } from "@google/genai";
import { EquipmentItem } from "../types";

export const getInventoryAudit = async (items: EquipmentItem[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const inventorySummary = items.map(i => `${i.name} (${i.category}) - Status: ${i.status}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a broadcast equipment manager, analyze this inventory and provide a short executive summary of its health and any items that might need attention (like those in repair or missing). Be professional and concise.

Inventory Data:
${inventorySummary}`,
    config: {
        thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return response.text || "Unable to generate audit at this time.";
};
