import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_META, convert, type UnitCategory } from "@/lib/units";
import { getPairBySlug, getAllStaticParams, getPairsByCategory, type UnitPair } from "@/data/pairs";
import { MultiConverter } from "@/components/converters/multi-converter";

const VALID_CATEGORIES = Object.keys(CATEGORY_META) as UnitCategory[];

export function generateStaticParams() {
  return getAllStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; pair: string }>;
}): Promise<Metadata> {
  const { category, pair } = await params;
  if (!VALID_CATEGORIES.includes(category as UnitCategory)) return {};
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
        <div className="overflow-hidden rounded-[4px] border border-ink">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink bg-surface-muted/60">
                <th className="px-4 py-3 text-left font-bold">{data.fromLabel} ({data.fromSymbol})</th>
                <th className="px-4 py-3 text-left font-bold">{data.toLabel} ({data.toSymbol})</th>
              </tr>
            </thead>
            <tbody>
              {data.popularValues.map((v, i) => {
                const result = convert(v, data.fromUnit, data.toUnit, cat);
                const rounded = Math.round(result * 100000) / 100000;
                return (
                  <tr key={v} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted/30"}>
                    <td className="px-4 py-2 tabular-nums">{v} {data.fromSymbol}</td>
                    <td className="px-4 py-2 tabular-nums font-medium">{rounded} {data.toSymbol}</td>
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
        <div className="rounded-[4px] border border-ink bg-surface-muted/40 px-4 py-3 font-mono text-lg">
          {data.toSymbol} = {data.formula}
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
              <div key={i} className="rounded-[4px] border border-ink bg-surface p-4">
                <p className="font-bold tabular-nums">
                  {ex.from} {data.fromSymbol} → {ex.to} {data.toSymbol}
                  {ex.context && (
                    <span className="ml-2 font-normal text-foreground-muted">— {ex.context}</span>
                  )}
                </p>
                <p className="mt-1 text-sm text-foreground-muted">
                  Apply <code className="font-mono text-xs bg-surface-muted px-1 rounded">{data.formula}</code> with input = {ex.from}.
                  Result: <strong>{ex.to} {data.toSymbol}</strong>.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">FAQ</h2>
        <div className="space-y-3">
          <details className="rounded-[4px] border border-ink bg-surface p-4">
            <summary className="cursor-pointer font-medium">
              How do I convert {data.fromLabel} to {data.toLabel}?
            </summary>
            <p className="mt-2 text-sm text-foreground-muted">
              Use the formula: <strong>{data.toSymbol} = {data.formula}</strong>.
              You can also use the converter above — type any value and the result updates instantly.
            </p>
          </details>
          <details className="rounded-[4px] border border-ink bg-surface p-4">
            <summary className="cursor-pointer font-medium">
              Where are {data.fromLabel} used?
            </summary>
            <p className="mt-2 text-sm text-foreground-muted">{data.fromContext}</p>
          </details>
          <details className="rounded-[4px] border border-ink bg-surface p-4">
            <summary className="cursor-pointer font-medium">
              Where are {data.toLabel} used?
            </summary>
            <p className="mt-2 text-sm text-foreground-muted">{data.toContext}</p>
          </details>
          <details className="rounded-[4px] border border-ink bg-surface p-4">
            <summary className="cursor-pointer font-medium">
              How do I convert {data.toLabel} back to {data.fromLabel}?
            </summary>
            <p className="mt-2 text-sm text-foreground-muted">
              Use the{" "}
              <Link href={`/${cat}/${data.inverseSlug}`} className="underline underline-offset-2">
                {data.toLabel} to {data.fromLabel} converter
              </Link>
              .
            </p>
          </details>
        </div>
      </section>

      {/* Related pairs */}
      <section className="mt-10 rounded-2xl bg-surface-muted/40 p-6">
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
