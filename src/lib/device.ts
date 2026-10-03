export type DeviceSource = {
  label: string;
  url: string;
  region: string;
  checkedAt: string;
  confidence: "primary" | "secondary";
};

export type DeviceSpecs = {
  chipset: string;
  display: string;
  refreshRate: string;
  battery: string;
  charging: string;
  cameras: string;
  weight: string;
  storage: string;
  os: string;
};

export type Device = {
  slug: string;
  brand: string;
  name: string;
  market: string;
  status: string;
  accent: string;
  summary: string;
  specs: DeviceSpecs;
  sources: DeviceSource[];
};
