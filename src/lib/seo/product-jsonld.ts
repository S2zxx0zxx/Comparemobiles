import type { Device } from "@/lib/device";

export function buildProductJsonLd(device: Device, siteUrl: string) {
  const source = device.sources[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: device.name,
    brand: { "@type": "Brand", name: device.brand },
    url: siteUrl.replace(/\/$/, "") + "/phones/" + device.slug,
    category: "Smartphone",
    additionalProperty: [
      { "@type": "PropertyValue", name: "Market", value: device.market },
      { "@type": "PropertyValue", name: "Status", value: device.status },
      { "@type": "PropertyValue", name: "Chipset", value: device.specs.chipset },
      { "@type": "PropertyValue", name: "Display", value: device.specs.display },
      { "@type": "PropertyValue", name: "Battery", value: device.specs.battery },
    ],
    ...(source ? { sameAs: source.url } : {}),
  };
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
