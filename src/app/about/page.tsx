import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UnitCrate",
  description: "UnitCrate makes the fastest, most complete unit converters on the web. See every unit at once — no dropdowns, no friction.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About UnitCrate</h1>
      <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">
        UnitCrate is a unit conversion tool built for people who hate clicking through dropdown menus.
        Type a value, see every equivalent unit instantly — no dropdowns, no page reloads, no ads.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">What we believe</h2>
      <ul className="mt-4 space-y-3 text-[var(--color-muted-foreground)]">
        <li>
          <strong className="text-[var(--color-foreground)]">Show everything at once.</strong> Most
          converters make you pick a target unit from a dropdown. We show all units simultaneously —
          so you can compare at a glance.
        </li>
        <li>
          <strong className="text-[var(--color-foreground)]">Speed is a feature.</strong> Every
          page is statically generated. No spinners, no interstitials, no sign-up gates before
          you get a result.
        </li>
        <li>
          <strong className="text-[var(--color-foreground)]">Live data where it matters.</strong>{" "}
          Currency conversions pull live rates from the ECB via Frankfurter. Cooking ingredient
          conversions use real density tables, not guesses.
        </li>
        <li>
          <strong className="text-[var(--color-foreground)]">No clutter.</strong> We don't run
          display ads. We don't upsell premium tiers. The tool is free because it should be.
        </li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">What we cover</h2>
      <p className="mt-4 text-[var(--color-muted-foreground)]">
        Length, weight, temperature, volume, area, speed, time, data storage, pressure, energy —
        plus currency (20+ currencies, live rates) and cooking ingredient conversions by weight and
        volume. More categories are added regularly.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Part of a broader toolkit</h2>
      <p className="mt-4 text-[var(--color-muted-foreground)]">
        UnitCrate is part of a family of utility sites. If you need financial calculators, check out{" "}
        <a className="font-medium text-[var(--color-foreground)] underline" href="https://kalkfin.com" target="_blank" rel="noopener noreferrer">Kalkfin</a>.
        For everyday calculators and converters, try{" "}
        <a className="font-medium text-[var(--color-foreground)] underline" href="https://kalkmate.com" target="_blank" rel="noopener noreferrer">Kalkmate</a>.
        For health and fitness calculators, visit{" "}
        <a className="font-medium text-[var(--color-foreground)] underline" href="https://vitamath.io" target="_blank" rel="noopener noreferrer">VitaMath</a>.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Get in touch</h2>
      <p className="mt-4 text-[var(--color-muted-foreground)]">
        Spotted a missing unit? Found a bug? Have a suggestion?{" "}
        <a className="font-medium text-[var(--color-foreground)] underline" href="/contact">
          Contact us
        </a>{" "}
        — we read everything.
      </p>
    </article>
  );
}
