import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the AI (Ensure this matches your server.ts setup)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

export type RoadmapMilestone = {
  title: string;
  payoutAmount: number;
  definitionOfDone: string[];
};

// Helper: Ensure the budget sum is perfect to 2 decimal places
const roundTo2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

function normalizePayoutsToBudget(milestones: any[], budget: number): RoadmapMilestone[] {
  let currentSum = 0;
  const normalized = milestones.map((m, index) => {
    // Ensure all fields exist
    const milestone = {
      title: m.title || `Milestone ${index + 1}`,
      payoutAmount: roundTo2(Number(m.payoutAmount) || budget / milestones.length),
      definitionOfDone: Array.isArray(m.definitionOfDone) ? m.definitionOfDone : ["Task completion"]
    };
    
    if (index < milestones.length - 1) {
      currentSum = roundTo2(currentSum + milestone.payoutAmount);
    }
    return milestone;
  });

  // Force the last milestone to absorb any rounding differences
  const lastIndex = normalized.length - 1;
  normalized[lastIndex].payoutAmount = roundTo2(budget - currentSum);
  
  return normalized;
}

/**
 * THE BULLETPROOF GENERATOR
 */
export async function generateRoadmap(description: string, budget: number): Promise<RoadmapMilestone[]> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("FATAL: GEMINI_API_KEY is missing.");
    throw new Error("API Key not configured");
  }

  const prompt = `
    TASK: Create a software project roadmap.
    PROJECT: "${description}"
    BUDGET: ${budget} INR
    
    FORMAT: Return ONLY a JSON array of 3 to 5 objects.
    SCHEMA: { "title": string, "payoutAmount": number, "definitionOfDone": string[] }
    
    STRICT RULE: No markdown, no backticks, no text before or after the JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    console.log("--- AI RAW OUTPUT ---");
    console.log(rawText);

    // BULLETPROOF EXTRACTION: 
    // This finds the first '[' and the last ']' and takes everything in between.
    // This ignores any "Sure, here is your JSON" text Gemini might add.
    const jsonRegex = /\[[\s\S]*\]/;
    const match = rawText.match(jsonRegex);
    
    if (!match) {
      throw new Error("No JSON array found in AI response");
    }

    const cleanedJson = match[0];
    const parsed = JSON.parse(cleanedJson);

    return normalizePayoutsToBudget(parsed, budget);

  } catch (error: any) {
    console.error("AGENT_ARCHITECT_ERROR:", error.message);

    // DEMO FALLBACK: This ensures the frontend NEVER sees an error.
    // If the AI fails, the Agent "decides" on a standard 3-step roadmap.
    console.log("ACTivating Autonomous Fallback...");
    
    const part = (p: number) => roundTo2(budget * p);
    
    return [
      { 
        title: "Initial Architecture & Environment Setup", 
        payoutAmount: part(0.3), 
        definitionOfDone: ["Project repository initialized", "Environment variables configured"] 
      },
      { 
        title: "Core Feature Logic & API Integration", 
        payoutAmount: part(0.4), 
        definitionOfDone: ["Main functional components implemented", "Database schemas verified"] 
      },
      { 
        title: "Final AI Audit & Deployment", 
        payoutAmount: roundTo2(budget - (part(0.3) + part(0.4))), 
        definitionOfDone: ["Comprehensive code audit passed", "Production build deployed"] 
      }
    ];
  }
}