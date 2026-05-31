import Link from "next/link";
import { ArrowRight, Zap, EyeOff, Infinity as InfinityIcon } from "lucide-react";
import { CATEGORY_META, type UnitCategory } from "@/lib/units";
import { MultiConverter } from "@/components/converters/multi-converter";

const CATEGORIES: UnitCategory[] = [
  "length", "weight", "temperature", "volume", "area", "speed", "time", "data", "cooking", "currency",
  "energy", "pressure", "power", "angle", "fuel",
];

const TOP_PAIRS = [
  { label: "cm → inches", href: "/length/cm-to-in" },
  { label: "kg → lbs", href: "/weight/kg-to-lb" },
  { label: "°C → °F", href: "/temperature/c-to-f" },
  { label: "km → miles", href: "/length/km-to-mi" },
  { label: "m → feet", href: "/length/m-to-ft" },
  { label: "L → gallons", href: "/volume/l-to-gal" },
  { label: "km/h → mph", href: "/speed/kmh-to-mph" },
  { label: "ml → fl oz", href: "/volume/ml-to-floz" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      {/* ── Hero with live converter ──────────────────────────────────── */}
      <section className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1 text-xs font-medium text-foreground-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          See every unit at once — nobody else does this
        </p>
        <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Unit converters for{" "}
          <span className="text-primary">everything</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-foreground-muted">
          Instant, accurate conversions across length, weight, temperature and more.
          No signup. No ads. No limits.
        </p>
      </section>

      <div className="mt-10">
        <MultiConverter category="length" defaultFrom="m" defaultTo="ft" />
      </div>

      {/* Popular conversions */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground-muted">
          Popular conversions
        </h2>
        <div className="flex flex-wrap gap-2">
          {TOP_PAIRS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-border-soft bg-surface px-4 py-2 text-sm font-medium transition-colors [@media(hover:hover)]:hover:border-primary [@media(hover:hover)]:hover:bg-primary [@media(hover:hover)]:hover:text-primary-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Category grid ─────────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground-muted">
          Browse by category
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <Link
                key={cat}
                href={`/${cat}`}
                className="group flex items-center gap-4 rounded-2xl border border-border-soft bg-surface p-5 transition-[transform,box-shadow,border-color] duration-150 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-ink [@media(hover:hover)]:hover:elev-2"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface-muted text-2xl">
                  {meta.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold transition-colors group-hover:text-primary">{meta.label}</p>
                  <p className="text-sm text-foreground-muted">Convert {meta.label.toLowerCase()}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Why UnitCrate ─────────────────────────────────────────────── */}
      <section className="mt-14 grid gap-3 sm:grid-cols-3">
        <Feature icon={<Zap className="h-5 w-5" />} title="Instant">
          Results update as you type. No convert button, no reload.
        </Feature>
        <Feature icon={<EyeOff className="h-5 w-5" />} title="All units at once">
          One value, every unit — see the whole picture, not a single answer.
        </Feature>
        <Feature icon={<InfinityIcon className="h-5 w-5" />} title="Free forever">
          No signup, no ads, no daily limits. Just converters that work.
        </Feature>
      </section>
    </div>
  );
}

function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
        {icon}
      </div>
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-foreground-muted">{children}</p>
    </div>
  );
}
