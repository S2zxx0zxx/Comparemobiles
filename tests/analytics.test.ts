import { describe, expect, it } from "vitest";
import { validateAnalyticsEvent } from "@/analytics/events";

describe("analytics event contract", () => {
  it("accepts privacy-safe product events", () => {
    const event = validateAnalyticsEvent({
      name: "comparison_started", at: "2026-10-01T09:00:00+05:30", path: "/compare",
      deviceSlugs: ["oneplus-15", "galaxy-s26"],
    });
    expect(event.name).toBe("comparison_started");
  });

  it("strips arbitrary PII-like fields from accepted events", () => {
    const event = validateAnalyticsEvent({
      name: "retailer_click", at: "2026-10-01T09:00:00+05:30", path: "/phones/demo",
      deviceSlug: "demo", retailerKey: "retailer", sponsored: false, email: "user@example.com",
    });
    expect("email" in event).toBe(false);
  });
});
