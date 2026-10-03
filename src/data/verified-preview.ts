import type { Device } from "@/lib/device";

/**
 * Small primary-source preview catalog for UI development.
 * This is intentionally NOT a full production catalog.
 * Every record must keep source + region + checked date attached.
 */
export const verifiedPreviewDevices: Device[] = [
  {
    slug: "oneplus-15",
    brand: "OnePlus",
    name: "OnePlus 15",
    market: "India",
    status: "Official",
    accent: "#ff5038",
    summary: "Primary-source record from OnePlus India.",
    specs: {
      chipset: "Snapdragon 8 Elite Gen 5",
      display: "6.78-inch LTPO 1.5K",
      refreshRate: "Up to 165Hz",
      battery: "7,300mAh",
      charging: "120W wired · 50W wireless",
      cameras: "50MP + 50MP + 50MP rear",
      weight: "211–215g (finish dependent)",
      storage: "256GB / 512GB · UFS 4.1",
      os: "OxygenOS 16 based on Android 16",
    },
    sources: [
      {
        label: "OnePlus India — official product/specifications",
        url: "https://www.oneplus.in/oneplus-15",
        region: "India",
        checkedAt: "2026-10-01",
        confidence: "primary",
      },
    ],
  },
  {
    slug: "galaxy-s26",
    brand: "Samsung",
    name: "Galaxy S26",
    market: "India",
    status: "Official",
    accent: "#6f8dff",
    summary: "Primary-source record from Samsung India.",
    specs: {
      chipset: "Market-dependent",
      display: "6.3-inch Dynamic AMOLED 2X · FHD+",
      refreshRate: "Up to 120Hz",
      battery: "4,300mAh",
      charging: "Official charging detail pending ingestion",
      cameras: "50MP + 10MP + 12MP rear · 12MP front",
      weight: "167g",
      storage: "256GB / 512GB (India listing)",
      os: "Android",
    },
    sources: [
      {
        label: "Samsung India — official Galaxy S26 specifications",
        url: "https://www.samsung.com/in/business/smartphones/galaxy-s/galaxy-s26-white-256gb-sm-s942bzwcins/",
        region: "India",
        checkedAt: "2026-10-01",
        confidence: "primary",
      },
      {
        label: "Samsung Newsroom India — Galaxy S26 series launch",
        url: "https://news.samsung.com/in/samsung-unveils-galaxy-s26-series-the-most-intuitive-galaxy-ai-phone-yet",
        region: "India",
        checkedAt: "2026-10-01",
        confidence: "primary",
      },
    ],
  },
  {
    slug: "iqoo-16-cn",
    brand: "iQOO",
    name: "iQOO 16",
    market: "China",
    status: "Official · China",
    accent: "#ffd52a",
    summary: "China-market primary-source record. Not represented as an India launch.",
    specs: {
      chipset: "6th-gen Snapdragon 8 flagship platform (China naming)",
      display: "6.85-inch AMOLED · 3168×1440",
      refreshRate: "Up to 165Hz",
      battery: "8,400mAh typical",
      charging: "100W wired · 40W wireless",
      cameras: "50MP + 50MP + 50MP rear · 32MP front",
      weight: "222.5–229.8g (finish dependent)",
      storage: "256GB / 512GB / 1TB · UFS 4.1",
      os: "OriginOS 7 based on Android 17",
    },
    sources: [
      {
        label: "vivo China — official iQOO 16 specifications",
        url: "https://www.vivo.com.cn/vivo/param/iqoo16",
        region: "China",
        checkedAt: "2026-10-01",
        confidence: "primary",
      },
    ],
  },
];

export function getPreviewDevice(slug: string) {
  return verifiedPreviewDevices.find((device) => device.slug === slug);
}
