// g per ml density for common baking/cooking ingredients
export type Ingredient = {
  value: string;
  label: string;
  gPerMl: number;
  note?: string;
};

export const INGREDIENTS: Ingredient[] = [
  { value: "water",           label: "Water",                  gPerMl: 1.000 },
  { value: "milk",            label: "Milk (whole)",           gPerMl: 1.030 },
  { value: "flour-ap",        label: "All-purpose flour",      gPerMl: 0.593, note: "scooped & leveled" },
  { value: "flour-bread",     label: "Bread flour",            gPerMl: 0.529 },
  { value: "flour-cake",      label: "Cake flour",             gPerMl: 0.459 },
  { value: "sugar-white",     label: "Sugar (granulated)",     gPerMl: 0.845 },
  { value: "sugar-brown",     label: "Brown sugar (packed)",   gPerMl: 0.865 },
  { value: "sugar-powdered",  label: "Powdered sugar",         gPerMl: 0.593, note: "unsifted" },
  { value: "butter",          label: "Butter",                 gPerMl: 0.911, note: "softened" },
  { value: "oil-vegetable",   label: "Vegetable oil",          gPerMl: 0.920 },
  { value: "oil-olive",       label: "Olive oil",              gPerMl: 0.915 },
  { value: "honey",           label: "Honey",                  gPerMl: 1.420 },
  { value: "maple-syrup",     label: "Maple syrup",            gPerMl: 1.330 },
  { value: "cocoa",           label: "Cocoa powder",           gPerMl: 0.529, note: "unsweetened" },
  { value: "oats",            label: "Rolled oats",            gPerMl: 0.345 },
  { value: "rice",            label: "White rice (uncooked)",  gPerMl: 0.858 },
  { value: "salt",            label: "Salt (table)",           gPerMl: 1.217 },
  { value: "baking-powder",   label: "Baking powder",          gPerMl: 0.854 },
  { value: "baking-soda",     label: "Baking soda",            gPerMl: 0.964 },
  { value: "cornstarch",      label: "Cornstarch",             gPerMl: 0.608 },
  { value: "cream-heavy",     label: "Heavy cream",            gPerMl: 1.005 },
  { value: "yogurt",          label: "Yogurt (plain)",         gPerMl: 1.050 },
];

// ml values for common cooking volume units
const ML_PER_UNIT: Record<string, number> = {
  ml:   1,
  tsp:  4.92892,
  tbsp: 14.7868,
  floz: 29.5735,
  cup:  236.588,
  pt:   473.176,
  qt:   946.353,
  l:    1000,
};

export const COOKING_VOLUME_UNITS = [
  { value: "cup",  label: "Cups",          symbol: "cup" },
  { value: "tbsp", label: "Tablespoons",   symbol: "tbsp" },
  { value: "tsp",  label: "Teaspoons",     symbol: "tsp" },
  { value: "ml",   label: "Milliliters",   symbol: "ml" },
  { value: "l",    label: "Liters",        symbol: "L" },
  { value: "floz", label: "Fluid ounces",  symbol: "fl oz" },
];

export function volumeToGrams(amount: number, unit: string, ingredient: Ingredient): number {
  const ml = amount * (ML_PER_UNIT[unit] ?? 1);
  return ml * ingredient.gPerMl;
}

export function gramsToVolume(grams: number, unit: string, ingredient: Ingredient): number {
  const ml = grams / ingredient.gPerMl;
  return ml / (ML_PER_UNIT[unit] ?? 1);
}

export function getIngredient(value: string): Ingredient | undefined {
  return INGREDIENTS.find((i) => i.value === value);
}
