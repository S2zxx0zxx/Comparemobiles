import type { DeviceImport, SourceClaim } from "@/data/contracts/catalog";

export type ImporterContext = {
  checkedAt: string;
  region: DeviceImport["region"];
};

export interface SourceImporter<RawRecord = unknown> {
  readonly key: string;
  readonly sourceType: SourceClaim["sourceType"];
  fetch(context: ImporterContext): Promise<RawRecord[]>;
  transform(record: RawRecord, context: ImporterContext): unknown;
}

export type ImportBatchResult = {
  accepted: DeviceImport[];
  rejected: Array<{ sourceKey?: string; reason: string }>;
};
