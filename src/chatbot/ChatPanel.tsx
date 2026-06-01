"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import type { ChatMessage, ChatUIConfig } from "./types";

interface ChatPanelProps {
  config: ChatUIConfig;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function ChatPanel({ config }: ChatPanelProps) {
  const apiRoute = config.apiRoute ?? "/api/chat";
  const ariaLabel = config.ariaLabel ?? `${config.siteName} AI assistant`;
  // Build the internal-domain regex from the bare-domain string each render.
  // (Strings cross the RSC boundary cleanly; RegExp doesn't.)
  const internalDomainRegex = React.useMemo(
    () => new RegExp(`^(?:www\\.)?${escapeRegex(config.internalDomain)}`, "i"),
    [config.internalDomain]
  );

  // Panel mounts as a result of a user click on the trigger, so it opens immediately.
  const [open, setOpen] = React.useState(true);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const streamReply = async (newMessages: ChatMessage[]) => {
    setLoading(true);
    try {
      const res = await fetch(apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const err = await res
          .json()
          .catch(() => ({ error: "Request failed" }));
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Sorry, something went wrong: ${err.error || "Unknown error"}`,
          },
        ]);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "No response received." },
        ]);
        return;
      }

      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const updated = [...m];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantText,
          };
          return updated;
        });
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    await streamReply(newMessages);
  };

  const quickSend = (text: string) => {
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    streamReply(newMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex w-[380px] max-w-[calc(100vw-2.5rem)] flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
      role="dialog"
      aria-modal="false"
      aria-label={ariaLabel}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-accent)] text-white text-xs font-bold">
            {config.brandLetter}
          </div>
          <div>
            <p className="text-sm font-semibold">{config.siteName} Assistant</p>
            <p className="text-[10px] text-[var(--color-muted)]">
              {config.poweredBy}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="grid h-8 w-8 place-items-center rounded-lg hover:bg-[var(--color-accent-soft)]"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3"
        style={{ maxHeight: "400px", minHeight: "280px" }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <MessageCircle className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold">
              Hi! I&apos;m your {config.siteName} assistant.
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {config.placeholder}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {config.quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => quickSend(q)}
                  className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-muted-foreground)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-foreground)]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--color-accent)] text-white rounded-br-md"
                    : "bg-[var(--color-background)] text-[var(--color-foreground)] border border-[var(--color-border)] rounded-bl-md"
                }`}
              >
                {msg.content ? (
                  <ChatMarkdown
                    text={msg.content}
                    internalDomainRegex={internalDomainRegex}
                  />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-[var(--color-muted)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-border)] px-3 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={config.placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--color-accent)] text-white transition-colors disabled:opacity-40"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="mt-1.5 text-center text-[9px] text-[var(--color-muted)]">
          {config.disclaimer}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Markdown rendering — links, bold, auto-linkify, LaTeX scrub                 */
/* -------------------------------------------------------------------------- */

/** Renders markdown-like text: [links](url), **bold**, auto-linked URLs, line breaks. */
function ChatMarkdown({
  text,
  internalDomainRegex,
}: {
  text: string;
  internalDomainRegex: RegExp;
}) {
  const cleaned = stripLatex(text);
  const lines = cleaned.split("\n");
  return (
    <span>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {li > 0 && <br />}
          {renderInline(line, internalDomainRegex)}
        </React.Fragment>
      ))}
    </span>
  );
}

/** Convert common LaTeX math escapes Gemma sometimes emits into plain Unicode. */
function stripLatex(text: string): string {
  return text
    .replace(/\$\s*\\le\s*\$/g, "≤")
    .replace(/\$\s*\\leq\s*\$/g, "≤")
    .replace(/\$\s*\\ge\s*\$/g, "≥")
    .replace(/\$\s*\\geq\s*\$/g, "≥")
    .replace(/\$\s*\\times\s*\$/g, "×")
    .replace(/\$\s*\\div\s*\$/g, "÷")
    .replace(/\$\s*\\pm\s*\$/g, "±")
    .replace(/\$\s*\\approx\s*\$/g, "≈")
    .replace(/\$\s*\\to\s*\$/g, "→")
    .replace(/\$\s*\\neq\s*\$/g, "≠")
    .replace(/\$\s*\\%\s*\$/g, "%")
    .replace(/\\le(?![a-z])/g, "≤")
    .replace(/\\leq(?![a-z])/g, "≤")
    .replace(/\\ge(?![a-z])/g, "≥")
    .replace(/\\geq(?![a-z])/g, "≥")
    .replace(/\\times(?![a-z])/g, "×")
    .replace(/\\div(?![a-z])/g, "÷")
    .replace(/\\pm(?![a-z])/g, "±")
    .replace(/\\approx(?![a-z])/g, "≈")
    .replace(/\\to(?![a-z])/g, "→")
    .replace(/\\neq(?![a-z])/g, "≠");
}

function renderInline(text: string, internalDomainRegex: RegExp) {
  // Match (in priority order): [text](url), **bold**, bare https URLs,
  // bare known-domain/path, bare /path.
  const parts = text.split(
    /(\[.*?\]\(.*?\)|\*\*.*?\*\*|https?:\/\/[^\s)]+|(?:www\.)?(?:kalkfin\.com|kalkmate\.com|vitamath\.io|unitcrate\.com)\/[A-Za-z0-9/_-]+|(?<![A-Za-z0-9])\/[a-z0-9][A-Za-z0-9/_-]*)/g
  );
  return parts.map((part, i) => {
    // Markdown link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      if (href.startsWith("/")) {
        return (
          <Link
            key={i}
            href={href}
            className="font-medium underline underline-offset-2"
          >
            {label}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2"
        >
          {label}
        </a>
      );
    }
    // Bold: **text** — if the inner content looks like a URL/path, render as a bold link
    if (part.startsWith("**") && part.endsWith("**")) {
      const inner = part.slice(2, -2);
      const boldLinkClass = "font-semibold underline underline-offset-2";
      const linked = linkifyShape(inner, internalDomainRegex, boldLinkClass, `b${i}`);
      if (linked) return linked;
      return (
        <strong key={i} className="font-semibold">
          {inner}
        </strong>
      );
    }
    // Bare URLs / domain paths / root-relative paths
    const linked = linkifyShape(
      part,
      internalDomainRegex,
      "font-medium underline underline-offset-2",
      `p${i}`
    );
    if (linked) return linked;
    return <span key={i}>{part}</span>;
  });
}

