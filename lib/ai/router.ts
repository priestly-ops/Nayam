import type { AIRouterRequest, AIRouterResponse } from "./types";
import { runGeminiFlash } from "./providers/gemini";
import { runClaudeForLawyer } from "./providers/claude";
import { runDeepSeekForLawyer } from "./providers/deepseek";

const PUBLIC_DISCLAIMER =
  "This is general legal information for awareness only. It is not formal legal advice and does not create an advocate-client relationship. Please consult a qualified advocate for advice specific to your matter.";

const LAWYER_DISCLAIMER =
  "AI-generated output is a draft work-product aid for advocate review only. The advocate must verify all facts, law, citations, and procedural requirements before use.";

export async function routeAI(payload: AIRouterRequest): Promise<AIRouterResponse> {
  if (!payload.consentGiven) {
    throw new Error("Consent is required before AI processing.");
  }

  if (payload.userType === "client") {
    const result = await runGeminiFlash(payload);

    return {
      provider: "gemini",
      model: "gemini-1.5-flash",
      useCase: payload.useCase,
      result,
      disclaimer: PUBLIC_DISCLAIMER
    };
  }

  if (payload.userType === "lawyer") {
    if (payload.preferredProvider === "deepseek") {
      const result = await runDeepSeekForLawyer(payload);

      return {
        provider: "deepseek",
        model: "deepseek-reasoner",
        useCase: payload.useCase,
        result,
        disclaimer: LAWYER_DISCLAIMER
      };
    }

    const result = await runClaudeForLawyer(payload);

    return {
      provider: "claude",
      model: "claude-3-5-sonnet-20241022",
      useCase: payload.useCase,
      result,
      disclaimer: LAWYER_DISCLAIMER
    };
  }

  throw new Error("Unsupported AI request type.");
}
