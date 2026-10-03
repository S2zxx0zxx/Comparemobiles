# CompareMobile ingestion architecture

## Rule 1: never make HTML scraping the canonical contract

Manufacturer websites change frequently. CompareMobile separates source acquisition, manufacturer-specific field mapping, canonical validation, normalization, provenance validation, deterministic identity/deduplication, and persistence.

Manufacturer adapters accept an injected loader. A loader may later read an official structured endpoint, a reviewed export, or another legally reusable source without changing the canonical device contract.

## Current manufacturer adapters

- OnePlus official adapter
- Samsung official adapter
- vivo / iQOO official adapter
- Apple official adapter
- Google official adapter
- Xiaomi / Redmi / POCO official adapter
- OPPO / realme official adapter
- Motorola official adapter
- Nothing official adapter

Each adapter maps source-specific naming into the canonical DeviceImport contract, keeps market context explicit, creates a primary-source provenance claim, and keeps retailer offers separate.

## Required ingestion sequence

official source -> loader -> manufacturer adapter -> Zod contract -> normalization -> provenance guard -> identity/dedupe -> verification queue -> D1

A record that fails validation is rejected instead of being silently repaired into invented data.

## Expansion rule

Add another manufacturer only when its official source can be represented without copying a proprietary competitor database. Every new adapter requires tests for market isolation and canonical mapping.
