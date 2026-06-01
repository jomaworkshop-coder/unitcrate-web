"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { MessageCircle } from "lucide-react";
import type { ChatUIConfig } from "./types";

// Heavy chat UI (streaming, markdown, link parsing) is split into ChatPanel and
// only fetched when the user first clicks the trigger. ssr:false is valid here
// because this is a Client Component.
const ChatPanel = dynamic(
  () => import("./ChatPanel").then((m) => m.ChatPanel),
  { ssr: false, loading: () => null }
);

interface ChatWidgetProps {
  config: ChatUIConfig;
}

export function ChatWidget({ config }: ChatWidgetProps) {
  // Interaction gate: nothing but the trigger button hydrates on initial load.
  // No ChatPanel JS executes until the user clicks.
  const [mounted, setMounted] = React.useState(false);

  if (!mounted) {
    return (
      <button
        onClick={() => setMounted(true)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return <ChatPanel config={config} />;
}
