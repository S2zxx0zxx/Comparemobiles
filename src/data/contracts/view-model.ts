import { z } from "zod";

const previewSourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  region: z.string().min(1),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  confidence: z.enum(["primary", "secondary"]),
});

export const previewDeviceSchema = z.object({
  slug: z.string().min(1),
  brand: z.string().min(1),
  name: z.string().min(1),
  market: z.string().min(1),
  status: z.string().min(1),
  accent: z.string().min(1),
  summary: z.string().min(1),
  specs: z.object({
    chipset: z.string().min(1),
    display: z.string().min(1),
    refreshRate: z.string().min(1),
    battery: z.string().min(1),
    charging: z.string().min(1),
    cameras: z.string().min(1),
    weight: z.string().min(1),
    storage: z.string().min(1),
    os: z.string().min(1),
  }),
  sources: z.array(previewSourceSchema).min(1),
});

export const previewCatalogSchema = z.array(previewDeviceSchema).superRefine((devices, ctx) => {
  const slugs = new Set<string>();
  for (const [index, device] of devices.entries()) {
    if (slugs.has(device.slug)) {
      ctx.addIssue({
        code: "custom",
        path: [index, "slug"],
        message: `Duplicate preview slug: ${device.slug}`,
      });
    }
    slugs.add(device.slug);
  }
});
