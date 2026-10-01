import { describe, expect, it } from "vitest";
import { guideRegistry } from "@/content/guides/registry";
import { guideSchema } from "@/content/guides/schema";

describe("guide content contract", () => {
  it("keeps registry slugs unique", () => {
    expect(new Set(guideRegistry.map((guide) => guide.slug)).size).toBe(guideRegistry.length);
  });

  it("requires sources before a guide can be published", () => {
    expect(() => guideSchema.parse({
      slug: "published-without-source",
      title: "Published without source",
      description: "This should fail because published editorial content must carry a source trail.",
      category: "decision-guide",
      status: "published",
      region: "IN",
      updatedAt: "2026-10-01",
      sourceUrls: [],
    })).toThrow(/source URL/);
  });
});
