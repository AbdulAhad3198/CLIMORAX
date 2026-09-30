import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, language = 'en', locationName = 'New Delhi', regimeName = 'Monsoon Low Pressure', weatherSummary } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { text: 'GEMINI_API_KEY is not configured in runtime environment secrets.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
You are CLIMORAX Meteorological Intelligence AI, an expert decision-support system built for Smart India Hackathon 2026 Problem Statement 26081 (Hybrid AI-NWP Multi-Model Forecast Blending System).
You assist meteorologists, disaster management authorities, and citizens across India.

Current Context:
- Location: ${locationName}
- Weather Regime: ${regimeName}
- Current Weather Summary: ${JSON.stringify(weatherSummary)}
- Target Response Language: ${language} (Provide the entire response in this requested language or script if non-English e.g., Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, etc.).

Your tone should be authoritative, clear, operational, and reassuring. Focus on providing actionable meteorological insights, risk advisories, model blending explanations (why AI vs NWP vs Ensemble weights were assigned), and safety recommendations.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in CLIMORAX Assistant API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process meteorological query.' },
      { status: 500 }
    );
  }
}
