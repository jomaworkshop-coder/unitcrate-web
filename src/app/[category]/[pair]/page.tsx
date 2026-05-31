import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_META, convert, type UnitCategory } from "@/lib/units";
import { getPairBySlug, getAllStaticParams, getPairsByCategory, type UnitPair } from "@/data/pairs";
import { MultiConverter } from "@/components/converters/multi-converter";
import { CurrencyConverter } from "@/components/converters/currency-converter";
import { fetchFxRates, parseCurrencySlug, convertCurrency, formatCurrency } from "@/lib/currency";

const VALID_CATEGORIES = Object.keys(CATEGORY_META) as UnitCategory[];

export function generateStaticParams() {
  return getAllStaticParams();
}

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; pair: string }>;
}): Promise<Metadata> {
  const { category, pair } = await params;
  if (!VALID_CATEGORIES.includes(category as UnitCategory)) return {};

  // Currency pair metadata
  if (category === "currency") {
    const parsed = parseCurrencySlug(pair);
    if (!parsed) return {};
    const fromCode = parsed.from.toUpperCase();
    const toCode = parsed.to.toUpperCase();
    const title = `${fromCode} to ${toCode} — Live Exchange Rate Converter`;
    const description = `Convert ${fromCode} to ${toCode} with live ECB exchange rates. See all 20 major currency rates at once.`;
    return { title, description, alternates: { canonical: `https://unitcrate.com/currency/${pair}` }, openGraph: { title, description } };
  }

  const data = getPairBySlug(category as UnitCategory, pair);
  if (!data) return {};

  const title = `${data.fromLabel} to ${data.toLabel} Converter (${data.fromSymbol} → ${data.toSymbol})`;
  const description = `Convert ${data.fromLabel} to ${data.toLabel} instantly. Formula: ${data.formula}. See all ${CATEGORY_META[data.category].label.toLowerCase()} units at once.`;
  return {
    title,
    description,
    alternates: { canonical: `https://unitcrate.com/${category}/${pair}` },
    openGraph: { title, description },
  };
}

