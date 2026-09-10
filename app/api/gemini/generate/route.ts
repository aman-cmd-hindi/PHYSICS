import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { topicTitle, chapterTitle, context } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert Maharashtra State Board Class 12 Physics teacher.
Create syllabus-aligned study and practice material for:
Chapter: "${chapterTitle}"
Topic: "${topicTitle}"
Context: "${context || "Standard board syllabus"}"

Provide:
1. Summary: A conceptual overview with definitions and laws.
2. Key Formulas: Up to 3 important formulas with names and meanings (use simple plain text or standard math symbols like tau, omega, pi, r^2).
3. Practice Questions: Exactly 2 multiple choice questions following Maharashtra board style with 4 options, hint, and step-by-step explanation.
4. Numerical: 1 board-style numerical problem with given parameters, formula, 3 solution steps, and final answer with units.`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        keyFormulas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              latex: { type: Type.STRING },
              meaning: { type: Type.STRING },
            },
            required: ["name", "latex", "meaning"],
          },
        },
        practiceQuestions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctOptionIndex: { type: Type.INTEGER },
              hint: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["id", "question", "options", "correctOptionIndex", "hint", "explanation"],
          },
        },
        numerical: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            given: { type: Type.STRING },
            formula: { type: Type.STRING },
            solutionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            finalAnswer: { type: Type.STRING },
          },
          required: ["question", "given", "formula", "solutionSteps", "finalAnswer"],
        },
      },
      required: ["summary", "keyFormulas", "practiceQuestions", "numerical"],
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });
    } catch (e) {
      console.warn("Primary gemini-3.6-flash failed, trying gemini-flash-latest:", e);
      response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });
    }

    const rawText = response.text || "{}";
    const data = JSON.parse(rawText);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate dynamic content from Gemini" },
      { status: 500 }
    );
  }
}
