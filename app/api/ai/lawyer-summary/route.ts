import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { routeAI } from "@/lib/ai/router";
import type { LawyerAIRequest } from "@/lib/ai/types";

function createRequestSupabaseClient(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing.");
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
    const supabase = createRequestSupabaseClient(request);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const channelId = String(body.channelId ?? "");
    const documentText = String(body.documentText ?? "").trim();
    const consentGiven = Boolean(body.consentGiven);

    if (!channelId) {
      return NextResponse.json(
        { error: "channelId is required." },
        { status: 400 }
      );
    }

    if (!documentText || documentText.length < 50) {
      return NextResponse.json(
        { error: "documentText must be at least 50 characters." },
        { status: 400 }
      );
    }

    if (!consentGiven) {
      return NextResponse.json(
        { error: "Consent is required before AI processing." },
        { status: 403 }
      );
    }

    const { data: channel } = await supabase
      .from("consultation_channels")
      .select("id, lawyer_user_id")
      .eq("id", channelId)
      .single();

    if (!channel) {
      return NextResponse.json(
        { error: "Consultation channel not found." },
        { status: 404 }
      );
    }

    if (channel.lawyer_user_id !== user.id) {
      return NextResponse.json(
        { error: "Only the assigned lawyer can use this workspace." },
        { status: 403 }
      );
    }

    const payload: LawyerAIRequest = {
      userType: "lawyer",
      useCase:
        body.useCase === "LAWYER_CITATION_EXTRACTION"
          ? "LAWYER_CITATION_EXTRACTION"
          : "LAWYER_DOCUMENT_SUMMARY",
      channelId,
      documentText,
      outputLanguage: body.outputLanguage ?? "en",
      preferredProvider:
        body.preferredProvider === "deepseek"
          ? "deepseek"
          : "claude",
      consentGiven
    };

    const aiResponse = await routeAI(payload);

    await supabase.from("ai_document_logs").insert({
      actor_user_id: user.id,
      channel_id: channelId,
      document_id: null,
      log_type:
        payload.useCase === "LAWYER_CITATION_EXTRACTION"
          ? "lawyer_document_points"
          : "lawyer_case_summary",
      input_language: "unknown",
      output_language: payload.outputLanguage ?? "en",
      prompt_summary: payload.useCase,
      input_text_redacted: documentText.slice(0, 2000),
      output_json: aiResponse.result,
      suggested_legal_category: null,
      model_provider: aiResponse.provider,
      model_name: aiResponse.model,
      consent_given: consentGiven
    });

    return NextResponse.json(aiResponse);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Lawyer AI request failed.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
