import { verifiedPreviewDevices } from "@/data/verified-preview";

export function chipsetSlug(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function isDiscoverableChipset(value: string) {
  const normalized = value.toLowerCase();
  return value.trim().length > 0 && !normalized.includes("market-dependent") && !normalized.includes("pending");
}

export function getDiscoverableChipsets() {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const device of verifiedPreviewDevices) {
    const name = device.specs.chipset;
    if (!isDiscoverableChipset(name)) continue;
    const slug = chipsetSlug(name);
    const current = map.get(slug);
    map.set(slug, { name, slug, count: (current?.count ?? 0) + 1 });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function getDevicesByChipsetSlug(slug: string) {
  return verifiedPreviewDevices.filter((device) => isDiscoverableChipset(device.specs.chipset) && chipsetSlug(device.specs.chipset) === slug);
}
