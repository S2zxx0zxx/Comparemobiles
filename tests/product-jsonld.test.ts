import { describe, expect, it } from "vitest";
import { verifiedPreviewDevices } from "@/data/verified-preview";
import { buildProductJsonLd, safeJsonLd } from "@/lib/seo/product-jsonld";

describe("product JSON-LD", () => {
  it("uses source-backed product metadata without inventing offers or ratings", () => {
    const data = buildProductJsonLd(verifiedPreviewDevices[0], "https://example.com");
    expect(data["@type"]).toBe("Product");
    expect("offers" in data).toBe(false);
    expect("aggregateRating" in data).toBe(false);
    expect(JSON.stringify(data)).toContain(verifiedPreviewDevices[0].market);
  });

  it("escapes HTML-significant characters before embedding JSON", () => {
    expect(safeJsonLd({ value: "</script>" })).not.toContain("</script>");
  });
});
