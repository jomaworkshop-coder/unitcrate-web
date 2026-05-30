import Link from "next/link";
import { CATEGORY_META, type UnitCategory } from "@/lib/units";

const CATEGORIES: UnitCategory[] = [
  "length", "weight", "temperature", "volume", "area", "speed", "time", "data", "cooking",
];

const TOP_PAIRS = [
  { label: "cm to inches", href: "/length/cm-to-in" },
  { label: "kg to lbs", href: "/weight/kg-to-lb" },
  { label: "°C to °F", href: "/temperature/c-to-f" },
  { label: "km to miles", href: "/length/km-to-mi" },
  { label: "meters to feet", href: "/length/m-to-ft" },
  { label: "lbs to kg", href: "/weight/lb-to-kg" },
  { label: "miles to km", href: "/length/mi-to-km" },
  { label: "°F to °C", href: "/temperature/f-to-c" },
  { label: "L to gallons", href: "/volume/l-to-gal" },
  { label: "km/h to mph", href: "/speed/kmh-to-mph" },
  { label: "ml to fl oz", href: "/volume/ml-to-floz" },
  { label: "acres to m²", href: "/area/ac-to-m2" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Unit Converters for <span className="text-primary">Everything</span>
        </h1>
        <p className="mt-4 text-lg text-foreground-muted max-w-2xl mx-auto">
          Instant, accurate conversions. See all units at once. No signup, no ads, no limits.
        </p>
      </section>

      {/* Category grid */}
      <section className="mb-16">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-5">
          Browse by category
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <Link
                key={cat}
                href={`/${cat}`}
                className="flex items-center gap-4 rounded-2xl border border-ink bg-surface p-5 hover:bg-surface-muted transition-colors group"
              >
                <span className="text-3xl">{meta.emoji}</span>
                <div>
                  <p className="font-bold group-hover:text-primary transition-colors">{meta.label}</p>
                  <p className="text-sm text-foreground-muted">Convert {meta.label.toLowerCase()}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Top pairs */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground-muted mb-5">
          Most popular conversions
        </h2>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {TOP_PAIRS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-[4px] border border-ink bg-surface px-4 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Feature blurb */}
      <section className="mt-16 rounded-2xl bg-primary-soft border border-primary/20 p-8 text-center">
        <h2 className="text-xl font-bold">See all units at once</h2>
        <p className="mt-2 text-foreground-muted">
          Type a value and instantly see the conversion in <strong>every unit</strong> — not just one.
          No other converter does this.
        </p>
      </section>
    </div>
  );
}