/**
 * Detects URL-like shapes and returns the appropriate <Link>/<a> element.
 * Returns null if `text` doesn't look like a URL/path.
 *
 *   - https://… → <a target="_blank">
 *   - {own-domain}/path → <Link href="/path">
 *   - {sister-domain}/path → <a href="https://…" target="_blank">
 *   - /path → <Link href="/path">
 */
function linkifyShape(
  text: string,
  internalDomainRegex: RegExp,
  className: string,
  key: string
): React.ReactElement | null {
  if (/^https?:\/\//.test(text)) {
    return (
      <a
        key={key}
        href={text}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {text}
      </a>
    );
  }
  const domainMatch = text.match(
    /^(?:www\.)?(kalkfin\.com|kalkmate\.com|vitamath\.io|unitcrate\.com)(\/[A-Za-z0-9/_-]+)$/i
  );
  if (domainMatch) {
    if (internalDomainRegex.test(text)) {
      return (
        <Link key={key} href={domainMatch[2]} className={className}>
          {text}
        </Link>
      );
    }
    return (
      <a
        key={key}
        href={`https://${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {text}
      </a>
    );
  }
  if (/^\/[a-z0-9][A-Za-z0-9/_-]*$/.test(text)) {
    return (
      <Link key={key} href={text} className={className}>
        {text}
      </Link>
    );
  }
  return null;
}
