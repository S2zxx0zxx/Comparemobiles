import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prepareImportBatch } from "../src/data/importer/prepare-batch";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: pnpm data:validate-import <path-to-json>");
  process.exit(1);
}

const raw = await readFile(resolve(inputPath), "utf8");
const parsed = JSON.parse(raw) as unknown;

if (!Array.isArray(parsed)) {
  console.error("Import file must contain a JSON array.");
  process.exit(1);
}

const result = prepareImportBatch(parsed);

console.log(JSON.stringify({
  accepted: result.accepted.length,
  rejected: result.rejected,
}, null, 2));

if (result.rejected.length) {
  process.exit(1);
}
