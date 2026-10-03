import { guideRegistrySchema } from "@/content/guides/schema";

export const guideRegistry = guideRegistrySchema.parse([
  {
    slug: "best-phones-by-budget",
    title: "Buying guides",
    description: "Best-under-budget pages will combine verified pricing coverage with structured product filters and editorial context.",
    category: "buying-guide",
    status: "planned",
    region: "IN",
    updatedAt: "2026-10-01",
    sourceUrls: [],
  },
  {
    slug: "smartphone-technology-explainers",
    title: "Technology explainers",
    description: "UFS, LTPO, charging, camera sensors and chipsets explained with source-backed terminology instead of marketing shorthand.",
    category: "technology-explainer",
    status: "planned",
    region: "GLOBAL",
    updatedAt: "2026-10-01",
    sourceUrls: [],
  },
  {
    slug: "phone-decision-guides",
    title: "Decision guides",
    description: "Use-case-first guidance for parents, gaming, compact phones, cameras and long-term ownership.",
    category: "decision-guide",
    status: "planned",
    region: "IN",
    updatedAt: "2026-10-01",
    sourceUrls: [],
  },
]);
