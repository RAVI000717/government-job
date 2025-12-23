
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty } from "./types";

// Always initialize GoogleGenAI with the API key from process.env.API_KEY using named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateMockTest(exam: string, subject: string): Promise<Question[]> {
  const prompt = `Generate exactly 40 high-quality multiple-choice questions for the ${exam} examination, specifically focusing on the subject: ${subject}.
  
  Requirements:
  1. Difficulty distribution: 10 Easy, 20 Medium, 10 Hard.
  2. Each question must have exactly 4 options.
  3. Include a clear explanation for the correct answer.
  4. Questions must follow the latest patterns of competitive government exams in India.
  5. Language: English.
  
  Response format: A JSON array of objects.`;

  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex reasoning and subject proficiency tasks
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              text: { type: Type.STRING, description: "The question text" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of exactly 4 strings"
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING, description: "Detailed reasoning" },
              difficulty: { type: Type.STRING, enum: Object.values(Difficulty) },
              subject: { type: Type.STRING }
            },
            required: ["id", "text", "options", "correctAnswer", "explanation", "difficulty", "subject"],
            propertyOrdering: ["id", "text", "options", "correctAnswer", "explanation", "difficulty", "subject"]
          }
        }
      }
    });

    // Directly access .text property from GenerateContentResponse
    const questions: Question[] = JSON.parse(response.text);
    return questions;
  } catch (error) {
    console.error("Error generating mock test:", error);
    throw error;
  }
}

export async function generateAITips(score: number, total: number, subjects: string): Promise<string> {
  const prompt = `Based on a government job mock test result:
  Score: ${score}/${total}
  Subject performance: ${subjects}
  
  Provide 3-4 bullet points of high-impact improvement tips for this student. Keep it concise and motivating.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    // Directly access .text property from GenerateContentResponse
    return response.text || "Keep practicing and focus on weak areas!";
  } catch (error) {
    return "Focus on your accuracy and time management. Consistent revision is key.";
  }
}
