import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the UnitCrate team.",
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
      <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">
        Found a bug, missing a unit category, or want to suggest a feature? Drop us a line — we
        read everything and typically reply within 1–2 business days.
      </p>

      <div className="mt-10">
        <ContactForm brand="UnitCrate" />
      </div>
    </article>
  );
}
