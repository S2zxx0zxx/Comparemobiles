import type { MetadataRoute } from "next";
import { verifiedPreviewDevices } from "@/data/verified-preview";
import { getDiscoverableChipsets } from "@/lib/chipsets";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/phones", "/compare", "/finder", "/upcoming", "/deals", "/guides", "/brands", "/chipsets"];
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...verifiedPreviewDevices.map((device) => ({
      url: `${base}/phones/${device.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...getDiscoverableChipsets().map((chipset) => ({
      url: `${base}/chipsets/${chipset.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
