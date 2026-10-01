export type AffiliateLinkRecord = {
  offerId: number;
  provider: string;
  url: string;
  active: boolean;
};

export function chooseOutboundUrl(offerUrl: string, affiliate?: AffiliateLinkRecord | null) {
  if (!affiliate?.active) return offerUrl;
  return affiliate.url;
}
