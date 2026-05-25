export type AppUserType = "client" | "lawyer" | "admin";

export type AIUseCase =
  | "PUBLIC_LEGAL_TRANSLATION"
  | "PUBLIC_QUERY_CATEGORIZATION"
  | "LAWYER_DOCUMENT_SUMMARY"
  | "LAWYER_CITATION_EXTRACTION";

export type SupportedRegionalLanguage =
  | "en"
  | "hi"
  | "ta"
  | "te"
  | "kn"
  | "ml"
  | "mr"
  | "bn"
  | "gu"
  | "pa"
  | "ur";

export type PublicAIRequest = {
  userType: "client";
  useCase: "PUBLIC_LEGAL_TRANSLATION" | "PUBLIC_QUERY_CATEGORIZATION";
  inputText: string;
  outputLanguage: SupportedRegionalLanguage;
  state?: string;
  consentGiven: boolean;
};

export type LawyerAIRequest = {
  userType: "lawyer";
  useCase: "LAWYER_DOCUMENT_SUMMARY" | "LAWYER_CITATION_EXTRACTION";
  channelId: string;
  documentText: string;
  outputLanguage?: SupportedRegionalLanguage;
  preferredProvider?: "deepseek" | "claude";
  consentGiven: boolean;
};

export type AIRouterRequest = PublicAIRequest | LawyerAIRequest;

export type AIRouterResponse = {
  provider: "gemini" | "deepseek" | "claude";
  model: string;
  useCase: AIUseCase;
  result: unknown;
  disclaimer: string;
};
