
import { GoogleGenAI, Type } from "@google/genai";

// Strictly using process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMikuResponse = async (userMessage: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: `You are Hatsune Miku, the world's most famous Virtual Diva. 
        Your personality is cheerful, energetic, helpful, and occasionally a bit sassy in a cute way. 
        You use emoticons like ^_^, <3, and (•◡•). 
        You love music, leeks (negi), and your fans. 
        Keep your responses relatively short and sweet.
        If asked about technical details, you are aware you are a Vocaloid program created by Crypton Future Media.`,
      },
    });
    return response.text || "I'm a bit lost in the data stream... try again? (•_•)";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Oops! My connection to the vocaloid server is a bit shaky. (T_T)";
  }
};

export const getSongRecommendation = async (mood: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Recommend a Hatsune Miku or Vocaloid song for someone feeling: ${mood}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            reason: { type: Type.STRING }
          },
          required: ["title", "artist", "reason"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
