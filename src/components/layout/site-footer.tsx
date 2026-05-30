import Link from "next/link";
import { CATEGORY_META, type UnitCategory } from "@/lib/units";

const CATS: UnitCategory[] = ["length", "weight", "temperature", "volume", "area", "speed", "time", "data", "cooking"];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink bg-surface-muted/30 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <p className="font-bold text-lg">
              <span className="text-primary">Unit</span>Crate
            </p>
            <p className="mt-2 text-sm text-foreground-muted">
              Fast, accurate unit converters. No signup. No ads. No limits.
            </p>
            <div className="mt-4 flex gap-3 text-sm text-foreground-muted">
              <Link href="/about" className="hover:text-foreground underline underline-offset-2">About</Link>
              <Link href="/privacy" className="hover:text-foreground underline underline-offset-2">Privacy</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-3">Converters</p>
            <ul className="space-y-1.5 text-sm">
              {CATS.map((cat) => (
                <li key={cat}>
                  <Link href={`/${cat}`} className="hover:text-primary underline-offset-2 hover:underline text-foreground-muted hover:text-foreground">
                    {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-3">Portfolio</p>
            <ul className="space-y-1.5 text-sm">
              <li><a href="https://kalkmate.com" className="text-foreground-muted hover:text-foreground underline-offset-2 hover:underline">Kalkmate — Calculators</a></li>
              <li><a href="https://kalkfin.com" className="text-foreground-muted hover:text-foreground underline-offset-2 hover:underline">Kalkfin — Finance</a></li>
              <li><a href="https://vitamath.io" className="text-foreground-muted hover:text-foreground underline-offset-2 hover:underline">VitaMath — Health</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-ink pt-6 text-xs text-foreground-muted">
          © {new Date().getFullYear()} UnitCrate. Conversion factors based on SI/NIST definitions.
        </div>
      </div>
    </footer>
  );
}
