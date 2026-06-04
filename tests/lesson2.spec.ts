import { test, expect } from "@playwright/test"
import { performance} from "node:perf_hooks"

test.describe("Trang chu playwright.frb", () => {
  test("TC_01 check menu hien thi DOCS", async ({ page }) => {
    await page.goto("https://playwright.dev");
    await expect(page.getByRole("link", { name: "Docs" })).toBeVisible();
  });
  test("TC_02 check url cua trang", async ({ page }) => {
    await page.goto("https://playwright.dev");
    await expect(page).toHaveTitle(
      "Fast and reliable end-to-end testing for modern web apps | Playwright",
    );
  });
});

test.describe("Trang nhân sự Anh Tester", () => {
  test("Kịch bản đăng nhập và kiểm tra widget", async ({
    page,
    browserName,
  }) => {
    await test.step("Bước 1: Điều hướng và đăng nhập", async () => {
      await page.goto("https://hrm.anhtester.com/");

      await page.locator("#iusername").fill("admin_example");

      await page.locator("#ipassword").fill("password_example");

      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.locator(".page-header h4")).toHaveText(
        "Welcome back, Admin!",
      );
    });

    await test.step("Bước 2: Kiểm tra các widget cơ bản trên Dashboard", async () => {
      await expect(page.getByText("Employees")).toBeVisible();

      await expect(page.getByText("Projects")).toBeVisible();
    });

    await test.step("Bước 3: Kiểm tra widget đặc biệt (chỉ có trên Chrome)", async (step) => {
      // Bỏ qua bước này nếu trình duyệt không phải là Chromium

      step.skip(
        browserName !== "chromium",
        "Widget này chỉ được thiết kế cho trình duyệt Chrome.",
      );

      console.log(
        `Đang chạy trên ${browserName}, tiếp tục kiểm tra widget đặc biệt...`,
      );

      // Giả sử có một widget chỉ hiển thị trên Chrome

      await expect(page.locator("#chrome-special-widget")).toBeVisible();
    });

    await test.step("Bước 4: Đăng xuất", async () => {
      await page.getByRole("link", { name: "Logout" }).click();

      await expect(page).toHaveURL(/.*login/);
    });
  });
});

// Demo waitUntil?: "load'|"domcontentloaded"|"networkidle"|"commit"
const TARGET_URL = 'https://playwright.dev'

test('TC01 - Demo domcontentloaded', async ({page}) => {
    console.log('Demo wait until - domcontentloaded');
    const startTime = performance.now();
    await page.goto(TARGET_URL,{waitUntil: 'domcontentloaded'});
    const endTime = performance.now();
    console.log(`Thoi gian hoan tat, ${endTime - startTime} `);
    const rootElement = page.locator(`#__docusaurus`);
    await expect(rootElement).toBeAttached(); // Verify element đã được gắn vào DOM thành công
    await expect(page.getByRole('link',{name: 'Docs'})).toBeVisible();
})

test('TC02 - Demo load', async ({page}) => {
    console.log('Demo wait until - load');
    const startTime = performance.now();
    await page.goto(TARGET_URL);
    const endTime = performance.now();
    console.log(`Thoi gian hoan tat, ${endTime - startTime} `);
    const searchButton = page.getByRole('button', { name: 'Search (Meta+k)' });
    await expect(searchButton).toBeEnabled(); // Vì khi chưa load xong các file JS thì 
    // các phần tử sẽ không thể tương tác được trên UI
})

test('TC03 - Demo networkidle', async ({page}) => {
    console.log('Demo wait until - domcontentloaded');
    const startTime = performance.now();
    await page.goto(TARGET_URL,{waitUntil: 'networkidle'});
    const endTime = performance.now();
    console.log(`Thoi gian hoan tat, ${endTime - startTime} `);

    // Tại thời điểm này, trang đã tĩnh, không còn hoạt động call API gì nữa
    const searchButton = page.getByRole('button', { name: 'Search (Meta+k)' });
    await expect(searchButton).toBeEnabled();
})