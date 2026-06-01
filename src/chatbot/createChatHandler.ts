import { GoogleGenAI } from "@google/genai";
import type { NextRequest } from "next/server";
import type { ChatMessage, ChatServerConfig } from "./types";

/**
 * Returns a Next.js App Router POST handler for /api/chat.
 *
 * Usage (per site):
 *   // app/api/chat/route.ts
 *   import { createChatHandler } from "@/chatbot/createChatHandler";
 *   import { chatbotServerConfig } from "@/lib/chatbot-config";
 *   export const POST = createChatHandler(chatbotServerConfig);
 */
export function createChatHandler(config: ChatServerConfig) {
  const model = config.model ?? "gemma-4-31b-it";
  const apiKeyEnv = config.apiKeyEnv ?? "GOOGLE_AI_API_KEY";
  const generation = {
    maxOutputTokens: 1024,
    temperature: 0.7,
    topP: 0.9,
    ...config.generation,
  };

  return async function POST(req: NextRequest) {
    const apiKey = process.env[apiKeyEnv];
    if (!apiKey) {
      return Response.json(
        { error: `${apiKeyEnv} is not configured` },
        { status: 500 }
      );
    }

    let payload: { messages?: ChatMessage[] };
    try {
      payload = (await req.json()) as { messages?: ChatMessage[] };
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const messages = payload.messages;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content }],
    }));

    try {
      const response = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: config.systemPrompt,
          maxOutputTokens: generation.maxOutputTokens,
          temperature: generation.temperature,
          topP: generation.topP,
        },
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of response) {
              const text = chunk.text ?? "";
              if (text) controller.enqueue(encoder.encode(text));
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[@kalk/chatbot] Gemini API error:`, message);
      return Response.json({ error: message }, { status: 500 });
    }
  };
}
