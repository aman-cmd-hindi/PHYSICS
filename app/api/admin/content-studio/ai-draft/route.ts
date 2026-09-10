import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Strict Server-Side Authentication & Authorization Check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 }
      );
    }

    // Verify role is admin or content_manager from database profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const allowedRoles = ["admin", "content_manager", "admin/content_manager"];
    if (!profile || !allowedRoles.includes(profile.role)) {
      return NextResponse.json(
        { error: "Forbidden: Admin or Content Manager role required for AI draft assistant" },
        { status: 403 }
      );
    }

    const { topicTitle, chapterTitle, context } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a draft assistant for Maharashtra State Board Class 12 Physics.
Generate a tentative syllabus DRAFT for:
Chapter: "${chapterTitle}"
Topic: "${topicTitle}"
Context: "${context || "Official Maharashtra Board syllabus"}"

NOTE: This is an internal draft that requires mandatory human review and verification before publishing.
Provide:
1. Summary overview.
2. Key Formulas with symbols, latex, and meanings.
3. Practice MCQs with 4 options, hint, and explanation.
4. Step-by-step numerical derivation example.`;

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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });
    } catch (e) {
      console.warn("Primary model failed, trying fallback:", e);
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

    // Explicitly annotate that this is an unpublished draft requiring human verification
    return NextResponse.json({
      success: true,
      data: {
        ...data,
        status: "DRAFT",
        humanVerified: false,
        requiresHumanReview: true,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Admin Draft Assistant Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate draft content" },
      { status: 500 }
    );
  }
}
