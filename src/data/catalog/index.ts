import type { CatalogRepository } from "@/data/catalog/repository";
import { previewCatalogRepository } from "@/data/catalog/preview-repository";

/**
 * Current read boundary. The verified preview repository remains the default until
 * a real D1 database ID is provisioned and the D1 repository is wired.
 * Public pages should depend on this contract rather than importing fixture arrays.
 */
export const catalogRepository: CatalogRepository = previewCatalogRepository;

export type { CatalogQuery, CatalogRepository } from "@/data/catalog/repository";
