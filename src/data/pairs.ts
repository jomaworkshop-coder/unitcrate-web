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
  "length/mm-to-in": {
    formula: "mm ÷ 25.4",
    popularValues: [1, 2, 5, 10, 20, 25, 50, 100, 150, 200, 250, 300],
    examples: [
      { from: 25.4, to: 1, context: "1 inch" },
      { from: 10, to: 0.3937, context: "10 mm" },
      { from: 100, to: 3.937, context: "10 cm" },
      { from: 50, to: 1.9685, context: "50 mm" },
    ],
    fromContext: "Millimeters are the metric unit for small, precise lengths — engineering, manufacturing, and rainfall.",
    toContext: "Inches are used in the US and UK for screen sizes, hardware, and small distances.",
  },
  "length/in-to-mm": {
    formula: "in × 25.4",
    popularValues: [0.25, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 24],
    examples: [
      { from: 1, to: 25.4, context: "1 inch" },
      { from: 0.5, to: 12.7, context: "Half inch" },
      { from: 12, to: 304.8, context: "1 foot" },
      { from: 4, to: 101.6, context: "4 inches" },
    ],
    fromContext: "Inches are used in the US and UK for screen sizes, hardware, and small distances.",
    toContext: "Millimeters are the metric unit for small, precise lengths — engineering, manufacturing, and rainfall.",
  },
  "length/ft-to-in": {
    formula: "ft × 12",
    popularValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20],
    examples: [
      { from: 1, to: 12, context: "1 foot" },
      { from: 5, to: 60, context: "5 ft" },
      { from: 6, to: 72, context: "6 ft" },
      { from: 3, to: 36, context: "1 yard" },
    ],
    fromContext: "Feet are the primary unit of length in the US and UK for heights, room dimensions, and altitude.",
    toContext: "Inches are used in the US and UK for body measurements, screen sizes, and small distances.",
  },
  "length/in-to-ft": {
    formula: "in ÷ 12",
    popularValues: [6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 120],
    examples: [
      { from: 12, to: 1, context: "1 foot" },
      { from: 36, to: 3, context: "1 yard" },
      { from: 72, to: 6, context: "6 feet" },
      { from: 24, to: 2, context: "2 feet" },
    ],
    fromContext: "Inches are used in the US and UK for body measurements, screen sizes, and small distances.",
    toContext: "Feet are the primary unit of length in the US and UK for heights, room dimensions, and altitude.",
  },
  "length/yd-to-m": {
    formula: "yd × 0.9144",
    popularValues: [1, 5, 10, 25, 50, 100, 200, 400, 500, 1000],
    examples: [
      { from: 1, to: 0.9144, context: "1 yard" },
      { from: 100, to: 91.44, context: "100 yd" },
      { from: 50, to: 45.72, context: "50 yd" },
      { from: 10, to: 9.144, context: "10 yd" },
    ],
    fromContext: "Yards are used in the US and UK for sports fields, fabric, and landscaping distances.",
    toContext: "Meters are the SI base unit of length, used worldwide in science and everyday measurement.",
  },
  "length/m-to-yd": {
    formula: "m × 1.09361",
    popularValues: [1, 5, 10, 25, 50, 100, 200, 500, 1000],
    examples: [
      { from: 1, to: 1.0936, context: "1 meter" },
      { from: 100, to: 109.36, context: "100 m" },
      { from: 50, to: 54.68, context: "50 m" },
      { from: 10, to: 10.936, context: "10 m" },
    ],
    fromContext: "Meters are the SI base unit of length, used worldwide in science and everyday measurement.",
    toContext: "Yards are used in the US and UK for sports fields, fabric, and landscaping distances.",
  },
  "weight/oz-to-g": {
    formula: "oz × 28.3495",
    popularValues: [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16],
    examples: [
      { from: 1, to: 28.35, context: "1 ounce" },
      { from: 16, to: 453.59, context: "1 pound" },
      { from: 8, to: 226.8, context: "Half pound" },
      { from: 4, to: 113.4, context: "4 ounces" },
    ],
    fromContext: "Ounces are used in the US and UK for food portions, mail weight, and small measurements.",
    toContext: "Grams are the metric unit for small masses — food nutrition labels, cooking ingredients, gold.",
  },
  "weight/oz-to-lb": {
    formula: "oz ÷ 16",
    popularValues: [1, 2, 4, 8, 12, 16, 24, 32, 48, 64],
    examples: [
      { from: 16, to: 1, context: "1 pound" },
      { from: 8, to: 0.5, context: "Half pound" },
      { from: 32, to: 2, context: "2 pounds" },
      { from: 4, to: 0.25, context: "Quarter pound" },
    ],
    fromContext: "Ounces are used in the US and UK for food portions, mail weight, and small measurements.",
    toContext: "Pounds are the primary weight unit in the US and UK for body weight, food, and cargo.",
  },
  "weight/lb-to-oz": {
    formula: "lb × 16",
    popularValues: [0.25, 0.5, 1, 2, 3, 5, 10, 15, 20, 25],
    examples: [
      { from: 1, to: 16, context: "1 pound" },
      { from: 0.5, to: 8, context: "Half pound" },
      { from: 2, to: 32, context: "2 pounds" },
      { from: 5, to: 80, context: "5 pounds" },
    ],
    fromContext: "Pounds are the primary weight unit in the US and UK for body weight, food, and cargo.",
    toContext: "Ounces are used in the US and UK for food portions, mail weight, and small measurements.",
  },
  "weight/kg-to-st": {
    formula: "kg ÷ 6.35029",
    popularValues: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120],
    examples: [
      { from: 6.35, to: 1, context: "1 stone" },
      { from: 70, to: 11.02, context: "Average adult" },
      { from: 100, to: 15.75, context: "100 kg" },
      { from: 50, to: 7.87, context: "50 kg" },
    ],
    fromContext: "Kilograms are the SI unit of mass used worldwide for body weight, groceries, and shipping.",
    toContext: "Stone is used in the UK and Ireland for body weight — 1 stone = 14 pounds.",
  },
  "weight/st-to-kg": {
    formula: "st × 6.35029",
    popularValues: [1, 5, 8, 10, 11, 12, 13, 14, 15, 20],
    examples: [
      { from: 1, to: 6.35, context: "1 stone" },
      { from: 11, to: 69.85, context: "Average adult" },
      { from: 10, to: 63.5, context: "10 stone" },
      { from: 12, to: 76.2, context: "12 stone" },
    ],
    fromContext: "Stone is used in the UK and Ireland for body weight — 1 stone = 14 pounds.",
    toContext: "Kilograms are the SI unit of mass used worldwide for body weight, groceries, and shipping.",
  },
  "weight/st-to-lb": {
    formula: "st × 14",
    popularValues: [1, 5, 8, 9, 10, 11, 12, 13, 14, 15, 20],
    examples: [
      { from: 1, to: 14, context: "1 stone" },
      { from: 10, to: 140, context: "10 stone" },
      { from: 11, to: 154, context: "11 stone" },
      { from: 12, to: 168, context: "12 stone" },
    ],
    fromContext: "Stone is used in the UK and Ireland for body weight — 1 stone = 14 pounds.",
    toContext: "Pounds are the primary weight unit in the US and UK for body weight, food, and cargo.",
  },
  "temperature/c-to-k": {
    formula: "°C + 273.15",
    popularValues: [-273.15, -100, -40, 0, 20, 25, 37, 100, 500, 1000],
    examples: [
      { from: 0, to: 273.15, context: "Freezing point of water" },
      { from: 100, to: 373.15, context: "Boiling point of water" },
      { from: 25, to: 298.15, context: "Room temperature" },
      { from: -273.15, to: 0, context: "Absolute zero" },
    ],
    fromContext: "Celsius is used worldwide for everyday temperature — weather, cooking, and science.",
    toContext: "Kelvin is the SI base unit of temperature, used in physics and chemistry — it starts at absolute zero.",
  },
  "temperature/k-to-c": {
    formula: "K − 273.15",
    popularValues: [0, 73, 173, 273.15, 298, 310, 373, 500, 1000],
    examples: [
      { from: 273.15, to: 0, context: "Freezing point of water" },
      { from: 373.15, to: 100, context: "Boiling point of water" },
      { from: 0, to: -273.15, context: "Absolute zero" },
      { from: 310, to: 36.85, context: "Human body temperature" },
    ],
    fromContext: "Kelvin is the SI base unit of temperature, used in physics and chemistry — it starts at absolute zero.",
    toContext: "Celsius is used worldwide for everyday temperature — weather, cooking, and science.",
  },
  "volume/floz-to-ml": {
    formula: "fl oz × 29.5735",
    popularValues: [1, 2, 4, 6, 8, 12, 16, 20, 24, 32],
    examples: [
      { from: 1, to: 29.57, context: "1 fl oz" },
      { from: 8, to: 236.6, context: "1 cup" },
      { from: 12, to: 354.9, context: "Standard can" },
      { from: 16, to: 473.2, context: "1 pint" },
    ],
    fromContext: "Fluid ounces are used in the US for beverage serving sizes and recipes.",
    toContext: "Milliliters are the metric unit for liquid volume, used worldwide in medicine and cooking.",
  },
  "volume/gal-to-l": {
    formula: "gal × 3.78541",
    popularValues: [1, 2, 3, 5, 10, 15, 20, 25, 50],
    examples: [
      { from: 1, to: 3.785, context: "1 US gallon" },
      { from: 5, to: 18.93, context: "5 gallons" },
      { from: 10, to: 37.85, context: "Tank fill" },
      { from: 20, to: 75.71, context: "20 gallons" },
    ],
    fromContext: "Gallons (US) are used for fuel, containers, and liquid measurement in the United States.",
    toContext: "Liters are the standard metric unit for liquid volume — fuel, beverages, and containers.",
  },
  "volume/cup-to-ml": {
    formula: "cup × 236.588",
    popularValues: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4],
    examples: [
      { from: 1, to: 236.6, context: "1 cup" },
      { from: 0.5, to: 118.3, context: "Half cup" },
      { from: 2, to: 473.2, context: "2 cups" },
      { from: 0.25, to: 59.15, context: "Quarter cup" },
    ],
    fromContext: "Cups (US) are a common cooking measure in the United States for liquids and dry ingredients.",
    toContext: "Milliliters are the metric unit for liquid volume, used worldwide in medicine and cooking.",
  },
  "volume/ml-to-cup": {
    formula: "ml ÷ 236.588",
    popularValues: [50, 100, 118, 200, 237, 250, 300, 473, 500, 1000],
    examples: [
      { from: 236.6, to: 1, context: "1 cup" },
      { from: 118.3, to: 0.5, context: "Half cup" },
      { from: 500, to: 2.113, context: "500 ml" },
      { from: 250, to: 1.057, context: "250 ml" },
    ],
    fromContext: "Milliliters are the metric unit for liquid volume, used worldwide in medicine and cooking.",
    toContext: "Cups (US) are a common cooking measure in the United States for liquids and dry ingredients.",
  },
  "volume/l-to-ml": {
    formula: "L × 1000",
    popularValues: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5],
    examples: [
      { from: 1, to: 1000, context: "1 liter" },
      { from: 0.5, to: 500, context: "Half liter" },
      { from: 2, to: 2000, context: "2 liters" },
      { from: 1.5, to: 1500, context: "1.5 liters" },
    ],
    fromContext: "Liters are the standard metric unit for liquid volume — fuel, beverages, and containers.",
    toContext: "Milliliters are the metric unit for liquid volume, used worldwide in medicine and cooking.",
  },
  "area/ft2-to-m2": {
    formula: "ft² × 0.092903",
    popularValues: [100, 250, 500, 750, 1000, 1500, 2000, 2500, 3000],
    examples: [
      { from: 1000, to: 92.9, context: "Small apartment" },
      { from: 1500, to: 139.4, context: "1,500 sq ft" },
      { from: 2000, to: 185.8, context: "Average US home" },
      { from: 500, to: 46.45, context: "Studio" },
    ],
    fromContext: "Square feet are used in the US and Canada for property listings and room dimensions.",
    toContext: "Square meters are the SI unit for area, used globally for floor space, land, and surfaces.",
  },
  "area/m2-to-ac": {
    formula: "m² ÷ 4046.86",
    popularValues: [1000, 2000, 4047, 5000, 10000, 20000, 40000, 100000],
    examples: [
      { from: 4046.86, to: 1, context: "1 acre" },
      { from: 10000, to: 2.471, context: "1 hectare" },
      { from: 2023, to: 0.5, context: "Half acre" },
      { from: 40469, to: 10, context: "10 acres" },
    ],
    fromContext: "Square meters are the SI unit for area, used globally for floor space, land, and surfaces.",
    toContext: "Acres are used in the US and UK for land area — real estate lots, farms, and parks.",
  },
  "area/ha-to-ac": {
    formula: "ha × 2.47105",
    popularValues: [0.5, 1, 2, 5, 10, 20, 50, 100],
    examples: [
      { from: 1, to: 2.471, context: "1 hectare" },
      { from: 10, to: 24.71, context: "10 hectares" },
      { from: 0.5, to: 1.236, context: "Half hectare" },
      { from: 100, to: 247.1, context: "100 hectares" },
    ],
    fromContext: "Hectares are the metric unit for land area — 1 hectare = 10,000 m², used for farms and parcels.",
    toContext: "Acres are used in the US and UK for land area — real estate lots, farms, and parks.",
  },
  "area/ac-to-ha": {
    formula: "ac × 0.404686",
    popularValues: [0.25, 0.5, 1, 2, 5, 10, 25, 50, 100],
    examples: [
      { from: 1, to: 0.4047, context: "1 acre" },
      { from: 2.471, to: 1, context: "1 hectare" },
      { from: 10, to: 4.047, context: "10 acres" },
      { from: 5, to: 2.023, context: "5 acres" },
    ],
    fromContext: "Acres are used in the US and UK for land area — real estate lots, farms, and parks.",
    toContext: "Hectares are the metric unit for land area — 1 hectare = 10,000 m², used for farms and parcels.",
  },
  "data/mb-to-gb": {
    formula: "MB ÷ 1000",
    popularValues: [100, 250, 500, 1000, 1500, 2000, 5000, 10000],
    examples: [
      { from: 1000, to: 1, context: "1 GB (decimal)" },
      { from: 500, to: 0.5, context: "500 MB" },
      { from: 5000, to: 5, context: "5 GB" },
      { from: 2048, to: 2.048, context: "2 GiB in MB" },
    ],
    fromContext: "Megabytes measure file and storage size — photos, songs, and app downloads.",
    toContext: "Gigabytes measure larger storage — phone capacity, data plans, and video files (1 GB = 1000 MB decimal).",
  },
  "data/gb-to-mb": {
    formula: "GB × 1000",
    popularValues: [0.5, 1, 2, 4, 8, 16, 32, 64, 128],
    examples: [
      { from: 1, to: 1000, context: "1 GB (decimal)" },
      { from: 0.5, to: 500, context: "500 MB" },
      { from: 16, to: 16000, context: "16 GB" },
      { from: 64, to: 64000, context: "64 GB" },
    ],
    fromContext: "Gigabytes measure larger storage — phone capacity, data plans, and video files (1 GB = 1000 MB decimal).",
    toContext: "Megabytes measure file and storage size — photos, songs, and app downloads.",
  },
  "data/gb-to-tb": {
    formula: "GB ÷ 1000",
    popularValues: [100, 250, 500, 1000, 2000, 4000, 8000],
    examples: [
      { from: 1000, to: 1, context: "1 TB (decimal)" },
      { from: 500, to: 0.5, context: "500 GB drive" },
      { from: 2000, to: 2, context: "2 TB drive" },
      { from: 250, to: 0.25, context: "250 GB SSD" },
    ],
    fromContext: "Gigabytes measure storage — phone capacity, data plans, and video files.",
    toContext: "Terabytes measure large storage — hard drives, NAS, and backups (1 TB = 1000 GB decimal).",
  },
  "data/kb-to-mb": {
    formula: "KB ÷ 1000",
    popularValues: [100, 250, 500, 1000, 2000, 5000, 10000],
    examples: [
      { from: 1000, to: 1, context: "1 MB (decimal)" },
      { from: 500, to: 0.5, context: "500 KB" },
      { from: 5000, to: 5, context: "5 MB" },
      { from: 250, to: 0.25, context: "250 KB" },
    ],
    fromContext: "Kilobytes measure small files — text documents, icons, and email attachments.",
    toContext: "Megabytes measure file and storage size — photos, songs, and app downloads (1 MB = 1000 KB decimal).",
  },
  "cooking/tbsp-to-ml": {
    formula: "tbsp × 14.7868",
    popularValues: [0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12],
    examples: [
      { from: 1, to: 14.79, context: "1 tablespoon" },
      { from: 3, to: 44.36, context: "≈ 1 fl oz" },
      { from: 16, to: 236.6, context: "1 cup" },
      { from: 4, to: 59.15, context: "4 tbsp" },
    ],
    fromContext: "Tablespoons are a common US cooking measure — 1 tbsp = 3 teaspoons.",
    toContext: "Milliliters are the metric unit for liquid volume, used worldwide in cooking and medicine.",
  },
  "cooking/tsp-to-ml": {
    formula: "tsp × 4.92892",
    popularValues: [0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8],
    examples: [
      { from: 1, to: 4.929, context: "1 teaspoon" },
      { from: 3, to: 14.79, context: "1 tablespoon" },
      { from: 0.5, to: 2.464, context: "Half teaspoon" },
      { from: 2, to: 9.858, context: "2 teaspoons" },
    ],
    fromContext: "Teaspoons are the smallest common US cooking measure — used for spices, extracts, and leavening.",
    toContext: "Milliliters are the metric unit for liquid volume, used worldwide in cooking and medicine.",
  },
  "cooking/cup-to-tbsp": {
    formula: "cup × 16",
    popularValues: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4],
    examples: [
      { from: 1, to: 16, context: "1 cup" },
      { from: 0.5, to: 8, context: "Half cup" },
      { from: 0.25, to: 4, context: "Quarter cup" },
      { from: 2, to: 32, context: "2 cups" },
    ],
    fromContext: "Cups are the standard US cooking measure for liquids and dry ingredients.",
    toContext: "Tablespoons are a common US cooking measure — 16 tbsp = 1 cup.",
  },
  "pressure/psi-to-bar": {
    formula: "psi × 0.0689476",
    popularValues: [1, 5, 10, 14.5, 20, 30, 32, 40, 50, 100],
    examples: [
      { from: 14.5, to: 1, context: "≈ 1 bar" },
      { from: 32, to: 2.206, context: "Car tire" },
      { from: 100, to: 6.895, context: "100 psi" },
      { from: 30, to: 2.068, context: "Bike tire" },
    ],
    fromContext: "PSI (pounds per square inch) is used in the US for tire pressure, plumbing, and compressors.",
    toContext: "Bar is a metric pressure unit close to atmospheric pressure, used for tires and industry worldwide.",
  },
  "pressure/bar-to-psi": {
    formula: "bar × 14.5038",
    popularValues: [0.5, 1, 1.5, 2, 2.2, 3, 5, 10],
    examples: [
      { from: 1, to: 14.5, context: "1 bar" },
      { from: 2.2, to: 31.91, context: "Car tire" },
      { from: 2, to: 29.01, context: "2 bar" },
      { from: 5, to: 72.52, context: "5 bar" },
    ],
    fromContext: "Bar is a metric pressure unit close to atmospheric pressure, used for tires and industry worldwide.",
    toContext: "PSI (pounds per square inch) is used in the US for tire pressure, plumbing, and compressors.",
  },
  "power/hp-to-kw": {
    formula: "hp × 0.7457",
    popularValues: [1, 5, 10, 50, 100, 150, 200, 300, 400, 500],
    examples: [
      { from: 1, to: 0.746, context: "1 horsepower" },
      { from: 100, to: 74.57, context: "Compact car" },
      { from: 200, to: 149.1, context: "200 hp" },
      { from: 300, to: 223.7, context: "Sports car" },
    ],
    fromContext: "Horsepower (mechanical) rates engine and motor output in the US and the automotive world.",
    toContext: "Kilowatts are the SI unit of power, used for engines, appliances, and electricity worldwide.",
  },
  "power/kw-to-hp": {
    formula: "kW × 1.34102",
    popularValues: [1, 5, 10, 25, 50, 75, 100, 150, 200],
    examples: [
      { from: 1, to: 1.341, context: "1 kilowatt" },
      { from: 75, to: 100.6, context: "Compact car" },
      { from: 100, to: 134.1, context: "100 kW" },
      { from: 50, to: 67.05, context: "50 kW" },
    ],
    fromContext: "Kilowatts are the SI unit of power, used for engines, appliances, and electricity worldwide.",
    toContext: "Horsepower (mechanical) rates engine and motor output in the US and the automotive world.",
  },
  "angle/deg-to-rad": {
    formula: "deg × π/180",
    popularValues: [1, 15, 30, 45, 60, 90, 120, 180, 270, 360],
    examples: [
      { from: 180, to: 3.1416, context: "π radians" },
      { from: 90, to: 1.5708, context: "π/2 (right angle)" },
      { from: 45, to: 0.7854, context: "45°" },
      { from: 360, to: 6.2832, context: "2π (full turn)" },
    ],
    fromContext: "Degrees divide a full circle into 360 parts — used in navigation, geometry, and everyday angles.",
    toContext: "Radians are the SI angle unit — a full circle is 2π rad, the natural unit for trigonometry and calculus.",
  },
  "angle/rad-to-deg": {
    formula: "rad × 180/π",
    popularValues: [0.5, 1, 1.5708, 2, 3.1416, 4, 5, 6.2832],
    examples: [
      { from: 3.1416, to: 180, context: "π radians" },
      { from: 1.5708, to: 90, context: "π/2 (right angle)" },
      { from: 1, to: 57.296, context: "1 radian" },
      { from: 6.2832, to: 360, context: "2π (full turn)" },
    ],
    fromContext: "Radians are the SI angle unit — a full circle is 2π rad, the natural unit for trigonometry and calculus.",
    toContext: "Degrees divide a full circle into 360 parts — used in navigation, geometry, and everyday angles.",
  },
  "fuel/mpgus-to-lp100km": {
    formula: "235.215 ÷ mpg",
    popularValues: [15, 20, 25, 30, 35, 40, 45, 50, 60],
    examples: [
      { from: 30, to: 7.84, context: "30 mpg" },
      { from: 25, to: 9.41, context: "City SUV" },
      { from: 40, to: 5.88, context: "Efficient sedan" },
      { from: 50, to: 4.7, context: "Hybrid" },
    ],
    fromContext: "MPG (US) measures fuel economy as miles driven per US gallon — higher is more efficient.",
    toContext: "L/100km measures fuel use as liters per 100 km — the metric standard, where lower is more efficient.",
  },
  "fuel/lp100km-to-mpgus": {
    formula: "235.215 ÷ (L/100km)",
    popularValues: [3, 4, 5, 6, 7, 8, 9, 10, 12, 15],
    examples: [
      { from: 8, to: 29.4, context: "8 L/100km" },
      { from: 5, to: 47.04, context: "Efficient car" },
      { from: 10, to: 23.52, context: "Thirsty SUV" },
      { from: 6, to: 39.2, context: "Compact car" },
    ],
    fromContext: "L/100km measures fuel use as liters per 100 km — the metric standard, where lower is more efficient.",
    toContext: "MPG (US) measures fuel economy as miles driven per US gallon — higher is more efficient.",
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
  "energy", "pressure", "power", "angle", "fuel",
];

