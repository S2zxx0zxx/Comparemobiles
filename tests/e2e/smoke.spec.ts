import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoBodyOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test("homepage renders without viewport overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Find the phone");
  await expectNoBodyOverflow(page);
  await testInfo.attach(`homepage-${testInfo.project.name}`, { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});

test("compare supports differences-only workflow", async ({ page }) => {
  await page.goto("/compare");
  const toggle = page.getByRole("button", { name: "Differences only" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("columnheader", { name: "Specification" })).toBeVisible();
});

test("finder persists filters in the URL", async ({ page }) => {
  await page.goto("/finder");
  await page.getByRole("button", { name: "India", exact: true }).click();
  await expect(page).toHaveURL(/market=India/);
  await page.getByRole("button", { name: "OnePlus", exact: true }).click();
  await expect(page).toHaveURL(/brand=OnePlus/);
});

test("404 gives recovery actions", async ({ page }) => {
  await page.goto("/definitely-not-a-real-route");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not in the catalog");
  await expect(page.getByRole("link", { name: "Browse phones" })).toBeVisible();
});

test("core page has no serious or critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const blocking = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(blocking, blocking.map((violation) => `${violation.id}: ${violation.help}`).join("\n")).toEqual([]);
});
