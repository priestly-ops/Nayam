import type { LawyerAIRequest } from "../types";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export async function runDeepSeekForLawyer(payload: LawyerAIRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY environment variable");
  }

  const systemPrompt = `
You are Nayam Lawyer Workspace AI for Indian advocates.

Rules:
- Return structured JSON only.
- Do not expose chain-of-thought, hidden reasoning, scratchpad, or step-by-step internal reasoning.
- Provide concise conclusions and extraction results only.
- Do not invent facts, laws, case law, or citations.
- Extract citations only if present in the input document.
- Mark missing information as "not provided".
- Treat all content as confidential legal work-product.
- Include an advocate-verification disclaimer.
`;

  const userPrompt = `
Use case: ${payload.useCase}
Output language: ${payload.outputLanguage ?? "en"}

Return JSON with exactly these fields:
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

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-reasoner",
      temperature: 0.1,
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek request failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("DeepSeek returned an empty response");
  }

  return JSON.parse(text);
}
