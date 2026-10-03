import { previewCatalogSchema } from "../src/data/contracts/view-model";
import { verifiedPreviewDevices } from "../src/data/verified-preview";

const result = previewCatalogSchema.safeParse(verifiedPreviewDevices);

if (!result.success) {
  console.error(result.error.issues);
  process.exit(1);
}

console.log(`Validated ${result.data.length} preview devices with source metadata.`);
