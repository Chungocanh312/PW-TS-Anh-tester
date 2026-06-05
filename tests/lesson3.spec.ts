import { test, expect } from "@playwright/test";

test.describe("Explicit vs. Implicit Role Priority", () => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head><title>Role Priority Demo</title></head>
<body>
    <button id="btn-normal">Nút Bấm Chuẩn</button>
    <h2 id="btn-heading" role="button" tabindex="0">Tiêu đề hoạt động như Nút bấm</h2>
</body>
</html>-****`;

  test("should demonstrate that explicit role overrides implicit role", async ({
    page,
  }) => {
    await page.setContent(htmlContent);
    // --- KIỂM TRA CÁC NÚT BẤM ---
    // 1. Tìm nút bấm chuẩn. Vai trò ngầm định của <button> là 'button'.

    const normalButton = page.getByRole("button", { name: "Nút Bấm Chuẩn" });

    await expect(normalButton).toBeVisible(); // SẼ THÀNH CÔNG (PASS)

    console.log('✅ Đã tìm thấy <button> bằng getByRole("button").');
    // 2. Tìm "nút bấm" được tạo từ thẻ <h2>.

    // Vì có `role="button"`, vai trò tường minh này sẽ ghi đè vai trò ngầm định 'heading'.

    const headingAsButton = page.getByRole("button", {
      name: "Tiêu đề hoạt động như Nút bấm",
    });

    await expect(headingAsButton).toBeVisible(); // SẼ THÀNH CÔNG (PASS)

    console.log(
      '✅ Đã tìm thấy <h2> với role="button" bằng getByRole("button").',
    );

    // --- KIỂM TRA SỰ GHI ĐÈ --

    // 3. Bây giờ, hãy thử tìm lại phần tử <h2> đó bằng vai trò ngầm định 'heading' của nó.

    const headingLocator = page.getByRole("heading", {
      name: "Tiêu đề hoạt động như Nút bấm",
    });

    // Lệnh này SẼ THẤT BẠI, vì vai trò 'heading' đã bị 'button' ghi đè.

    // Trình duyệt không còn coi nó là một 'heading' nữa.

    await expect(headingLocator).toBeHidden(); // Khẳng định rằng nó bị ẩn/không tìm thấy

    console.log(
      '✅ Đã xác nhận không thể tìm thấy <h2> đó bằng getByRole("heading").',
    );
  });
});

test("should delete the correct user using a resilient CSS selector", async ({
  page,
}) => {
  const html = `
  <div class="user-list">
    <div class="user-row" data-username="alice">
        <span>Alice</span>
        <button class="btn delete-btn">Xóa</button>
    </div>
    <div class="user-row" data-username="bob">
        <span>Bob</span>
        <button class="btn delete-btn">Xóa</button>
    </div>
</div>
  `;

  await page.setContent(html);

  // Xây dựng locator theo chiến lược "Mỏ neo"

  const deleteBobButton = page.locator(
    "div[data-username='bob'] button.delete-btn",
  );
  // Khẳng định rằng locator của chúng ta chỉ tìm thấy 1 phần tử duy nhất

  await expect(deleteBobButton).toHaveCount(1);

  // Thực hiện hành động

  await deleteBobButton.click();

  // (Trong ứng dụng thực, ta sẽ xác minh rằng dòng của 'bob' đã biến mất)

  const bobRow = page.locator("div[data-username='bob']");

  await expect(bobRow).toBeHidden();
});

test("Demo vai trò ngầm định", async ({ page }) => {
  // element trang chủ là 1 thẻ <a href="#home">Trang chủ</a>
  // Trong đó khi check accessibility thì có role = link
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 2: Playwright Locators" }).click();
  await page.getByRole("button", { name: "Playwright getByRole" }).click();
  const locatorTrangChu = page.getByRole("link", { name: "Trang chủ" });
  const locatorRoleArticle = page.getByRole("heading", {name: "Role: article"});
  
  // check highlight đúng locator của link trang chủ
  await locatorTrangChu.highlight();

  // Expect Role Article visible
  await expect(locatorRoleArticle).toBeVisible();

  // Điền tên vào textbox tên
  await page.getByRole("textbox",{name:"Tên:"}).fill("Ngoc Anh")
  await page.pause();  
});

test('bắt locator bằng getByRole và Tương tác với check box, text box', async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 2: Playwright Locators" }).click();
  await page.getByRole("button", { name: "Playwright getByRole" }).click(); 

  const dongYDieuKhoanCheckbox = page.getByRole("checkbox",{name: " Đồng ý điều khoản"});
  const namCheckbox = page.getByRole("radio",{name: "Nam"});
  const emailTextbox = page.getByRole("textbox", {name: "Email: " });
  const matKhauTextbox = page.getByRole("textbox",{name: "Mật khẩu: "});
  const ghiChuTextbox = page.getByRole("textbox",{name: "Ghi chú: "});
  const theDivThongThuongLocator = page.getByRole("heading",{name: "❌ Thẻ <div> thông thường"});

  await dongYDieuKhoanCheckbox.check();
  await namCheckbox.click();
  await emailTextbox.fill("anh@gmail.com");
  await matKhauTextbox.fill("anhcn");
  await ghiChuTextbox.fill("anhcn")
  
  await theDivThongThuongLocator.highlight();
  await page.pause();

});


test('Playwright getByRole, bai tap', async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 2: Playwright Locators" }).click();
  await page.getByRole("button", { name: "Playwright getByRole" }).click(); 

  const baiTapLocator = page.getByRole("button", {name: "Bài tập", exact: true});
  await baiTapLocator.click();

  // Click on bold button
  await page.getByRole("button", {name: "Bold", disabled: true}).click();

  // Mở menu More options và chọn mục duplicate
  const moreLocator = page.getByRole("button", {name: "More options"});
  const duplicateLocator = page.getByRole("menuitem",{name: "Duplicate"});
  await moreLocator.click();
  await duplicateLocator.click();

  // Xác nhận mục download Option đang bị disable
  const downloadLocator = page.getByRole("menuitem", {name: "Download (disabled)", disabled: true});
  await moreLocator.click();
  await expect(downloadLocator).toBeDisabled();
});
