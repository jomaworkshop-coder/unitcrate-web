import type { ReactNode } from "react";
import Link from "next/link";
import { convert, type UnitCategory } from "@/lib/units";

// Long-form, hand-written content for the highest-traffic pair pages.
// Rendered by src/app/[category]/[pair]/page.tsx after the worked examples;
// `faqs` are shown with the page's FAQ and added to its FAQPage schema.
// Every number in a table is computed with convert(), never typed by hand.

export type PairGuide = {
  sections: ReactNode;
  faqs: Array<{ question: string; answer: string }>;
};

function round(n: number, dp: number) {
  const f = 10 ** dp;
  return (Math.round(n * f) / f).toLocaleString("en-US", { maximumFractionDigits: dp }).replace(/^-/, "−");
}

const num = (n: number) => String(n).replace(/^-/, "−");

function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 mb-3 text-xl font-bold">{children}</h2>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed text-foreground-muted">{children}</p>;
}

function Table({ head, rows }: { head: [string, string]; rows: Array<[string, string]> }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border-soft bg-surface elev-1">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border-soft bg-surface-muted/50">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b], i) => (
            <tr key={a} className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted/25"}>
              <td className="px-4 py-2.5 tabular-nums text-foreground-muted">{a}</td>
              <td className="px-4 py-2.5 font-semibold tabular-nums">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const linkCls = "font-medium text-primary underline underline-offset-2";

// ── Pounds → kilograms ──────────────────────────────────────────────────────

const kg = (lb: number) => convert(lb, "lb", "kg", "weight" as UnitCategory);
const lbRows = (values: number[], dp = 2): Array<[string, string]> =>
  values.map((v) => [`${num(v)} lb`, `${round(kg(v), dp)} kg`]);

const lbToKg: PairGuide = {
  sections: (
    <>
      <H2>How to convert pounds to kilograms in your head</H2>
      <P>
        Divide the pounds by 2.2. For a quicker version, <strong className="text-foreground">halve the number,
        then take off a tenth of that half</strong>. For 150 lb: half is 75, a tenth of 75 is 7.5, and
        75 − 7.5 = 67.5 kg. The exact answer is {round(kg(150), 2)} kg, so the shortcut is within about 1%.
      </P>
      <P>
        The exact factor is <strong className="text-foreground">1 lb = 0.45359237 kg</strong>. That number is a
        definition, not a measurement: the US, the UK and several Commonwealth countries agreed in 1959 to define the
        international pound in terms of the kilogram. Going the other way, 1 kg ≈ 2.20462 lb.
      </P>

      <H2>Body weight: pounds to kilograms chart</H2>
      <P>Most people converting pounds to kilograms are converting a body weight. Values rounded to one decimal.</P>
      <Table
        head={["Pounds (lb)", "Kilograms (kg)"]}
        rows={lbRows([100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 220, 250, 300], 1)}
      />

      <H2>Small weights and fractions of a pound</H2>
      <P>Useful for recipes, postage and food packaging.</P>
      <Table head={["Pounds (lb)", "Kilograms (kg)"]} rows={lbRows([0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5], 3)} />

      <H2>Pounds and ounces to kilograms</H2>
      <P>
        A weight written as pounds and ounces (common for newborn babies) needs one extra step. There are 16
        ounces in a pound, so turn the ounces into a fraction of a pound first. A baby weighing 7 lb 8 oz is
        7 + 8 ÷ 16 = 7.5 lb, which is {round(kg(7.5), 2)} kg. One ounce on its own is about 28.35 g.
      </P>

      <H2>Where pounds and kilograms meet</H2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-foreground-muted">
        <li>
          <strong className="text-foreground">Gym plates.</strong> A 45 lb plate is {round(kg(45), 2)} kg, while a
          20 kg plate is {round(convert(20, "kg", "lb", "weight"), 2)} lb, so the two are close but not
          interchangeable when you add up a bar.
        </li>
        <li>
          <strong className="text-foreground">Luggage.</strong> Airlines that use pounds usually allow 50 lb for a
          checked bag ({round(kg(50), 1)} kg); those that use kilograms usually allow 23 kg
          ({round(convert(23, "kg", "lb", "weight"), 1)} lb). Check your airline&apos;s own figure.
        </li>
        <li>
          <strong className="text-foreground">UK weights in stone.</strong> In the UK a body weight is often given
          in stone and pounds. One stone is 14 lb, so 11 st 4 lb is 158 lb, or {round(kg(158), 1)} kg. Use the{" "}
          <Link href="/weight/st-to-kg" className={linkCls}>stone to kg converter</Link> for that.
        </li>
      </ul>

      <H2>Common mistakes</H2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-foreground-muted">
        <li>
          <strong className="text-foreground">Multiplying instead of dividing.</strong> A kilogram is heavier
          than a pound, so the number in kilograms is always smaller. 150 lb is about 68 kg, not 330 kg. If your
          answer went up, you used the{" "}
          <Link href="/weight/kg-to-lb" className={linkCls}>kg to lb</Link> direction.
        </li>
        <li>
          <strong className="text-foreground">Reading 7.8 lb as 7 lb 8 oz.</strong> 7.8 lb is 7 lb 12.8 oz.
          Decimal pounds and pounds-and-ounces are different notations.
        </li>
        <li>
          <strong className="text-foreground">Rounding too early.</strong> Using 0.45 instead of 0.4536 is off by
          about 0.8%: roughly 1.1 kg too low on a 300 lb weight. Fine for a rough idea, not for medication or freight.
        </li>
      </ul>
    </>
  ),
  faqs: [
    {
      question: "How many kg is 1 pound?",
      answer: "1 pound is exactly 0.45359237 kg, which is about 0.454 kg or 454 grams.",
    },
    {
      question: "How many pounds are in a kilogram?",
      answer: "1 kilogram is about 2.20462 pounds. For a quick estimate, use 2.2.",
    },
    {
      question: "Are lb and lbs the same?",
      answer:
        "Yes. lb is the standard symbol for pound and lbs is a common informal plural; both mean the same unit. lb comes from the Latin libra, a Roman unit of weight.",
    },
    {
      question: "Is a kilo the same as a kilogram?",
      answer: "Yes. 'Kilo' is everyday shorthand for kilogram, so pounds to kilos and pounds to kg are the same conversion.",
    },
    {
      question: "How do I convert pounds and ounces to kg?",
      answer:
        "Divide the ounces by 16 and add them to the pounds, then multiply by 0.45359237. For example, 7 lb 8 oz = 7.5 lb = 3.40 kg.",
    },
  ],
};

// ── Fahrenheit → Celsius ────────────────────────────────────────────────────

const c = (f: number) => convert(f, "f", "c", "temperature" as UnitCategory);
const fRows = (values: number[], dp = 1): Array<[string, string]> =>
  values.map((v) => [`${num(v)} °F`, `${round(c(v), dp)} °C`]);

const fToC: PairGuide = {
  sections: (
    <>
      <H2>How to convert Fahrenheit to Celsius in your head</H2>
      <P>
        <strong className="text-foreground">Subtract 30, then halve.</strong> 70 °F becomes 40, then 20 °C.
        The exact answer is {round(c(70), 1)} °C. The shortcut is closest for everyday weather (roughly 40–80 °F)
        and drifts further off at the extremes: at 0 °F it gives −15 °C against an exact {round(c(0), 1)} °C.
      </P>
      <P>
        For the exact answer, <strong className="text-foreground">subtract 32, then multiply by 5/9</strong>.
        Taking 100 °F: 100 − 32 = 68, and 68 × 5 ÷ 9 = {round(c(100), 2)} °C.
      </P>

      <H2>Why the formula is &quot;minus 32, times 5/9&quot;</H2>
      <P>
        The two scales put the freezing and boiling points of water at different numbers. Water freezes at
        32 °F (0 °C) and boils at 212 °F (100 °C) at sea level. That is a 180-degree span in Fahrenheit for
        a 100-degree span in Celsius, so one Fahrenheit degree is 100/180 = 5/9 of a Celsius degree. The
        &quot;minus 32&quot; lines up the two zero points first.
      </P>
      <P>
        The scales meet at one point: <strong className="text-foreground">−40 °F is exactly −40 °C</strong>.
      </P>

      <H2>Weather temperatures</H2>
      <Table
        head={["Fahrenheit (°F)", "Celsius (°C)"]}
        rows={fRows([-20, -10, 0, 10, 20, 25, 32, 40, 43, 50, 60, 67, 70, 76, 80, 82, 90, 100, 108, 110])}
      />

      <H2>Body temperature and fever</H2>
      <P>
        98.6 °F converts to exactly 37 °C, though normal body temperature varies from person to person and over
        the day. A reading of 100.4 °F (38 °C) or higher is the threshold commonly used for a fever. This table
        is for converting a reading, not for medical advice.
      </P>
      <Table head={["Fahrenheit (°F)", "Celsius (°C)"]} rows={fRows([96.8, 97.7, 98.6, 99.5, 100.4, 101, 102, 103, 104, 105])} />

      <H2>Oven temperatures</H2>
      <P>
        Recipes rarely use exact conversions. 350 °F is {round(c(350), 1)} °C, but a recipe written in Celsius
        will usually say 180 °C. A fan (convection) oven is commonly set about 20 °C lower than the recipe
        temperature.
      </P>
      <Table head={["Fahrenheit (°F)", "Celsius (°C)"]} rows={fRows([250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500])} />

      <H2>Common mistakes</H2>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-foreground-muted">
        <li>
          <strong className="text-foreground">Multiplying before subtracting.</strong> The 32 must come off
          first. 100 × 5/9 − 32 gives 23.6, but the right answer is {round(c(100), 1)} °C.
        </li>
        <li>
          <strong className="text-foreground">Converting a change in temperature.</strong> A rise of 10 °F is a
          rise of 10 × 5/9 = 5.6 °C. Don&apos;t subtract 32 when you are converting a difference, only a
          reading.
        </li>
        <li>
          <strong className="text-foreground">Using the reverse formula.</strong> Going from Celsius to
          Fahrenheit is × 9/5, then + 32; use the{" "}
          <Link href="/temperature/c-to-f" className={linkCls}>Celsius to Fahrenheit converter</Link> for that
          direction.
        </li>
      </ul>
    </>
  ),
  faqs: [
    {
      question: "What is the formula for Fahrenheit to Celsius?",
      answer: "°C = (°F − 32) × 5/9. Subtract 32 from the Fahrenheit reading, then multiply by 5 and divide by 9.",
    },
    {
      question: "What is 100 °F in Celsius?",
      answer: `100 °F is ${round(c(100), 1)} °C.`,
    },
    {
      question: "What is 350 °F in Celsius for baking?",
      answer: `350 °F is ${round(c(350), 1)} °C. Recipes written in Celsius usually round it to 180 °C.`,
    },
    {
      question: "Is centigrade the same as Celsius?",
      answer:
        "Yes. Centigrade is the older name for the same scale; it was officially renamed Celsius in 1948, after the astronomer Anders Celsius.",
    },
    {
      question: "At what temperature are Fahrenheit and Celsius equal?",
      answer: "At −40. −40 °F and −40 °C are the same temperature.",
    },
  ],
};

export const PAIR_GUIDES: Record<string, PairGuide> = {
  "weight/lb-to-kg": lbToKg,
  "temperature/f-to-c": fToC,
};
