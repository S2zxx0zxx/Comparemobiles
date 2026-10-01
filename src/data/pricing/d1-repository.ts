import { desc, eq, inArray } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { RetailerOfferInput } from "@/data/contracts/catalog";
import { affiliateLinks, devices, offers, priceSnapshots, retailers } from "@/db/schema";
import { chooseOutboundUrl } from "@/data/pricing/affiliate";
import type { CatalogOfferView, PricingRepository, RetailerPriceHistory } from "@/data/pricing/repository";
import { offerPresentationState } from "@/data/pricing/status";

type D1Schema = {
  affiliateLinks: typeof affiliateLinks;
  devices: typeof devices;
  offers: typeof offers;
  priceSnapshots: typeof priceSnapshots;
  retailers: typeof retailers;
};
type Db = DrizzleD1Database<D1Schema>;

function asAvailability(value: string): RetailerOfferInput["availability"] {
  if (value === "in_stock" || value === "out_of_stock" || value === "preorder") return value;
  return "unknown";
}

export function createD1PricingRepository(db: Db): PricingRepository {
  return {
    async listDeviceOffers(deviceSlug): Promise<CatalogOfferView[]> {
      const rows = await db
        .select({
          offerId: offers.id,
          retailerKey: retailers.retailerKey,
          retailerName: retailers.name,
          region: retailers.region,
          currency: offers.currency,
          amountMinor: offers.currentPriceMinor,
          listAmountMinor: offers.listPriceMinor,
          availability: offers.availability,
          offerUrl: offers.offerUrl,
          checkedAt: offers.checkedAt,
        })
        .from(offers)
        .innerJoin(devices, eq(offers.deviceId, devices.id))
        .innerJoin(retailers, eq(offers.retailerId, retailers.id))
        .where(eq(devices.slug, deviceSlug))
        .orderBy(desc(offers.checkedAt));

      if (!rows.length) return [];

      const offerIds = rows.map((row) => row.offerId);
      const affiliates = await db
        .select()
        .from(affiliateLinks)
        .where(inArray(affiliateLinks.offerId, offerIds));

      return rows.map((row) => {
        const availability = asAvailability(row.availability);
        const normalized: RetailerOfferInput = {
          retailerKey: row.retailerKey,
          region: row.region as RetailerOfferInput["region"],
          currency: row.currency,
          amountMinor: row.amountMinor,
          listAmountMinor: row.listAmountMinor ?? undefined,
          availability,
          offerUrl: row.offerUrl,
          checkedAt: row.checkedAt,
        };

        const affiliate = affiliates.find((item) => item.offerId === row.offerId && item.active);
        return {
          ...row,
          listAmountMinor: row.listAmountMinor ?? undefined,
          availability,
          outboundUrl: chooseOutboundUrl(
            row.offerUrl,
            affiliate
              ? { offerId: row.offerId, provider: affiliate.provider, url: affiliate.affiliateUrl, active: affiliate.active }
              : undefined,
          ),
          affiliateProvider: affiliate?.provider,
          state: offerPresentationState(normalized),
        };
      });
    },

    async getOfferHistory(offerId): Promise<RetailerPriceHistory | undefined> {
      const offer = await db
        .select({
          offerId: offers.id,
          retailerKey: retailers.retailerKey,
          retailerName: retailers.name,
          currency: offers.currency,
        })
        .from(offers)
        .innerJoin(retailers, eq(offers.retailerId, retailers.id))
        .where(eq(offers.id, offerId))
        .limit(1);

      const meta = offer[0];
      if (!meta) return undefined;

      const snapshots = await db
        .select({
          amountMinor: priceSnapshots.amountMinor,
          capturedAt: priceSnapshots.capturedAt,
        })
        .from(priceSnapshots)
        .where(eq(priceSnapshots.offerId, offerId))
        .orderBy(priceSnapshots.capturedAt);

      return {
        ...meta,
        snapshots,
      };
    },
  };
}
