import { expect, test } from "@playwright/test";

test("landing loads all local assets", async ({ page }) => {
  const failed = [];

  page.on("response", (response) => {
    const url = response.url();
    if (url.startsWith("http://127.0.0.1:4173/") && response.status() >= 400) {
      failed.push(`${response.status()} ${url}`);
    }
  });

  await page.goto("/");
  await expect(page.locator(".figma-page")).toBeVisible();
  await expect(page.locator("img").first()).toBeVisible();
  expect(failed).toEqual([]);
});

test("mobile layout has no horizontal document overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only layout check.");

  await page.goto("/");
  const metrics = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
});

test("desktop and mobile visual smoke", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const screenshot = await page.screenshot({ fullPage: true });
  expect(screenshot.byteLength).toBeGreaterThan(10000);
});
