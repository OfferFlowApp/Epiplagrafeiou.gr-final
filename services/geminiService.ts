import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generate high-conversion SEO metadata using gemini-3-flash-preview
export const generateSEOContent = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate high-conversion SEO meta title, description, and keywords for an office furniture product named "${productName}" in category "${category}". Focus on ranking first on Google for office furniture in Greece (EpplaGrafeiou.gr).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metaTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["metaTitle", "metaDescription", "keywords"]
        }
      }
    });
    // Access response.text property directly as per guidelines
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("SEO Generation failed", error);
    return null;
  }
};

// Get professional shopping advice using gemini-3-pro-preview for complex reasoning
export const getShoppingAssistantResponse = async (query: string, inventory: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a professional interior designer for EpplaGrafeiou.gr. Help the user choose from these products: ${JSON.stringify(inventory.map(p => ({name: p.name, category: p.category, price: p.price})))}. User query: ${query}`,
      config: {
        systemInstruction: "Be helpful, professional, and focus on selling high-end ergonomic solutions."
      }
    });
    // Access response.text property directly
    return response.text || "I'm sorry, I'm having trouble providing a recommendation right now.";
  } catch (error) {
    console.error("Assistant failed", error);
    return "I'm sorry, I'm having trouble connecting to the showroom right now.";
  }
};
