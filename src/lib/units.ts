export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "volume"
  | "area"
  | "speed"
  | "time"
  | "data"
  | "cooking"
  | "currency"
  | "energy"
  | "pressure"
  | "power"
  | "angle"
  | "fuel";

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
  currency:    { label: "Currency",    base: "usd", emoji: "💱" },
  energy:      { label: "Energy",      base: "j",   emoji: "⚡" },
  pressure:    { label: "Pressure",    base: "pa",  emoji: "🔵" },
  power:       { label: "Power",       base: "w",   emoji: "💡" },
  angle:       { label: "Angle",       base: "deg", emoji: "📐" },
  fuel:        { label: "Fuel Economy", base: "lp100km", emoji: "⛽" },
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
  // Currency units — toBase values are placeholder 1.0; live rates are fetched via Frankfurter API
  currency: [
    { value: "usd", label: "US Dollar",          symbol: "USD", toBase: 1 },
    { value: "eur", label: "Euro",               symbol: "EUR", toBase: 1 },
    { value: "gbp", label: "British Pound",      symbol: "GBP", toBase: 1 },
    { value: "jpy", label: "Japanese Yen",       symbol: "JPY", toBase: 1 },
    { value: "cad", label: "Canadian Dollar",    symbol: "CAD", toBase: 1 },
    { value: "aud", label: "Australian Dollar",  symbol: "AUD", toBase: 1 },
    { value: "chf", label: "Swiss Franc",        symbol: "CHF", toBase: 1 },
    { value: "cny", label: "Chinese Yuan",       symbol: "CNY", toBase: 1 },
    { value: "inr", label: "Indian Rupee",       symbol: "INR", toBase: 1 },
    { value: "mxn", label: "Mexican Peso",       symbol: "MXN", toBase: 1 },
    { value: "brl", label: "Brazilian Real",     symbol: "BRL", toBase: 1 },
    { value: "krw", label: "South Korean Won",   symbol: "KRW", toBase: 1 },
    { value: "sgd", label: "Singapore Dollar",   symbol: "SGD", toBase: 1 },
    { value: "hkd", label: "Hong Kong Dollar",   symbol: "HKD", toBase: 1 },
    { value: "nok", label: "Norwegian Krone",    symbol: "NOK", toBase: 1 },
    { value: "sek", label: "Swedish Krona",      symbol: "SEK", toBase: 1 },
    { value: "dkk", label: "Danish Krone",       symbol: "DKK", toBase: 1 },
    { value: "pln", label: "Polish Zloty",       symbol: "PLN", toBase: 1 },
    { value: "try", label: "Turkish Lira",       symbol: "TRY", toBase: 1 },
    { value: "zar", label: "South African Rand", symbol: "ZAR", toBase: 1 },
  ],
  // Energy — base: joule (j)
  energy: [
    { value: "j",    label: "Joules",            symbol: "J",    toBase: 1 },
    { value: "kj",   label: "Kilojoules",        symbol: "kJ",   toBase: 1_000 },
    { value: "mj",   label: "Megajoules",        symbol: "MJ",   toBase: 1_000_000 },
    { value: "wh",   label: "Watt-hours",        symbol: "Wh",   toBase: 3_600 },
    { value: "kwh",  label: "Kilowatt-hours",    symbol: "kWh",  toBase: 3_600_000 },
    { value: "cal",  label: "Calories (small)",  symbol: "cal",  toBase: 4.184 },
    { value: "kcal", label: "Kilocalories (kcal)", symbol: "kcal", toBase: 4_184 },
    { value: "btu",  label: "BTU",               symbol: "BTU",  toBase: 1_055.06 },
    { value: "ev",   label: "Electronvolts",     symbol: "eV",   toBase: 1.602176634e-19 },
    { value: "ftlb", label: "Foot-pounds",       symbol: "ft·lb", toBase: 1.35582 },
  ],
  // Pressure — base: pascal (pa)
  pressure: [
    { value: "pa",   label: "Pascals",           symbol: "Pa",   toBase: 1 },
    { value: "hpa",  label: "Hectopascals",      symbol: "hPa",  toBase: 100 },
    { value: "kpa",  label: "Kilopascals",       symbol: "kPa",  toBase: 1_000 },
    { value: "mpa",  label: "Megapascals",       symbol: "MPa",  toBase: 1_000_000 },
    { value: "bar",  label: "Bar",               symbol: "bar",  toBase: 100_000 },
    { value: "mbar", label: "Millibar",          symbol: "mbar", toBase: 100 },
    { value: "psi",  label: "PSI",               symbol: "psi",  toBase: 6_894.757 },
    { value: "atm",  label: "Atmospheres",       symbol: "atm",  toBase: 101_325 },
    { value: "mmhg", label: "mmHg (Torr)",       symbol: "mmHg", toBase: 133.322 },
    { value: "inhg", label: "Inches of mercury", symbol: "inHg", toBase: 3_386.39 },
  ],
  // Power — base: watt (w)
  power: [
    { value: "w",    label: "Watts",             symbol: "W",    toBase: 1 },
    { value: "kw",   label: "Kilowatts",         symbol: "kW",   toBase: 1_000 },
    { value: "mw",   label: "Megawatts",         symbol: "MW",   toBase: 1_000_000 },
    { value: "gw",   label: "Gigawatts",         symbol: "GW",   toBase: 1_000_000_000 },
    { value: "hp",   label: "Horsepower (mech)", symbol: "hp",   toBase: 745.69987 },
    { value: "hpe",  label: "Horsepower (elec)", symbol: "hp(e)",toBase: 746 },
    { value: "btuhr",label: "BTU/hour",          symbol: "BTU/h",toBase: 0.29307107 },
    { value: "cals", label: "Calories/second",   symbol: "cal/s",toBase: 4.184 },
    { value: "ftlbs",label: "Foot-pounds/second",symbol: "ft·lb/s", toBase: 1.35582 },
  ],
  // Angle — base: degree (deg)
  angle: [
    { value: "deg",    label: "Degrees",     symbol: "°",    toBase: 1 },
    { value: "rad",    label: "Radians",     symbol: "rad",  toBase: 180 / Math.PI },
    { value: "grad",   label: "Gradians",    symbol: "grad", toBase: 0.9 },
    { value: "arcmin", label: "Arcminutes",  symbol: "′",    toBase: 1 / 60 },
    { value: "arcsec", label: "Arcseconds",  symbol: "″",    toBase: 1 / 3600 },
    { value: "turn",   label: "Turns",       symbol: "turn", toBase: 360 },
    { value: "mrad",   label: "Milliradians",symbol: "mrad", toBase: 180 / (Math.PI * 1000) },
  ],
  // Fuel economy — base: L/100km (lp100km)
  // NOTE: mpg is inverse of L/100km so needs function converters
  fuel: [
    { value: "lp100km", label: "Liters/100km",    symbol: "L/100km", toBase: 1 },
    { value: "kmpl",    label: "Kilometers/liter", symbol: "km/L",    toBase: (v: number) => 100 / v,   fromBase: (v: number) => 100 / v },
    { value: "mpgus",   label: "MPG (US)",         symbol: "mpg",     toBase: (v: number) => 235.214 / v, fromBase: (v: number) => 235.214 / v },
    { value: "mpguk",   label: "MPG (UK)",         symbol: "mpg(UK)", toBase: (v: number) => 282.481 / v, fromBase: (v: number) => 282.481 / v },
    { value: "mpl",     label: "Miles/liter",      symbol: "mi/L",    toBase: (v: number) => 100 / (v * 1.60934), fromBase: (v: number) => 100 / (v * 1.60934) },
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
