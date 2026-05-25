import type { PublicAIRequest } from "../types";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function runGeminiFlash(payload: PublicAIRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }

  const prompt = `
You are Nyaya Guide, a public legal literacy assistant for India.

Rules:
- Explain legal terms in simple language.
- Translate into the requested language when asked.
- Categorize the issue broadly.
- Do not give formal legal advice.
- Do not promise outcomes.
- Do not recommend a specific lawyer.
- Route only to objective legal categories.
- Always return valid JSON.

Requested output language: ${payload.outputLanguage}
State context, if provided: ${payload.state ?? "not provided"}
Use case: ${payload.useCase}

Return JSON with:
{
  "plainExplanation": string,
  "importantTerms": [{ "term": string, "simpleMeaning": string }],
  "suggestedCategory": string,
  "urgency": "low" | "medium" | "high",
  "directoryFilters": { "specialization": string, "state": string | null },
  "disclaimer": string
}

User input:
${payload.inputText}
`;

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(text);
}
