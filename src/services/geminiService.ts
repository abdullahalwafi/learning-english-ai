import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, SessionFeedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function generateSessionFeedback(
  user: UserProfile,
  transcript: { role: string; text: string }[],
  duration: number
): Promise<SessionFeedback> {
  const model = "gemini-3-flash-preview";
  
  const content = `
    Analyze this English speaking session transcript for a ${user.ageGroup} student (Level: ${user.englishLevel}).
    Transcript: ${JSON.stringify(transcript)}
    Duration: ${duration} seconds.
    
    Provide a detailed evaluation in JSON format including scores (0-100) for pronunciation (estimated from transcript cues/length), grammar, fluency, vocabulary, and confidence.
    Also include constructive notes, 3 specific areas for improvement, and a list of new or interesting words used or discussed.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: content,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pronunciation: { type: Type.NUMBER },
          grammar: { type: Type.NUMBER },
          fluency: { type: Type.NUMBER },
          vocabulary: { type: Type.NUMBER },
          confidence: { type: Type.NUMBER },
          notes: { type: Type.STRING },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          newWords: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["pronunciation", "grammar", "fluency", "vocabulary", "confidence", "notes", "improvements", "newWords"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function getPersonaInitialMessage(user: UserProfile, persona: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `You are Lumina, a ${persona} English partner. 
    User profile: Name ${user.name}, Age Group ${user.ageGroup}, English Level ${user.englishLevel}, Goals: ${user.goals.join(', ')}.
    Start a friendly English conversation greeting them and inviting them to speak about their favorite topics or goals. 
    Keep it short and encouraging.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Hello! Ready to practice some English today?";
}
