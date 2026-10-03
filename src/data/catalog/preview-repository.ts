import type { CatalogQuery, CatalogRepository } from "@/data/catalog/repository";
import { verifiedPreviewDevices } from "@/data/verified-preview";

function matchesQuery(haystack: string, needle?: string) {
  if (!needle?.trim()) return true;
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

export const previewCatalogRepository: CatalogRepository = {
  async list(query: CatalogQuery = {}) {
    return verifiedPreviewDevices.filter((device) =>
      matchesQuery(`${device.brand} ${device.name} ${device.specs.chipset}`, query.q) &&
      matchesQuery(device.brand, query.brand) &&
      matchesQuery(device.market, query.market) &&
      matchesQuery(device.specs.chipset, query.chipset),
    );
  },
  async getBySlug(slug) {
    return verifiedPreviewDevices.find((device) => device.slug === slug);
  },
  async listBrands() {
    return [...new Set(verifiedPreviewDevices.map((device) => device.brand))].sort((a, b) => a.localeCompare(b));
  },
};
