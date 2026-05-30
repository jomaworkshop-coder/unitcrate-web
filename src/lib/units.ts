export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "volume"
  | "area"
  | "speed"
  | "time"
  | "data"
  | "cooking";

export type UnitDef = {
  value: string;
  label: string;
  symbol: string;
  toBase: number | ((v: number) => number);
  fromBase?: (v: number) => number;
};

export const CATEGORY_META: Record<UnitCategory, { label: string; base: string; emoji: string }> = {
  length:      { label: "Length",      base: "m",   emoji: "📏" },
  weight:      { label: "Weight",      base: "kg",  emoji: "⚖️" },
  temperature: { label: "Temperature", base: "c",   emoji: "🌡️" },
  volume:      { label: "Volume",      base: "l",   emoji: "🧪" },
  area:        { label: "Area",        base: "m2",  emoji: "▭" },
  speed:       { label: "Speed",       base: "ms",  emoji: "💨" },
  time:        { label: "Time",        base: "s",   emoji: "⏱️" },
  data:        { label: "Data",        base: "b",   emoji: "💾" },
  cooking:     { label: "Cooking",     base: "ml",  emoji: "🍳" },
};

export const UNITS: Record<UnitCategory, UnitDef[]> = {
  length: [
    { value: "mm",  label: "Millimeters",  symbol: "mm",  toBase: 0.001 },
    { value: "cm",  label: "Centimeters",  symbol: "cm",  toBase: 0.01 },
    { value: "m",   label: "Meters",       symbol: "m",   toBase: 1 },
    { value: "km",  label: "Kilometers",   symbol: "km",  toBase: 1000 },
    { value: "in",  label: "Inches",       symbol: "in",  toBase: 0.0254 },
    { value: "ft",  label: "Feet",         symbol: "ft",  toBase: 0.3048 },
    { value: "yd",  label: "Yards",        symbol: "yd",  toBase: 0.9144 },
    { value: "mi",  label: "Miles",        symbol: "mi",  toBase: 1609.344 },
    { value: "nmi", label: "Nautical miles", symbol: "nmi", toBase: 1852 },
  ],
  weight: [
    { value: "mg",  label: "Milligrams",   symbol: "mg",  toBase: 0.000001 },
    { value: "g",   label: "Grams",        symbol: "g",   toBase: 0.001 },
    { value: "kg",  label: "Kilograms",    symbol: "kg",  toBase: 1 },
    { value: "t",   label: "Metric tons",  symbol: "t",   toBase: 1000 },
    { value: "oz",  label: "Ounces",       symbol: "oz",  toBase: 0.02834952 },
    { value: "lb",  label: "Pounds",       symbol: "lb",  toBase: 0.45359237 },
    { value: "st",  label: "Stone",        symbol: "st",  toBase: 6.35029318 },
    { value: "lt",  label: "Long tons",    symbol: "LT",  toBase: 1016.0469 },
    { value: "nt",  label: "Short tons",   symbol: "ST",  toBase: 907.18474 },
  ],
  temperature: [
    { value: "c", label: "Celsius",    symbol: "°C", toBase: (v) => v,              fromBase: (v) => v },
    { value: "f", label: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    { value: "k", label: "Kelvin",     symbol: "K",  toBase: (v) => v - 273.15,     fromBase: (v) => v + 273.15 },
    { value: "r", label: "Rankine",    symbol: "°R", toBase: (v) => (v - 491.67) * 5/9, fromBase: (v) => (v + 273.15) * 9/5 },
  ],
  volume: [
    { value: "ml",   label: "Milliliters",       symbol: "ml",  toBase: 0.001 },
    { value: "l",    label: "Liters",            symbol: "L",   toBase: 1 },
    { value: "m3",   label: "Cubic meters",      symbol: "m³",  toBase: 1000 },
    { value: "cm3",  label: "Cubic centimeters", symbol: "cm³", toBase: 0.001 },
    { value: "in3",  label: "Cubic inches",      symbol: "in³", toBase: 0.016387064 },
    { value: "ft3",  label: "Cubic feet",        symbol: "ft³", toBase: 28.316847 },
    { value: "floz", label: "Fluid ounces (US)", symbol: "fl oz", toBase: 0.0295735 },
    { value: "cup",  label: "Cups (US)",         symbol: "cup", toBase: 0.236588 },
    { value: "pt",   label: "Pints (US)",        symbol: "pt",  toBase: 0.473176 },
    { value: "qt",   label: "Quarts (US)",       symbol: "qt",  toBase: 0.946353 },
    { value: "gal",  label: "Gallons (US)",      symbol: "gal", toBase: 3.78541 },
    { value: "igal", label: "Gallons (UK)",      symbol: "gal (UK)", toBase: 4.54609 },
  ],
  area: [
    { value: "mm2",  label: "Square millimeters", symbol: "mm²",  toBase: 0.000001 },
    { value: "cm2",  label: "Square centimeters", symbol: "cm²",  toBase: 0.0001 },
    { value: "m2",   label: "Square meters",      symbol: "m²",   toBase: 1 },
    { value: "km2",  label: "Square kilometers",  symbol: "km²",  toBase: 1_000_000 },
    { value: "ha",   label: "Hectares",           symbol: "ha",   toBase: 10_000 },
    { value: "in2",  label: "Square inches",      symbol: "in²",  toBase: 0.00064516 },
    { value: "ft2",  label: "Square feet",        symbol: "ft²",  toBase: 0.092903 },
    { value: "yd2",  label: "Square yards",       symbol: "yd²",  toBase: 0.836127 },
    { value: "ac",   label: "Acres",              symbol: "ac",   toBase: 4046.8564 },
    { value: "mi2",  label: "Square miles",       symbol: "mi²",  toBase: 2_589_988.11 },
  ],
  speed: [
    { value: "ms",   label: "Meters/second",  symbol: "m/s",  toBase: 1 },
    { value: "kmh",  label: "Kilometers/hour", symbol: "km/h", toBase: 1 / 3.6 },
    { value: "mph",  label: "Miles/hour",     symbol: "mph",  toBase: 0.44704 },
    { value: "fts",  label: "Feet/second",    symbol: "ft/s", toBase: 0.3048 },
    { value: "kn",   label: "Knots",          symbol: "kn",   toBase: 0.514444 },
    { value: "mach", label: "Mach",           symbol: "M",    toBase: 340.29 },
  ],
  time: [
    { value: "ns",  label: "Nanoseconds",  symbol: "ns",  toBase: 1e-9 },
    { value: "us",  label: "Microseconds", symbol: "μs",  toBase: 1e-6 },
    { value: "ms",  label: "Milliseconds", symbol: "ms",  toBase: 0.001 },
    { value: "s",   label: "Seconds",      symbol: "s",   toBase: 1 },
    { value: "min", label: "Minutes",      symbol: "min", toBase: 60 },
    { value: "h",   label: "Hours",        symbol: "h",   toBase: 3600 },
    { value: "d",   label: "Days",         symbol: "d",   toBase: 86400 },
    { value: "wk",  label: "Weeks",        symbol: "wk",  toBase: 604800 },
    { value: "mo",  label: "Months (avg)", symbol: "mo",  toBase: 2629800 },
    { value: "yr",  label: "Years",        symbol: "yr",  toBase: 31557600 },
  ],
  data: [
    { value: "b",   label: "Bytes",      symbol: "B",   toBase: 1 },
    { value: "kb",  label: "Kilobytes",  symbol: "KB",  toBase: 1_000 },
    { value: "mb",  label: "Megabytes",  symbol: "MB",  toBase: 1_000_000 },
    { value: "gb",  label: "Gigabytes",  symbol: "GB",  toBase: 1_000_000_000 },
    { value: "tb",  label: "Terabytes",  symbol: "TB",  toBase: 1e12 },
    { value: "pb",  label: "Petabytes",  symbol: "PB",  toBase: 1e15 },
    { value: "kib", label: "Kibibytes",  symbol: "KiB", toBase: 1024 },
    { value: "mib", label: "Mebibytes",  symbol: "MiB", toBase: 1048576 },
    { value: "gib", label: "Gibibytes",  symbol: "GiB", toBase: 1073741824 },
    { value: "tib", label: "Tebibytes",  symbol: "TiB", toBase: 1099511627776 },
  ],
  cooking: [
    { value: "ml",   label: "Milliliters",  symbol: "ml",   toBase: 1 },
    { value: "tsp",  label: "Teaspoons",    symbol: "tsp",  toBase: 4.92892 },
    { value: "tbsp", label: "Tablespoons",  symbol: "tbsp", toBase: 14.7868 },
    { value: "floz", label: "Fluid ounces", symbol: "fl oz",toBase: 29.5735 },
    { value: "cup",  label: "Cups",         symbol: "cup",  toBase: 236.588 },
    { value: "pt",   label: "Pints",        symbol: "pt",   toBase: 473.176 },
    { value: "qt",   label: "Quarts",       symbol: "qt",   toBase: 946.353 },
    { value: "l",    label: "Liters",       symbol: "L",    toBase: 1000 },
  ],
};

export function convert(value: number, from: string, to: string, category: UnitCategory): number {
  if (!Number.isFinite(value)) return NaN;
  if (from === to) return value;

  const units = UNITS[category];
  const fromDef = units.find((u) => u.value === from);
  const toDef = units.find((u) => u.value === to);
  if (!fromDef || !toDef) return NaN;

  // Convert to base
  const toBaseFn = typeof fromDef.toBase === "function" ? fromDef.toBase : (v: number) => v * (fromDef.toBase as number);
  const inBase = toBaseFn(value);

  // Convert from base
  if (typeof toDef.fromBase === "function") return toDef.fromBase(inBase);
  return inBase / (toDef.toBase as number);
}

export function convertAll(value: number, from: string, category: UnitCategory): { unit: UnitDef; result: number }[] {
  const units = UNITS[category];
  return units.map((u) => ({ unit: u, result: convert(value, from, u.value, category) }));
}

export function getUnit(category: UnitCategory, value: string): UnitDef | undefined {
  return UNITS[category].find((u) => u.value === value);
}
