import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function settleFullPage(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(window.innerHeight * 0.7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
    const active = document.activeElement;
    if (active instanceof HTMLElement) active.blur();
  });
  await page.waitForTimeout(300);
}

async function expectNoBodyOverflow(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test("homepage renders without viewport overflow", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Find the phone");
  await expectNoBodyOverflow(page);
  await settleFullPage(page);
  await testInfo.attach(`homepage-${testInfo.project.name}`, {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
});


test("core routes produce reviewable desktop and mobile renders", async ({ page }, testInfo) => {
  const routes = [
    { path: "/", key: "home" },
    { path: "/phones", key: "phones" },
    { path: "/phones/oneplus-15", key: "phone-detail" },
    { path: "/compare", key: "compare" },
    { path: "/finder", key: "finder" },
  ];

  for (const route of routes) {
    await page.goto(route.path);
    await expect(page.locator("main")).toBeVisible();
    await expectNoBodyOverflow(page);
    await settleFullPage(page);
    await testInfo.attach(`visual-${route.key}-${testInfo.project.name}`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  }
});

test("compare supports differences-only workflow", async ({ page }) => {
  await page.goto("/compare");
  const toggle = page.getByRole("button", { name: "Differences only" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("9 of 10 specification rows visible", { exact: true })).toBeVisible();
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
  await settleFullPage(page);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const blocking = results.violations.filter((violation) =>
    violation.impact === "serious" || violation.impact === "critical",
  );
  expect(
    blocking,
    blocking.map((violation) => `${violation.id}: ${violation.help}`).join("\n"),
  ).toEqual([]);
});
