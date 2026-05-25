import type { LawyerAIRequest } from "../types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export async function runClaudeForLawyer(payload: LawyerAIRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY environment variable");
  }

  const system = `
You are Nayam Lawyer Workspace AI.
You assist Indian advocates with legal document review.

Rules:
- Return structured JSON only.
- Do not expose chain-of-thought or hidden reasoning.
- Do not invent facts, laws, citations, or case names.
- If citation extraction is requested, extract only citations present in the input text.
- Mark missing details clearly as "not provided".
- Treat the content as confidential legal work-product.
- Include a disclaimer that the advocate must verify everything.
`;

  const userPrompt = `
Use case: ${payload.useCase}
Output language: ${payload.outputLanguage ?? "en"}

Return JSON with:
{
  "facts": string[],
  "parties": string[],
  "dates": string[],
  "legalIssues": string[],
  "citationsFound": string[],
  "missingInformation": string[],
  "advocateReviewChecklist": string[],
  "disclaimer": string
}

Document text:
${payload.documentText}
`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.1,
      system,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude request failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.content?.[0]?.text;

  if (!text) {
    throw new Error("Claude returned an empty response");
  }

  return JSON.parse(text);
}
