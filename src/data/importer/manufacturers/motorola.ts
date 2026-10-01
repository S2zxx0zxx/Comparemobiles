import { z } from "zod";
import type { DeviceImport } from "@/data/contracts/catalog";
import type { SourceImporter } from "@/data/importer/source-importer";
import { type ManufacturerLoader, normalizeManufacturerRegion, primaryManufacturerClaim } from "@/data/importer/manufacturers/shared";

const schema=z.object({
  sourceKey:z.string().min(1),name:z.string().min(1),modelNumber:z.string().optional(),region:z.enum(["IN","CN","GLOBAL","EU","US","JP","KR","OTHER"]),
  status:z.enum(["announced","available","discontinued"]),sourceUrl:z.string().url(),announcedAt:z.string().optional(),launchedAt:z.string().optional(),chipset:z.string().optional(),
  screen:z.object({panel:z.string().optional(),sizeInches:z.number().optional(),resolution:z.string().optional(),refreshHz:z.number().int().optional()}).default({}),
  batteryMah:z.number().int().optional(),chargingW:z.number().int().optional(),wirelessChargingW:z.number().int().optional(),weightGrams:z.number().optional(),os:z.string().optional(),storageStandard:z.string().optional(),
  rearCameras:z.array(z.string()).default([]),frontCameras:z.array(z.string()).default([]),variants:z.array(z.object({sourceKey:z.string().optional(),ramGb:z.number().int().optional(),storageGb:z.number().int().optional(),color:z.string().optional(),sku:z.string().optional()})).default([]),
});
export type MotorolaOfficialRecord=z.input<typeof schema>;
export class MotorolaOfficialImporter implements SourceImporter<MotorolaOfficialRecord>{
  readonly key="motorola-official";readonly sourceType="manufacturer" as const;
  constructor(private readonly load:ManufacturerLoader<MotorolaOfficialRecord>){}
  fetch(context:Parameters<ManufacturerLoader<MotorolaOfficialRecord>>[0]){return this.load(context);}
  transform(raw:MotorolaOfficialRecord,context:Parameters<ManufacturerLoader<MotorolaOfficialRecord>>[0]):DeviceImport{
    const r=schema.parse(raw);const region=normalizeManufacturerRegion(r.region,context);
    return {sourceKey:r.sourceKey,brand:"Motorola",name:r.name,modelNumber:r.modelNumber,region,status:r.status,announcedAt:r.announcedAt,launchedAt:r.launchedAt,
      specs:{chipset:r.chipset,displayPanel:r.screen.panel,displaySizeInches:r.screen.sizeInches,displayResolution:r.screen.resolution,refreshRateHz:r.screen.refreshHz,batteryMah:r.batteryMah,chargingW:r.chargingW,wirelessChargingW:r.wirelessChargingW,weightGrams:r.weightGrams,rearCameras:r.rearCameras,frontCameras:r.frontCameras,storageStandard:r.storageStandard,operatingSystem:r.os},
      variants:r.variants.map(v=>({...v,region})),claims:[primaryManufacturerClaim(r.sourceUrl,region,context)],offers:[]};
  }
}
