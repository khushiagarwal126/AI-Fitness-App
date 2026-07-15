import fs from "fs";

export const analyzeImage = async (filePath: string) => {
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const base64ImageFile = fs.readFileSync(filePath, { encoding: "base64" });

    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      { text: "Extract the food name and estimated calories from this image in a JSON object." },
    ];

    const config = {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
          calories: { type: "number" },
        },
        required: ["name", "calories"],
      },
    };

    const response = await ai.models.generateContent({ model: "gemini-3.1-flash-lite", contents, config });

    const text = response.text;
    if (!text) throw new Error("Empty response text from Gemini API");
    return JSON.parse(text);
  } catch (error) {
    console.log(error);
    throw error;
  }
};