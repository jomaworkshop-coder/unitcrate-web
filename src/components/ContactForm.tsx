"use client";

import { useState } from "react";

interface ContactFormProps {
  brand?: string;
  successMessage?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  brand = "UnitCrate",
  successMessage = "Thanks for reaching out. We typically reply within 1-2 business days.",
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus("error");
      setErrorMsg("Form is not configured. Please email us directly.");
      return;
    }

    formData.append("access_key", accessKey);
    formData.append("from_name", brand);
    formData.append("subject", `New ${brand} contact form submission`);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        formEl.reset();

        if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
          (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "contact_form_submit", {
            brand,
            topic: formData.get("topic") || "unspecified",
          });
        }
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again or email us directly.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center"
      >
        <h2 className="text-xl font-semibold">Message sent ✓</h2>
        <p className="mt-2 text-[var(--color-muted-foreground)]">{successMessage}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm underline text-[var(--color-muted-foreground)]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
    >
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            autoComplete="name"
            className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            autoComplete="email"
            className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="block text-sm font-medium">
          Topic <span className="text-red-500">*</span>
        </label>
        <select
          name="topic"
          id="topic"
          required
          defaultValue=""
          className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="" disabled>Select a topic...</option>
          <option value="bug">Bug report</option>
          <option value="feature">Converter / feature request</option>
          <option value="partnership">Partnership</option>
          <option value="press">Press / Media</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          id="message"
          rows={5}
          required
          minLength={10}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] hover:opacity-90 disabled:opacity-50 transition"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
