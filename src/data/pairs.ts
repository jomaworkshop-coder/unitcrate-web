import { UNITS, convert, type UnitCategory } from "@/lib/units";

export type UnitPair = {
  slug: string;
  category: UnitCategory;
  fromUnit: string;
  toUnit: string;
  fromLabel: string;
  toLabel: string;
  fromSymbol: string;
  toSymbol: string;
  formula: string;
  inverseSlug: string;
  popularValues: number[];
  examples: Array<{ from: number; to: number; context?: string }>;
  fromContext: string;
  toContext: string;
};

// Rich overrides for the top 20 money pairs
const OVERRIDES: Partial<Record<string, Omit<UnitPair, "slug" | "category" | "fromUnit" | "toUnit" | "fromLabel" | "toLabel" | "fromSymbol" | "toSymbol" | "inverseSlug">>> = {
  "length/cm-to-in": {
    formula: "cm ÷ 2.54",
    popularValues: [1, 5, 10, 15, 20, 25, 30, 50, 100, 150, 180, 200],
    examples: [
      { from: 2.54, to: 1, context: "1 inch" },
      { from: 30.48, to: 12, context: "1 foot" },
      { from: 180, to: 70.87, context: "Typical adult height" },
      { from: 100, to: 39.37, context: "1 meter" },
    ],
    fromContext: "Centimeters are used worldwide for body measurements, fabric, and everyday small lengths.",
    toContext: "Inches are used in the US and UK for body measurements, screen sizes, and small distances.",
  },
  "length/in-to-cm": {
    formula: "in × 2.54",
    popularValues: [1, 2, 3, 5, 6, 8, 10, 12, 18, 24, 36, 72],
    examples: [
      { from: 1, to: 2.54, context: "1 inch" },
      { from: 12, to: 30.48, context: "1 foot" },
      { from: 36, to: 91.44, context: "1 yard" },
      { from: 70, to: 177.8, context: "Average adult height" },
    ],
    fromContext: "Inches are used in the US and UK for body measurements, screen sizes, and small distances.",
    toContext: "Centimeters are used worldwide for body measurements, fabric, and everyday small lengths.",
  },
  "length/km-to-mi": {
    formula: "km ÷ 1.60934",
    popularValues: [1, 5, 10, 21, 42, 50, 100, 500, 1000],
    examples: [
      { from: 1, to: 0.621, context: "1 km" },
      { from: 10, to: 6.214, context: "10 km race" },
      { from: 42.195, to: 26.22, context: "Marathon" },
      { from: 100, to: 62.14, context: "100 km" },
    ],
    fromContext: "Kilometers are the standard distance unit in most countries, used for road signs and travel.",
    toContext: "Miles are used for road distances in the US, UK, and a handful of other countries.",
  },
  "length/mi-to-km": {
    formula: "mi × 1.60934",
    popularValues: [0.5, 1, 3, 5, 10, 13.1, 26.2, 50, 100, 500],
    examples: [
      { from: 1, to: 1.609, context: "1 mile" },
      { from: 13.1, to: 21.09, context: "Half marathon" },
      { from: 26.2, to: 42.19, context: "Marathon" },
      { from: 100, to: 160.93, context: "Century ride" },
    ],
    fromContext: "Miles are used for road distances in the US, UK, and a handful of other countries.",
    toContext: "Kilometers are the standard distance unit in most countries, used for road signs and travel.",
  },
  "length/m-to-ft": {
    formula: "m × 3.28084",
    popularValues: [0.5, 1, 1.5, 1.8, 2, 3, 5, 10, 20, 50, 100, 1000],
    examples: [
      { from: 1, to: 3.281, context: "1 meter" },
      { from: 1.8, to: 5.906, context: "Average adult height" },
      { from: 100, to: 328.08, context: "100 m sprint" },
      { from: 1000, to: 3280.84, context: "1 km" },
    ],
    fromContext: "Meters are the SI base unit of length, used worldwide in science and everyday measurement.",
    toContext: "Feet are the primary unit of length in the US and UK for heights, room dimensions, and altitude.",
  },
  "length/ft-to-m": {
    formula: "ft × 0.3048",
    popularValues: [1, 2, 3, 5, 5.9, 6, 10, 20, 50, 100, 1000, 5280],
    examples: [
      { from: 1, to: 0.305, context: "1 foot" },
      { from: 5.9, to: 1.798, context: "Average adult height" },
      { from: 10, to: 3.048, context: "10 feet" },
      { from: 5280, to: 1609.34, context: "1 mile" },
    ],
    fromContext: "Feet are the primary unit of length in the US and UK for heights, room dimensions, and altitude.",
    toContext: "Meters are the SI base unit of length, used worldwide in science and everyday measurement.",
  },
  "weight/kg-to-lb": {
    formula: "kg × 2.20462",
    popularValues: [0.5, 1, 2, 5, 10, 25, 50, 70, 80, 100, 150, 200],
    examples: [
      { from: 1, to: 2.205, context: "1 kilogram" },
      { from: 70, to: 154.32, context: "Average adult weight" },
      { from: 100, to: 220.46, context: "100 kg" },
      { from: 2.268, to: 5, context: "5 lb bag of flour" },
    ],
    fromContext: "Kilograms are the SI unit of mass used worldwide for body weight, groceries, and shipping.",
    toContext: "Pounds are the primary weight unit in the US and UK for body weight, food, and cargo.",
  },
  "weight/lb-to-kg": {
    formula: "lb × 0.453592",
    popularValues: [1, 2, 5, 10, 25, 50, 100, 150, 175, 200, 250],
    examples: [
      { from: 1, to: 0.454, context: "1 pound" },
      { from: 150, to: 68.04, context: "150 lb person" },
      { from: 2.205, to: 1, context: "1 kilogram" },
      { from: 100, to: 45.36, context: "100 lb" },
    ],
    fromContext: "Pounds are the primary weight unit in the US and UK for body weight, food, and cargo.",
    toContext: "Kilograms are the SI unit of mass used worldwide for body weight, groceries, and shipping.",
  },
  "weight/g-to-oz": {
    formula: "g × 0.035274",
    popularValues: [1, 5, 10, 25, 50, 100, 200, 250, 500, 1000],
    examples: [
      { from: 28.35, to: 1, context: "1 ounce" },
      { from: 100, to: 3.527, context: "100 grams" },
      { from: 250, to: 8.818, context: "Quarter-pound" },
      { from: 500, to: 17.637, context: "Half kilogram" },
    ],
    fromContext: "Grams are the metric unit for small masses — food nutrition labels, cooking ingredients, gold.",
    toContext: "Ounces are used in the US and UK for food portions, mail weight, and small measurements.",
  },
  "temperature/c-to-f": {
    formula: "(°C × 9/5) + 32",
    popularValues: [-40, -20, -10, 0, 10, 20, 25, 30, 37, 40, 100],
    examples: [
      { from: 0, to: 32, context: "Freezing point of water" },
      { from: 100, to: 212, context: "Boiling point of water" },
      { from: 37, to: 98.6, context: "Human body temperature" },
      { from: 20, to: 68, context: "Comfortable room temperature" },
    ],
    fromContext: "Celsius is used worldwide for everyday temperature — weather, cooking, and science.",
    toContext: "Fahrenheit is used primarily in the United States for weather, cooking, and body temperature.",
  },
  "temperature/f-to-c": {
    formula: "(°F − 32) × 5/9",
    popularValues: [-40, 0, 32, 50, 68, 72, 98.6, 100, 212, 350, 400],
    examples: [
      { from: 32, to: 0, context: "Freezing point of water" },
      { from: 212, to: 100, context: "Boiling point of water" },
      { from: 98.6, to: 37, context: "Human body temperature" },
      { from: 350, to: 176.67, context: "Common oven temperature" },
    ],
    fromContext: "Fahrenheit is used primarily in the United States for weather, cooking, and body temperature.",
    toContext: "Celsius is used worldwide for everyday temperature — weather, cooking, and science.",
  },
  "volume/ml-to-floz": {
    formula: "ml ÷ 29.5735",
    popularValues: [1, 5, 10, 30, 50, 100, 236, 355, 473, 500, 750, 1000],
    examples: [
      { from: 29.57, to: 1, context: "1 fl oz" },
      { from: 236.6, to: 8, context: "1 cup" },
      { from: 355, to: 12, context: "Standard can" },
      { from: 750, to: 25.36, context: "Wine bottle" },
    ],
    fromContext: "Milliliters are the metric unit for liquid volume, used worldwide in medicine and cooking.",
    toContext: "Fluid ounces are used in the US for beverage serving sizes and recipes.",
  },
  "volume/l-to-gal": {
    formula: "L ÷ 3.78541",
    popularValues: [1, 2, 3.785, 5, 10, 20, 50, 100],
    examples: [
      { from: 1, to: 0.264, context: "1 liter" },
      { from: 3.785, to: 1, context: "1 US gallon" },
      { from: 10, to: 2.642, context: "10 liters" },
      { from: 50, to: 13.21, context: "Tank fill" },
    ],
    fromContext: "Liters are the standard metric unit for liquid volume — fuel, beverages, and containers.",
    toContext: "Gallons (US) are used for fuel, containers, and liquid measurement in the United States.",
  },
  "speed/kmh-to-mph": {
    formula: "km/h ÷ 1.60934",
    popularValues: [30, 50, 60, 80, 100, 110, 120, 130, 150, 200, 300],
    examples: [
      { from: 100, to: 62.14, context: "Highway speed" },
      { from: 60, to: 37.28, context: "Urban speed limit" },
      { from: 120, to: 74.56, context: "Autobahn speed" },
      { from: 1000, to: 621.4, context: "Supersonic" },
    ],
    fromContext: "Kilometers per hour are used for vehicle speeds in most countries worldwide.",
    toContext: "Miles per hour are used for vehicle speeds in the US, UK, and a few other countries.",
  },
  "speed/mph-to-kmh": {
    formula: "mph × 1.60934",
    popularValues: [25, 35, 50, 55, 60, 65, 70, 75, 80, 100, 120],
    examples: [
      { from: 60, to: 96.56, context: "Highway speed" },
      { from: 30, to: 48.28, context: "Residential limit" },
      { from: 100, to: 160.93, context: "100 mph" },
      { from: 767, to: 1234.8, context: "Speed of sound" },
    ],
    fromContext: "Miles per hour are used for vehicle speeds in the US, UK, and a few other countries.",
    toContext: "Kilometers per hour are used for vehicle speeds in most countries worldwide.",
  },
  "area/m2-to-ft2": {
    formula: "m² × 10.7639",
    popularValues: [1, 5, 10, 20, 50, 100, 200, 500, 1000],
    examples: [
      { from: 1, to: 10.764, context: "1 m²" },
      { from: 93, to: 1001, context: "Average US home size (m²)" },
      { from: 10, to: 107.64, context: "Small room" },
      { from: 100, to: 1076.4, context: "Large apartment" },
    ],
    fromContext: "Square meters are the SI unit for area, used globally for floor space, land, and surfaces.",
    toContext: "Square feet are used in the US and Canada for property listings and room dimensions.",
  },
  "area/ac-to-m2": {
    formula: "ac × 4046.86",
    popularValues: [0.1, 0.25, 0.5, 1, 2, 5, 10, 100, 640],
    examples: [
      { from: 1, to: 4046.86, context: "1 acre" },
      { from: 0.5, to: 2023.43, context: "Half acre lot" },
      { from: 640, to: 2589988, context: "1 square mile" },
      { from: 2.47, to: 10000, context: "1 hectare" },
    ],
    fromContext: "Acres are used in the US and UK for land area — real estate lots, farms, and parks.",
    toContext: "Square meters are the SI unit for area, used globally for floor space, land, and surfaces.",
  },
};

