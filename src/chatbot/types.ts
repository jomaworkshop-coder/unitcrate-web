/**
 * Shared types for @kalk/chatbot.
 *
 * Each consuming site (kalkfin, kalkmate, vitamath, unitcrate) provides:
 *  - ChatUIConfig: branding + UX text rendered in the widget
 *  - ChatServerConfig: system prompt, model, and Gemini API key env name
 *
 * The two are intentionally split so the widget (client component) never
 * imports the system prompt (server-only).
 */

export interface ChatUIConfig {
  /** "Kalkfin" | "Kalkmate" | "Vitamath" | "Unitcrate" */
  siteName: string;
  /** Single capital letter shown in the round avatar bubble (e.g. "K", "V", "U") */
  brandLetter: string;
  /** Powered-by tagline, e.g. "Powered by Gemma" */
  poweredBy: string;
  /** Input placeholder, e.g. "Ask about mortgages, loans, rates..." */
  placeholder: string;
  /** Footer disclaimer below the input */
  disclaimer: string;
  /** 3 suggestion chips shown when the chat is empty */
  quickPrompts: [string, string, string];
  /** ARIA label for the dialog */
  ariaLabel?: string;
  /**
   * Bare domain (no protocol, no www) for THIS site — e.g. "kalkfin.com",
   * "vitamath.io", "unitcrate.com". Used by the link renderer to decide
   * whether a URL the model emits is internal (rendered as a Next <Link>)
   * or external (rendered as <a target="_blank">).
   *
   * Stored as a string (not a RegExp) so it crosses the React Server → Client
   * Component boundary cleanly. ChatWidget builds the regex internally.
   */
  internalDomain: string;
  /** API route the widget POSTs to. Defaults to "/api/chat". */
  apiRoute?: string;
}

export interface ChatServerConfig {
  /** Full system prompt — site-specific calculator catalog, rules, glossary, etc. */
  systemPrompt: string;
  /** Gemini model id. Defaults to "gemma-4-31b-it" (current kalkfin choice). */
  model?: string;
  /** Env var that holds the Google AI API key. Defaults to "GOOGLE_AI_API_KEY". */
  apiKeyEnv?: string;
  /** Generation config. Sensible defaults applied. */
  generation?: {
    maxOutputTokens?: number;
    temperature?: number;
    topP?: number;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
