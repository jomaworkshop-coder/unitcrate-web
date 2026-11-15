import type { MetadataRoute } from "next";
import { CATEGORY_META, type UnitCategory } from "@/lib/units";
import { getAllStaticParams, isPriorityPair } from "@/data/pairs";

const BASE = "https://unitcrate.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const cats = Object.keys(CATEGORY_META) as UnitCategory[];
  // Only list pages with unique, substantial content. Thin auto-generated
  // permutations still render + carry robots:noindex, but stay out of the map.
  const pairs = getAllStaticParams().filter(({ category, pair }) => isPriorityPair(category, pair));

  return [
    { url: BASE, lastModified: new Date(), priority: 1 },
    ...cats.map((cat) => ({
      url: `${BASE}/${cat}`,
      lastModified: new Date(),
      priority: 0.9,
    })),
    ...pairs.map(({ category, pair }) => ({
      url: `${BASE}/${category}/${pair}`,
      lastModified: new Date(),
      priority: 0.7,
    })),
  ];
}