function buildFormula(fromLabel: string, toLabel: string, factor: number): string {
  if (factor > 1) return `${fromLabel} × ${+factor.toPrecision(6)}`;
  return `${fromLabel} ÷ ${+(1 / factor).toPrecision(6)}`;
}

function buildPopularValues(factor: number): number[] {
  const base = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];
  return base.filter((v) => {
    const result = v * factor;
    return result >= 0.0001 && result <= 1e9;
  });
}

function buildExamples(from: string, to: string, category: UnitCategory): Array<{ from: number; to: number }> {
  const vals = [1, 5, 10, 100];
  return vals.slice(0, 3).map((v) => ({
    from: v,
    to: Math.round(convert(v, from, to, category) * 100000) / 100000,
  }));
}

function toSlug(category: UnitCategory, from: string, to: string) {
  return `${category}/${from}-to-${to}`;
}

function getPairSlug(category: UnitCategory, from: string, to: string) {
  return `${from}-to-${to}`;
}

function generatePairs(category: UnitCategory): UnitPair[] {
  const units = UNITS[category];
  const pairs: UnitPair[] = [];

  for (const fromDef of units) {
    for (const toDef of units) {
      if (fromDef.value === toDef.value) continue;

      const slug = getPairSlug(category, fromDef.value, toDef.value);
      const overrideKey = toSlug(category, fromDef.value, toDef.value);
      const override = OVERRIDES[overrideKey];

      const factor =
        typeof fromDef.toBase === "number" && typeof toDef.toBase === "number"
          ? fromDef.toBase / toDef.toBase
          : null;

      const formula = override?.formula ?? (factor !== null ? buildFormula(fromDef.label, toDef.label, factor) : `Convert ${fromDef.label} to ${toDef.label}`);
      const popularValues = override?.popularValues ?? (factor !== null ? buildPopularValues(factor) : [1, 5, 10, 100]);
      const examples = override?.examples ?? buildExamples(fromDef.value, toDef.value, category);
      const fromContext = override?.fromContext ?? `${fromDef.label} (${fromDef.symbol}) — a unit of ${category}.`;
      const toContext = override?.toContext ?? `${toDef.label} (${toDef.symbol}) — a unit of ${category}.`;

      pairs.push({
        slug,
        category,
        fromUnit: fromDef.value,
        toUnit: toDef.value,
        fromLabel: fromDef.label,
        toLabel: toDef.label,
        fromSymbol: fromDef.symbol,
        toSymbol: toDef.symbol,
        formula,
        inverseSlug: getPairSlug(category, toDef.value, fromDef.value),
        popularValues,
        examples,
        fromContext,
        toContext,
      });
    }
  }

  return pairs;
}

const ALL_CATEGORIES: UnitCategory[] = [
  "length", "weight", "temperature", "volume", "area", "speed", "time", "data", "cooking",
];

export const ALL_PAIRS: UnitPair[] = ALL_CATEGORIES.flatMap(generatePairs);

export function getPairsByCategory(category: UnitCategory): UnitPair[] {
  return ALL_PAIRS.filter((p) => p.category === category);
}

export function getPairBySlug(category: UnitCategory, slug: string): UnitPair | undefined {
  return ALL_PAIRS.find((p) => p.category === category && p.slug === slug);
}

export function getAllStaticParams() {
  return ALL_PAIRS.map((p) => ({ category: p.category, pair: p.slug }));
}
