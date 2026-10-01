import { z } from "zod";

export const guideCategorySchema = z.enum(["buying-guide", "technology-explainer", "decision-guide"]);

export const guideSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(220),
  category: guideCategorySchema,
  status: z.enum(["planned", "draft", "published"]),
  region: z.enum(["IN", "GLOBAL"]),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sourceUrls: z.array(z.string().url()).default([]),
}).superRefine((guide, ctx) => {
  if (guide.status === "published" && guide.sourceUrls.length === 0) {
    ctx.addIssue({ code: "custom", path: ["sourceUrls"], message: "Published guides require at least one source URL" });
  }
});

export const guideRegistrySchema = z.array(guideSchema).superRefine((guides, ctx) => {
  const seen = new Set<string>();
  guides.forEach((guide, index) => {
    if (seen.has(guide.slug)) ctx.addIssue({ code: "custom", path: [index, "slug"], message: "Duplicate guide slug" });
    seen.add(guide.slug);
  });
});

export type Guide = z.infer<typeof guideSchema>;
