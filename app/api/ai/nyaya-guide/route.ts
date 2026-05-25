import { NextResponse } from "next/server";
import { routeAI } from "@/lib/ai/router";
import type { PublicAIRequest, SupportedRegionalLanguage } from "@/lib/ai/types";
import { createClient } from "@supabase/supabase-js";

const SUPPORTED_LANGUAGES: SupportedRegionalLanguage[] = [
  "en",
  "hi",
  "ta",
  "te",
  "kn",
  "ml",
  "mr",
  "bn",
  "gu",
  "pa",
  "ur"
];

function createRequestSupabaseClient(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: request.headers.get("Authorization") ?? ""
      }
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const inputText = String(body.inputText ?? "").trim();
    const outputLanguage = String(body.outputLanguage ?? "en") as SupportedRegionalLanguage;
    const state = body.state ? String(body.state) : undefined;
    const consentGiven = Boolean(body.consentGiven);

    if (!inputText || inputText.length < 10) {
      return NextResponse.json(
        { error: "inputText must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (!SUPPORTED_LANGUAGES.includes(outputLanguage)) {
      return NextResponse.json(
        { error: "Unsupported output language." },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: "Consent is required before using Nyaya Guide." },
        { status: 403 }
      );
    }

    const payload: PublicAIRequest = {
      userType: "client",
      useCase: body.useCase === "PUBLIC_QUERY_CATEGORIZATION"
        ? "PUBLIC_QUERY_CATEGORIZATION"
        : "PUBLIC_LEGAL_TRANSLATION",
      inputText,
      outputLanguage,
      state,
      consentGiven
    };

    const aiResponse = await routeAI(payload);

    const supabase = createRequestSupabaseClient(request);

    if (supabase) {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("ai_document_logs").insert({
          actor_user_id: user.id,
          channel_id: null,
          document_id: null,
          log_type: "nyaya_guide",
          input_language: null,
          output_language: outputLanguage,
          prompt_summary: "Public Nyaya Guide explanation and categorization",
          input_text_redacted: inputText.slice(0, 2000),
          output_json: aiResponse.result,
          suggested_legal_category:
            typeof aiResponse.result === "object" && aiResponse.result !== null
              ? String((aiResponse.result as Record<string, unknown>).suggestedCategory ?? "")
              : null,
          model_provider: aiResponse.provider,
          model_name: aiResponse.model,
          consent_given: consentGiven
        });
      }
    }

    return NextResponse.json(aiResponse);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Nyaya Guide request failed.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
