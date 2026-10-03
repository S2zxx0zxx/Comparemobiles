import { z } from "zod";
import type { DeviceImport } from "@/data/contracts/catalog";
import type { SourceImporter } from "@/data/importer/source-importer";
import { type ManufacturerLoader, normalizeManufacturerRegion, primaryManufacturerClaim } from "@/data/importer/manufacturers/shared";

const schema=z.object({
  recordId:z.string().min(1), name:z.string().min(1), model:z.string().optional(), region:z.enum(["IN","CN","GLOBAL","EU","US","JP","KR","OTHER"]),
  status:z.enum(["announced","available","discontinued"]), url:z.string().url(), announcedAt:z.string().optional(), launchedAt:z.string().optional(), tensor:z.string().optional(),
  screen:z.object({ technology:z.string().optional(), size:z.number().optional(), resolution:z.string().optional(), refreshHz:z.number().int().optional() }).default({}),
  batteryMah:z.number().int().optional(), chargingW:z.number().int().optional(), wirelessChargingW:z.number().int().optional(), weightGrams:z.number().optional(), androidVersion:z.string().optional(),
  storageType:z.string().optional(), rearCameras:z.array(z.string()).default([]), frontCameras:z.array(z.string()).default([]),
  variants:z.array(z.object({ id:z.string().optional(), ramGb:z.number().int().optional(), storageGb:z.number().int().optional(), color:z.string().optional(), sku:z.string().optional() })).default([]),
});
export type GoogleOfficialRecord=z.input<typeof schema>;
export class GoogleOfficialImporter implements SourceImporter<GoogleOfficialRecord>{
  readonly key="google-official"; readonly sourceType="manufacturer" as const;
  constructor(private readonly load:ManufacturerLoader<GoogleOfficialRecord>){}
  fetch(context:Parameters<ManufacturerLoader<GoogleOfficialRecord>>[0]){return this.load(context);}
  transform(raw:GoogleOfficialRecord,context:Parameters<ManufacturerLoader<GoogleOfficialRecord>>[0]):DeviceImport{
    const r=schema.parse(raw); const region=normalizeManufacturerRegion(r.region,context);
    return {sourceKey:r.recordId,brand:"Google",name:r.name,modelNumber:r.model,region,status:r.status,announcedAt:r.announcedAt,launchedAt:r.launchedAt,
      specs:{chipset:r.tensor,displayPanel:r.screen.technology,displaySizeInches:r.screen.size,displayResolution:r.screen.resolution,refreshRateHz:r.screen.refreshHz,batteryMah:r.batteryMah,chargingW:r.chargingW,wirelessChargingW:r.wirelessChargingW,weightGrams:r.weightGrams,rearCameras:r.rearCameras,frontCameras:r.frontCameras,storageStandard:r.storageType,operatingSystem:r.androidVersion},
      variants:r.variants.map(v=>({sourceKey:v.id,ramGb:v.ramGb,storageGb:v.storageGb,color:v.color,sku:v.sku,region})),claims:[primaryManufacturerClaim(r.url,region,context)],offers:[]};
  }
}
