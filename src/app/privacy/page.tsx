import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How UnitCrate collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">Last updated May 30, 2026</p>

      <Section title="Summary">
        UnitCrate is a static unit-converter site. We don&apos;t require you to sign up. The
        values you type into converters stay in your browser — we never receive them.
      </Section>

      <Section title="What we collect">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Google Analytics 4 (GA4).</strong> We use GA4 to understand which pages are
            visited and how long visitors stay. GA4 sets first-party cookies (<code>_ga</code>,{" "}
            <code>_ga_*</code>) to distinguish returning visitors. Data is sent to Google and
            processed under{" "}
            <a className="font-medium underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google&apos;s Privacy Policy
            </a>
            . We have IP anonymization enabled and do not use Google Signals or advertising features.
          </li>
          <li>
            <strong>Vercel Analytics &amp; Speed Insights.</strong> Anonymous, cookieless page-view
            and performance metrics.
          </li>
          <li>Server access logs (IP, user agent, request path) for security and debugging.</li>
          <li>Email address if you submit the contact form.</li>
        </ul>
      </Section>

      <Section title="What we don't collect">
        <ul className="list-disc space-y-1 pl-5">
          <li>The values you enter into any converter (these never leave your browser).</li>
          <li>Cross-site tracking cookies for advertising or profiling.</li>
        </ul>
      </Section>

      <Section title="Cookies">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>GA4 cookies</strong> (<code>_ga</code>, <code>_ga_*</code>) — distinguish
            unique visitors. Expire after 2 years. You can block these via browser settings without
            affecting converter functionality.
          </li>
          <li>
            <strong>Theme preference</strong> — stored in <code>localStorage</code>, not a cookie.
            Used to remember your light/dark mode choice.
          </li>
        </ul>
        We do not use cookies for advertising.
      </Section>

      <Section title="GDPR &amp; your rights">
        If you are in the EU, EEA, or UK, GA4 cookies are set on the basis of legitimate interest
        in understanding site usage. You have the right to access, correct, or delete personal data
        we hold; object to or restrict processing; and lodge a complaint with your local
        data-protection authority. California residents have similar rights under the CCPA. We do
        not sell personal information.
      </Section>

      <Section title="Contact">
        For any privacy request, use our{" "}
        <a className="font-medium underline" href="/contact">
          contact form
        </a>{" "}
        and we&apos;ll respond within 30 days.
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-[var(--color-muted-foreground)]">{children}</div>
    </section>
  );
}
