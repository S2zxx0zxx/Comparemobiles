import { z } from "zod";

const baseEvent = z.object({
  at: z.string().datetime({ offset: true }),
  path: z.string().startsWith("/"),
});

export const analyticsEventSchema = z.discriminatedUnion("name", [
  baseEvent.extend({ name: z.literal("search_submitted"), queryLength: z.number().int().nonnegative().max(200), resultCount: z.number().int().nonnegative() }),
  baseEvent.extend({ name: z.literal("comparison_started"), deviceSlugs: z.array(z.string().min(1)).min(2).max(4) }),
  baseEvent.extend({ name: z.literal("comparison_device_changed"), slot: z.number().int().min(0).max(3), deviceSlug: z.string().min(1) }),
  baseEvent.extend({ name: z.literal("finder_filter_changed"), filterKey: z.enum(["brand", "market", "budget", "chipset", "battery", "display", "storage"]), valueBucket: z.string().min(1).max(100) }),
  baseEvent.extend({ name: z.literal("retailer_click"), deviceSlug: z.string().min(1), retailerKey: z.string().min(1), sponsored: z.boolean() }),
  baseEvent.extend({ name: z.literal("zero_result_search"), queryLength: z.number().int().positive().max(200) }),
]);

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
export interface AnalyticsSink { send(event: AnalyticsEvent): Promise<void> | void; }
export function validateAnalyticsEvent(input: unknown) { return analyticsEventSchema.parse(input); }
