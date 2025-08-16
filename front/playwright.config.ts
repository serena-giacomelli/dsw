import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 5_000 },
  retries: 1,
  reporter: [["html", { open: "never" }], ["line"]],
  use: {
    baseURL: "http://localhost:9000/",
    headless: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:9000/",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});