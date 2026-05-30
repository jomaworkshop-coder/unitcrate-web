import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_META, UNITS, type UnitCategory } from "@/lib/units";
import { getPairsByCategory } from "@/data/pairs";
import { MultiConverter } from "@/components/converters/multi-converter";
import { CurrencyConverter } from "@/components/converters/currency-converter";
import { CookingIngredientConverter } from "@/components/converters/cooking-ingredient-converter";
import { fetchFxRates } from "@/lib/currency";

const VALID_CATEGORIES = Object.keys(CATEGORY_META) as UnitCategory[];

export const revalidate = 3600;

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as UnitCategory)) return {};
  const meta = CATEGORY_META[category as UnitCategory];
  const title = `${meta.label} Converter`;
  const description = `Convert between all ${meta.label.toLowerCase()} units instantly. See every unit at once. No signup required.`;
  return {
    title,
    description,
    alternates: { canonical: `https://unitcrate.com/${category}` },
    openGraph: { title, description },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!VALID_CATEGORIES.includes(category as UnitCategory)) notFound();

  const cat = category as UnitCategory;
  const meta = CATEGORY_META[cat];

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${meta.label} Converter`,
    url: `https://unitcrate.com/${category}`,
    description: `Convert between all ${meta.label.toLowerCase()} units instantly.`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  if (cat === "currency") {
    const rates = await fetchFxRates();
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <nav className="mb-6 text-sm text-foreground-muted">
          <Link href="/" className="underline underline-offset-2 hover:text-foreground">UnitCrate</Link>
          {" › "}
          <span>{meta.label}</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
          {meta.emoji} Currency Converter
        </h1>
        <p className="text-foreground-muted mb-8">
          Live exchange rates for 20 major currencies. Rates from the European Central Bank, updated daily.
        </p>
        <CurrencyConverter rates={rates} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </div>
    );
  }

  const units = UNITS[cat];
  const pairs = getPairsByCategory(cat);

  const pairsByFrom = units.map((u) => ({
    unit: u,
    pairs: pairs.filter((p) => p.fromUnit === u.value),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-sm text-foreground-muted">
        <Link href="/" className="underline underline-offset-2 hover:text-foreground">UnitCrate</Link>
        {" › "}
        <span>{meta.label}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
        {meta.emoji} {meta.label} Converter
      </h1>
      <p className="text-foreground-muted mb-8">
        Convert between all {meta.label.toLowerCase()} units. See every unit at once.
      </p>

      <MultiConverter category={cat} />

      {/* Ingredient-aware cooking section */}
      {cat === "cooking" && (
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">Ingredient weight converter</h2>
          <p className="text-sm text-foreground-muted mb-4">
            Convert cups, tablespoons, and teaspoons to grams or ounces for 20+ common baking ingredients.
          </p>
          <CookingIngredientConverter />
        </section>
      )}

      {/* All pairs grid */}
      {pairs.length > 0 && (
        <section className="mt-14">
          <h2 className="text-lg font-bold mb-6">All {meta.label.toLowerCase()} conversions</h2>
          <div className="space-y-8">
            {pairsByFrom.map(({ unit, pairs: unitPairs }) =>
              unitPairs.length === 0 ? null : (
                <div key={unit.value}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-3">
                    From {unit.label} ({unit.symbol})
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {unitPairs.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/${cat}/${p.slug}`}
                        className="rounded-[4px] border border-ink bg-surface px-3 py-2.5 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      >
                        {p.fromLabel} → {p.toLabel}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
