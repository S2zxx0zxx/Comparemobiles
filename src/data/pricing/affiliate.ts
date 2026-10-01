export type RetailDestination = {
  productUrl: string;
  affiliateUrl?: string | null;
  sponsored?: boolean;
};

export function outboundRetailUrl(destination: RetailDestination) {
  return destination.affiliateUrl?.trim() || destination.productUrl;
}

export function isSponsoredDestination(destination: RetailDestination) {
  return destination.sponsored === true;
}