export const ALL_PAIRS: UnitPair[] = ALL_CATEGORIES.flatMap(generatePairs);

export function getPairsByCategory(category: UnitCategory): UnitPair[] {
  return ALL_PAIRS.filter((p) => p.category === category);
}

export function getPairBySlug(category: UnitCategory, slug: string): UnitPair | undefined {
  return ALL_PAIRS.find((p) => p.category === category && p.slug === slug);
}

// --- SEO indexing priority -------------------------------------------------
// Only "rich" pairs (those with hand-written OVERRIDES) plus major currency
// crosses are indexed + listed in the sitemap. Every other generated pair
// still renders for users and internal links, but carries robots:noindex and
// is omitted from the sitemap — concentrating crawl budget on pages that have
// unique, substantial content instead of thin auto-generated permutations.
export const PRIORITY_UNIT_SLUGS: ReadonlySet<string> = new Set(Object.keys(OVERRIDES));

const CURRENCY_MAJORS = ["usd", "eur", "gbp", "jpy", "cad", "aud", "chf", "cny", "inr"] as const;
export const PRIORITY_CURRENCY_SLUGS: ReadonlySet<string> = new Set(
  CURRENCY_MAJORS.flatMap((from) =>
    CURRENCY_MAJORS.filter((to) => to !== from).map((to) => `${from}-to-${to}`)
  )
);

export function isPriorityPair(category: string, pair: string): boolean {
  if (category === "currency") return PRIORITY_CURRENCY_SLUGS.has(pair);
  return PRIORITY_UNIT_SLUGS.has(`${category}/${pair}`);
}

export function getAllStaticParams() {
  const unitPairs = ALL_PAIRS.map((p) => ({ category: p.category, pair: p.slug }));
  const CURRENCIES = ["usd","eur","gbp","jpy","cad","aud","chf","cny","inr","mxn","brl","krw","sgd","hkd","nok","sek","dkk","pln","try","zar"];
  const currencyPairs: { category: string; pair: string }[] = [];
  for (const from of CURRENCIES) {
    for (const to of CURRENCIES) {
      if (from !== to) currencyPairs.push({ category: "currency", pair: `${from}-to-${to}` });
    }
  }
  return [...unitPairs, ...currencyPairs];
}
