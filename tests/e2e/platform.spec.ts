import { test, expect } from "@playwright/test";

test.describe("Drug Repositioning Platform", () => {
  test("homepage loads with research disclaimer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Research intelligence"
    );
    await expect(page.getByText("Medical disclaimer").first()).toBeVisible();
  });

  test("drug detail page for levothyroxine", async ({ page }) => {
    await page.goto("/drugs/levothyroxine");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Levothyroxine"
    );
    await expect(page.getByText("Why this drug?")).toBeVisible();
    await expect(page.getByText("Known risks")).toBeVisible();
  });

  test("evidence page shows graded records", async ({ page }) => {
    await page.goto("/evidence");
    await expect(page.getByText("Approved").first()).toBeVisible();
  });

  test("health API returns healthy status", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("healthy");
    expect(body.stats.evidenceCount).toBe(10);
  });

  test("old routes redirect to new IA", async ({ page }) => {
    await page.goto("/drug");
    await expect(page).toHaveURL(/\/drugs/);
  });
});
