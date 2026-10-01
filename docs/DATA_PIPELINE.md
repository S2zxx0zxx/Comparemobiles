# CompareMobile Data Pipeline V1

The catalog is source-first and region-aware.

```text
Primary/free source
  -> source adapter
  -> Zod contract validation
  -> normalization
  -> identity + duplicate checks
  -> provenance coverage
  -> review/verification
  -> D1 transaction
  -> cache/static regeneration
```

## Non-negotiable rules

- A phone is never globally merged across regions merely because the marketing name matches.
- Unknown values remain unknown; they are not converted to zero or guessed defaults.
- Every tracked specification written by an importer must have an attached provenance claim.
- Retail prices are time-stamped snapshots, not permanent device fields.
- Product URLs and affiliate URLs are stored separately.
- A stale or availability-unknown offer must not be described as a current/live price.
- Manufacturer-specific adapters normalize into the same canonical import contract.
- Competitor databases are not treated as the master data source.

## Device identity

Preferred identity components:
1. normalized brand,
2. manufacturer model number when available, otherwise normalized product name,
3. region.

Variants use device identity + region + SKU/RAM/storage/color.

This prevents India, China and global variants from silently collapsing into one record.
