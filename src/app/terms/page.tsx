import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of UnitCrate.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">Last updated May 30, 2026</p>

      <Section title="Acceptance of terms">
        By accessing or using unitcrate.com, you agree to these terms. If you don&apos;t agree,
        please don&apos;t use the site.
      </Section>

      <Section title="Informational use only">
        UnitCrate&apos;s converters are provided for general informational purposes. While we work
        hard to keep the math correct, results should not be used as the sole basis for
        professional, scientific, or commercial decisions without independent verification.
      </Section>

      <Section title="Currency &amp; live data">
        Currency exchange rates are sourced from the European Central Bank via Frankfurter and
        are updated hourly. Rates may lag real-time market prices. Do not use these rates for
        financial transactions.
      </Section>

      <Section title="Accuracy">
        We strive for accuracy in all conversion factors. If you spot an error, please{" "}
        <a className="font-medium underline" href="/contact">let us know</a>. We are not liable
        for losses arising from inaccurate results.
      </Section>

      <Section title="No warranty">
        The site is provided &quot;as is&quot; without warranties of any kind, express or implied.
        We disclaim liability for any loss arising from use of the site to the maximum extent
        permitted by law.
      </Section>

      <Section title="Acceptable use">
        Don&apos;t scrape, attempt to access non-public areas, or abuse the site&apos;s APIs.
        We may rate-limit or block access for users who violate this section.
      </Section>

      <Section title="Changes">
        We may update these terms. Continued use of the site after a change constitutes
        acceptance of the new terms.
      </Section>

      <Section title="Contact">
        Questions about these terms?{" "}
        <a className="font-medium underline" href="/contact">Contact us</a>.
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
