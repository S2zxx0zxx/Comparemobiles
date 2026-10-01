import { z } from "zod";
import type { DeviceImport } from "@/data/contracts/catalog";
import type { SourceImporter } from "@/data/importer/source-importer";
import { type ManufacturerLoader, normalizeManufacturerRegion, primaryManufacturerClaim } from "@/data/importer/manufacturers/shared";

const schema=z.object({
  id:z.string().min(1), brand:z.enum(["OPPO","realme"]), title:z.string().min(1), model:z.string().optional(), region:z.enum(["IN","CN","GLOBAL","EU","US","JP","KR","OTHER"]),
  lifecycle:z.enum(["announced","available","discontinued"]), canonicalUrl:z.string().url(), announcedAt:z.string().optional(), launchedAt:z.string().optional(), processor:z.string().optional(),
  display:z.object({panel:z.string().optional(),inches:z.number().optional(),resolution:z.string().optional(),hz:z.number().int().optional()}).default({}),
  batteryMah:z.number().int().optional(), wiredW:z.number().int().optional(), wirelessW:z.number().int().optional(), grams:z.number().optional(), os:z.string().optional(), storageType:z.string().optional(),
  rear:z.array(z.string()).default([]), front:z.array(z.string()).default([]),
  variants:z.array(z.object({id:z.string().optional(),ramGb:z.number().int().optional(),storageGb:z.number().int().optional(),color:z.string().optional(),sku:z.string().optional()})).default([]),
});
export type OppoRealmeOfficialRecord=z.input<typeof schema>;
export class OppoRealmeOfficialImporter implements SourceImporter<OppoRealmeOfficialRecord>{
  readonly key="oppo-realme-official";readonly sourceType="manufacturer" as const;
  constructor(private readonly load:ManufacturerLoader<OppoRealmeOfficialRecord>){}
  fetch(context:Parameters<ManufacturerLoader<OppoRealmeOfficialRecord>>[0]){return this.load(context);}
  transform(raw:OppoRealmeOfficialRecord,context:Parameters<ManufacturerLoader<OppoRealmeOfficialRecord>>[0]):DeviceImport{
    const r=schema.parse(raw);const region=normalizeManufacturerRegion(r.region,context);
    return {sourceKey:r.id,brand:r.brand,name:r.title,modelNumber:r.model,region,status:r.lifecycle,announcedAt:r.announcedAt,launchedAt:r.launchedAt,
      specs:{chipset:r.processor,displayPanel:r.display.panel,displaySizeInches:r.display.inches,displayResolution:r.display.resolution,refreshRateHz:r.display.hz,batteryMah:r.batteryMah,chargingW:r.wiredW,wirelessChargingW:r.wirelessW,weightGrams:r.grams,rearCameras:r.rear,frontCameras:r.front,storageStandard:r.storageType,operatingSystem:r.os},
      variants:r.variants.map(v=>({sourceKey:v.id,ramGb:v.ramGb,storageGb:v.storageGb,color:v.color,sku:v.sku,region})),claims:[primaryManufacturerClaim(r.canonicalUrl,region,context)],offers:[]};
  }
}
