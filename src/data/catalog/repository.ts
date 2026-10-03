import type { Device } from "@/lib/device";

export type CatalogQuery = {
  q?: string;
  brand?: string;
  market?: string;
  chipset?: string;
};

export interface CatalogRepository {
  list(query?: CatalogQuery): Promise<Device[]>;
  getBySlug(slug: string): Promise<Device | undefined>;
  listBrands(): Promise<string[]>;
}
