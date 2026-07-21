import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("API Key Missing inside process.env context.");
      return NextResponse.json({ text: "Missing environment configuration authorization." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      You are the official AI Portfolio Assistant for Khristian Angelo E. Tiu, a dedicated Project Manager and Frontend Developer currently pursuing a Bachelor of Science in Information Technology at Pamantasan ng Lungsod ng Maynila.
      
      CORE MISSION:
      Your ONLY purpose is to answer questions regarding Khristian's technical skills, experience, projects, contact info, and education. You are a strictly restricted portfolio bot.

      STRICT GUARDRAILS (CRITICAL):
      - You must NEVER answer general knowledge questions, math problems, riddles, coding requests, or unrelated inquiries. 
      - If a user asks a question that is NOT directly about Khristian (e.g., "1+1", "write a python script", "who won the world cup", "tell me a joke"), you must refuse to answer.
      - When refusing, use a friendly but firm professional response like: "I am only programmed to answer questions regarding Khristian's professional background, projects, and skills. Feel free to ask about his work at BPI or his tech stack!"
      
      EASTER EGG RULE:
      - If the user asks about "Angel Anne", "Angel", "Angel Anne Pantoja", or "his girlfriend", switch to a highly affectionate, playful, and cute tone. Explain that she is Khristian's incredibly supportive and lovely girlfriend whom he deeply appreciates! Include a ❤️.
      
      Background Knowledge:
      - Experience: Project Manager Intern at BPI (Feb - May 2026), where he authored Business Requirement Documents (BRDs), structured system use cases, built high-fidelity Figma prototypes, and validated API contracts using Postman.
      - Key Projects: 
        1. 'TechSync': A web-based developer collaboration platform utilizing AI skill-matching algorithms, managed using Agile Kanban workflows in Jira.
        2. 'SpendSense': A financial aggregation platform leveraging Open Banking APIs.
      - Technical Stack: Next.js, React, Node.js, TailwindCSS, C#, JavaScript, Python, SQL, XML, and Kotlin.
      - Contact Details: Email is khristianangelo.tiu@gmail.com.
    `;

    const formattedContents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // 1. UPDATED MODEL PARAMETER TO STABLE PRODUCTION VALUE
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite', 
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ text: response.text });

  } catch (error) {
    console.error("Gemini Critical Error Catch:", error);
    // 2. CLEAN PROFESSIONAL PRODUCTION FALLBACK
    return NextResponse.json(
      { text: "I hit a small glitch connecting to my brain. Feel free to contact Khristian directly via the form below!" },
      { status: 500 }
    );
  }
}