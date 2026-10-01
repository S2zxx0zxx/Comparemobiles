import { z } from "zod";
import type { DeviceImport } from "@/data/contracts/catalog";
import type { SourceImporter } from "@/data/importer/source-importer";
import { type ManufacturerLoader, normalizeManufacturerRegion, primaryManufacturerClaim } from "@/data/importer/manufacturers/shared";

const schema=z.object({
  sourceKey:z.string().min(1), brand:z.enum(["Xiaomi","Redmi","POCO"]), productName:z.string().min(1), modelNumber:z.string().optional(),
  region:z.enum(["IN","CN","GLOBAL","EU","US","JP","KR","OTHER"]), status:z.enum(["announced","available","discontinued"]), sourceUrl:z.string().url(),
  announcedAt:z.string().optional(), launchedAt:z.string().optional(), soc:z.string().optional(),
  display:z.object({type:z.string().optional(),sizeInches:z.number().optional(),resolution:z.string().optional(),refreshRateHz:z.number().int().optional()}).default({}),
  batteryMah:z.number().int().optional(), chargingW:z.number().int().optional(), wirelessChargingW:z.number().int().optional(), weightGrams:z.number().optional(),
  os:z.string().optional(), storageStandard:z.string().optional(), rearCameras:z.array(z.string()).default([]), frontCameras:z.array(z.string()).default([]),
  variants:z.array(z.object({key:z.string().optional(),ramGb:z.number().int().optional(),storageGb:z.number().int().optional(),color:z.string().optional(),sku:z.string().optional()})).default([]),
});
export type XiaomiFamilyOfficialRecord=z.input<typeof schema>;
export class XiaomiFamilyOfficialImporter implements SourceImporter<XiaomiFamilyOfficialRecord>{
  readonly key="xiaomi-family-official"; readonly sourceType="manufacturer" as const;
  constructor(private readonly load:ManufacturerLoader<XiaomiFamilyOfficialRecord>){}
  fetch(context:Parameters<ManufacturerLoader<XiaomiFamilyOfficialRecord>>[0]){return this.load(context);}
  transform(raw:XiaomiFamilyOfficialRecord,context:Parameters<ManufacturerLoader<XiaomiFamilyOfficialRecord>>[0]):DeviceImport{
    const r=schema.parse(raw);const region=normalizeManufacturerRegion(r.region,context);
    return {sourceKey:r.sourceKey,brand:r.brand,name:r.productName,modelNumber:r.modelNumber,region,status:r.status,announcedAt:r.announcedAt,launchedAt:r.launchedAt,
      specs:{chipset:r.soc,displayPanel:r.display.type,displaySizeInches:r.display.sizeInches,displayResolution:r.display.resolution,refreshRateHz:r.display.refreshRateHz,batteryMah:r.batteryMah,chargingW:r.chargingW,wirelessChargingW:r.wirelessChargingW,weightGrams:r.weightGrams,rearCameras:r.rearCameras,frontCameras:r.frontCameras,storageStandard:r.storageStandard,operatingSystem:r.os},
      variants:r.variants.map(v=>({sourceKey:v.key,ramGb:v.ramGb,storageGb:v.storageGb,color:v.color,sku:v.sku,region})),claims:[primaryManufacturerClaim(r.sourceUrl,region,context)],offers:[]};
  }
}
