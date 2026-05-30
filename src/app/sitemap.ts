import type { MetadataRoute } from "next";
import { CATEGORY_META, type UnitCategory } from "@/lib/units";
import { getAllStaticParams } from "@/data/pairs";

const BASE = "https://unitcrate.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const cats = Object.keys(CATEGORY_META) as UnitCategory[];
  const pairs = getAllStaticParams();

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