export default async function PairPage({
  params,
}: {
  params: Promise<{ category: string; pair: string }>;
}) {
  const { category, pair } = await params;
  if (!VALID_CATEGORIES.includes(category as UnitCategory)) notFound();

  const cat = category as UnitCategory;

  // Currency pair page
  if (cat === "currency") {
    const parsed = parseCurrencySlug(pair);
    if (!parsed) notFound();
    const rates = await fetchFxRates();
    const fromCode = parsed.from.toUpperCase();
    const toCode = parsed.to.toUpperCase();
    if (!rates.rates[fromCode] || !rates.rates[toCode]) notFound();

    const CURRENCY_NAMES: Record<string, string> = {
      USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
      CAD: "Canadian Dollar", AUD: "Australian Dollar", CHF: "Swiss Franc",
      CNY: "Chinese Yuan", INR: "Indian Rupee", MXN: "Mexican Peso",
      BRL: "Brazilian Real", KRW: "South Korean Won", SGD: "Singapore Dollar",
      HKD: "Hong Kong Dollar", NOK: "Norwegian Krone", SEK: "Swedish Krona",
      DKK: "Danish Krone", PLN: "Polish Złoty", TRY: "Turkish Lira", ZAR: "South African Rand",
    };
    const fromName = CURRENCY_NAMES[fromCode] ?? fromCode;
    const toName = CURRENCY_NAMES[toCode] ?? toCode;
    const rate = convertCurrency(1, fromCode, toCode, rates.rates);
    const inverseRate = convertCurrency(1, toCode, fromCode, rates.rates);
    const SAMPLE_VALUES = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

    const currencySchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "HowTo",
          name: `How to convert ${fromCode} to ${toCode}`,
          description: `Convert ${fromName} (${fromCode}) to ${toName} (${toCode}) using live ECB mid-market rates.`,
          step: [
            {
              "@type": "HowToStep",
              name: "Multiply by the exchange rate",
              text: `${toCode} = ${fromCode} × ${rate.toFixed(6)}`,
            },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `How much is 1 ${fromCode} in ${toCode}?`,
              acceptedAnswer: { "@type": "Answer", text: `1 ${fromCode} = ${formatCurrency(rate, toCode)} ${toCode} (live ECB mid-market rate, updated hourly).` },
            },
            {
              "@type": "Question",
              name: `How do I convert ${fromCode} to ${toCode}?`,
              acceptedAnswer: { "@type": "Answer", text: `Multiply the ${fromCode} amount by the current exchange rate. Today: 1 ${fromCode} = ${formatCurrency(rate, toCode)} ${toCode}.` },
            },
            {
              "@type": "Question",
              name: `What is the ${toCode} to ${fromCode} rate?`,
              acceptedAnswer: { "@type": "Answer", text: `1 ${toCode} = ${formatCurrency(inverseRate, fromCode)} ${fromCode}.` },
            },
          ],
        },
      ],
    };

    return (
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <nav className="mb-6 text-sm text-foreground-muted">
          <Link href="/" className="underline underline-offset-2 hover:text-foreground">UnitCrate</Link>
          {" › "}
          <Link href="/currency" className="underline underline-offset-2 hover:text-foreground">Currency</Link>
          {" › "}
          <span>{fromCode} → {toCode}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
          {fromCode} to {toCode} — {fromName} to {toName}
        </h1>
        <p className="text-foreground-muted mb-8">
          Live ECB mid-market rate · updated hourly · see all 20 major currencies at once.
        </p>

        <CurrencyConverter rates={rates} defaultFrom={parsed.from} defaultTo={parsed.to} />

        {/* Quick reference table */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Common {fromCode} to {toCode} conversions</h2>
          <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface elev-1">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border-soft bg-surface-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">{fromCode}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">{toCode}</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_VALUES.map((v, i) => {
                  const result = convertCurrency(v, fromCode, toCode, rates.rates);
                  return (
                    <tr key={v} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted/25"}>
                      <td className="px-4 py-2.5 tabular-nums text-foreground-muted">{v} {fromCode}</td>
                      <td className="px-4 py-2.5 font-semibold tabular-nums">{formatCurrency(result, toCode)} {toCode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-foreground-muted">Rates: ECB via Frankfurter API · Last updated {rates.date}</p>
        </section>

        {/* Formula */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-3">The formula</h2>
          <div className="rounded-2xl border border-border-soft bg-surface-muted/40 px-5 py-4 font-mono text-lg">
            <span className="text-foreground-muted">{toCode} = </span>
            <span className="font-semibold text-primary">{fromCode} × {rate.toFixed(6)}</span>
          </div>
          <p className="mt-3 text-sm text-foreground-muted">
            To convert back: <strong>{fromCode} = {toCode} × {inverseRate.toFixed(6)}</strong>
          </p>
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">FAQ</h2>
          <div className="space-y-2.5">
            <Faq q={`How much is 1 ${fromCode} in ${toCode}?`}>
              1 {fromCode} = <strong className="text-foreground">{formatCurrency(rate, toCode)} {toCode}</strong> at today&apos;s ECB mid-market rate (updated hourly).
            </Faq>
            <Faq q={`How do I convert ${fromCode} to ${toCode}?`}>
              Multiply your {fromCode} amount by <strong className="text-foreground">{rate.toFixed(6)}</strong>.
              For example, 100 {fromCode} = {formatCurrency(convertCurrency(100, fromCode, toCode, rates.rates), toCode)} {toCode}.
            </Faq>
            <Faq q={`What is the {toCode} to ${fromCode} exchange rate?`}>
              1 {toCode} = <strong className="text-foreground">{formatCurrency(inverseRate, fromCode)} {fromCode}</strong>.
              Use the{" "}
              <Link href={`/currency/${parsed.to}-to-${parsed.from}`} className="font-medium text-primary underline underline-offset-2">
                {toCode} to {fromCode} converter
              </Link>{" "}for the reverse.
            </Faq>
            <Faq q="Are these rates live?">
              Rates come from the European Central Bank (ECB) via the Frankfurter API and are refreshed every hour.
              They reflect mid-market rates — not bank sell/buy spreads. For large transfers, check with your bank or broker.
            </Faq>
          </div>
        </section>

        {/* Related pairs */}
        <section className="mt-10 rounded-2xl border border-border-soft bg-surface-muted/40 p-6">
          <h2 className="text-lg font-bold mb-4">Related conversions</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`/currency/${parsed.to}-to-${parsed.from}`} className="underline underline-offset-2 hover:text-primary">
                ↔ {toCode} to {fromCode}
              </Link>
            </li>
            <li>
              <Link href="/currency" className="underline underline-offset-2 hover:text-primary">
                ↑ All currency conversions
              </Link>
            </li>
          </ul>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(currencySchema) }}
        />
      </article>
    );
  }

  const data = getPairBySlug(cat, pair);
  if (!data) notFound();

  const catMeta = CATEGORY_META[cat];

  const relatedPairs = getPairsByCategory(cat)
    .filter((p) => p.fromUnit === data.fromUnit && p.slug !== data.slug)
    .slice(0, 5);

  const schema = buildSchema(data);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-foreground-muted">
        <Link href="/" className="underline underline-offset-2 hover:text-foreground">UnitCrate</Link>
        {" › "}
        <Link href={`/${cat}`} className="underline underline-offset-2 hover:text-foreground">{catMeta.label}</Link>
        {" › "}
        <span>{data.fromLabel} to {data.toLabel}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
        {data.fromLabel} to {data.toLabel} Converter
      </h1>
      <p className="text-foreground-muted mb-8">
        Convert {data.fromSymbol} to {data.toSymbol} instantly — and see every other {catMeta.label.toLowerCase()} unit at once.
      </p>

      <MultiConverter category={cat} defaultFrom={data.fromUnit} defaultTo={data.toUnit} />

      {/* Quick reference table */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">
          Common {data.fromLabel} to {data.toLabel} conversions
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface elev-1">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-surface-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">{data.fromLabel} ({data.fromSymbol})</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">{data.toLabel} ({data.toSymbol})</th>
              </tr>
            </thead>
            <tbody>
              {data.popularValues.map((v, i) => {
                const result = convert(v, data.fromUnit, data.toUnit, cat);
                const rounded = Math.round(result * 100000) / 100000;
                return (
                  <tr key={v} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted/25"}>
                    <td className="px-4 py-2.5 tabular-nums text-foreground-muted">{v} {data.fromSymbol}</td>
                    <td className="px-4 py-2.5 font-semibold tabular-nums">{rounded} {data.toSymbol}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Formula */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">The formula</h2>
        <div className="rounded-2xl border border-border-soft bg-surface-muted/40 px-5 py-4 font-mono text-lg">
          <span className="text-foreground-muted">{data.toSymbol} = </span>
          <span className="font-semibold text-primary">{data.formula}</span>
        </div>
        <p className="mt-4 text-sm text-foreground-muted">{data.fromContext}</p>
        <p className="mt-2 text-sm text-foreground-muted">{data.toContext}</p>
      </section>

      {/* Worked examples */}
      {data.examples.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Worked examples</h2>
          <div className="space-y-3">
            {data.examples.map((ex, i) => (
              <div key={i} className="rounded-2xl border border-border-soft bg-surface p-5 elev-1">
                <p className="font-semibold tabular-nums">
                  {ex.from} {data.fromSymbol}
                  <span className="mx-1.5 text-primary">→</span>
                  {ex.to} {data.toSymbol}
                  {ex.context && (
                    <span className="ml-2 font-normal text-foreground-muted">— {ex.context}</span>
                  )}
                </p>
                <p className="mt-1.5 text-sm text-foreground-muted">
                  Apply <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-xs">{data.formula}</code> with input = {ex.from}.
                  Result: <strong className="text-foreground">{ex.to} {data.toSymbol}</strong>.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">FAQ</h2>
        <div className="space-y-2.5">
          <Faq q={`How do I convert ${data.fromLabel} to ${data.toLabel}?`}>
            Use the formula: <strong className="text-foreground">{data.toSymbol} = {data.formula}</strong>.
            You can also use the converter above — type any value and the result updates instantly.
          </Faq>
          <Faq q={`Where are ${data.fromLabel} used?`}>{data.fromContext}</Faq>
          <Faq q={`Where are ${data.toLabel} used?`}>{data.toContext}</Faq>
          <Faq q={`How do I convert ${data.toLabel} back to ${data.fromLabel}?`}>
            Use the{" "}
            <Link href={`/${cat}/${data.inverseSlug}`} className="font-medium text-primary underline underline-offset-2">
              {data.toLabel} to {data.fromLabel} converter
            </Link>
            .
          </Faq>
        </div>
      </section>

      {/* Related pairs */}
      <section className="mt-10 rounded-2xl border border-border-soft bg-surface-muted/40 p-6">
        <h2 className="text-lg font-bold mb-4">Related conversions</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href={`/${cat}/${data.inverseSlug}`} className="underline underline-offset-2 hover:text-primary">
              ↔ {data.toLabel} to {data.fromLabel}
            </Link>
          </li>
          {relatedPairs.map((p) => (
            <li key={p.slug}>
              <Link href={`/${cat}/${p.slug}`} className="underline underline-offset-2 hover:text-primary">
                → {data.fromLabel} to {p.toLabel}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/${cat}`} className="underline underline-offset-2 hover:text-primary">
              ↑ All {catMeta.label.toLowerCase()} conversions
            </Link>
          </li>
        </ul>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </article>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-2xl border border-border-soft bg-surface px-5 py-4 transition-colors open:bg-surface-muted/30 [@media(hover:hover)]:hover:border-ink">
      <summary className="flex cursor-pointer items-center justify-between gap-3 font-medium marker:content-['']">
        {q}
        <svg className="h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-200 group-open:rotate-180" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <p className="mt-2.5 text-sm leading-relaxed text-foreground-muted">{children}</p>
    </details>
  );
}

function buildSchema(data: UnitPair) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: `How to convert ${data.fromLabel} to ${data.toLabel}`,
        description: `Convert ${data.fromLabel} (${data.fromSymbol}) to ${data.toLabel} (${data.toSymbol}) using the formula: ${data.formula}.`,
        step: [
          {
            "@type": "HowToStep",
            name: "Apply the formula",
            text: `${data.toLabel} = ${data.formula}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How do I convert ${data.fromLabel} to ${data.toLabel}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Use the formula: ${data.toSymbol} = ${data.formula}.`,
            },
          },
          {
            "@type": "Question",
            name: `Where are ${data.fromLabel} used?`,
            acceptedAnswer: { "@type": "Answer", text: data.fromContext },
          },
        ],
      },
    ],
  };
}
