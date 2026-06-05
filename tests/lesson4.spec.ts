import { test, expect } from "@playwright/test";

// Auto-Waiting
// Để check các cấp độ auto-waiting:
// Set action-time out = 10 s
// Set timeout = 15s (toàn cục)
test("Auto-waiting - cấp độ 1", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();

  const batDauTestButton = page.locator(
    `//span[contains(text(),'Bắt đầu Test')]//parent::button`,
  );
  const slowButton1 = page.locator(`#button-1`);

  await batDauTestButton.click();
  // Set inline Timeout = 5000 ms
  // Button slow 1 sẽ enable sau 6s
  // => expected: phải báo lỗi
  await slowButton1.click({ timeout: 5000 });
});

test("Auto-waiting - cấp độ 2", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();

  const batDauTestButton = page.locator(
    `//span[contains(text(),'Bắt đầu Test')]//parent::button`,
  );
  const slowButton2 = page.locator(`#button-2`);

  await batDauTestButton.click();

  // Set action timeout = 10s
  // Button slow 2 sẽ enable sau 12s
  // => expected: phải báo lỗi

  await slowButton2.click();
});

test("Auto-waiting - cấp độ 3", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();

  const startButton = page.locator(
    `//span[contains(text(),'Bắt đầu Xử lý')]//parent::button`,
  );
  const continueButton = page.locator(
    `//span[contains(text(),'Tiếp tục')]//parent::button`,
  );
  const completedButton = page.locator(
    `//span[contains(text(),'Hoàn thành')]//parent::button`,
  );

  // Action timeout set là 10s mà tiến trình chỉ có 8s
  // => expected phải passed
  await startButton.click();

  // Action time set là 10s mà tiến trình cũng chỉ có 8s
  // => expected phải passed
  await continueButton.click();

  // Tổng time 2 step ở trên sẽ mất ít nhất 16s => button completed mới xuất hiện đc
  await completedButton.click();
  // => sẽ failed
  // Cách xử lý
  // 1. Tăng timeout trong config. Hoặc xóa dòng config đi vì default của PW là 30s
  // 2. Thêm test.setTimeout(30000) ở trước testcase
});

// Trên thực tế thì nên set timeout toàn cục (timeout cho từng tcs) là 2 phút
// Với trường hợp có case đặc thù cần chạy lâu hơn, hoặc có thể chạy ngắn hơn thì
// ta có thể dùng test.setTimeout. Lưu ý dùng cái này thì nó sẽ set cho toàn bộ các tcs bên dưới nó

// Web first assertion
test("Web first assertion - cấp độ 1", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'Web-First')]//parent::button`)
    .click();

  const startWaitingButtonLocator = page.getByText(`Bắt đầu chờ`);
  const statusMessageLocator = page.locator(`#status-message`);

  await startWaitingButtonLocator.click();

  // PW sẽ có cơ chế retry để đảm bảo sau x giây locator sẽ được expect như mong muốn
  // Nếu không thì sẽ throw lỗi timeout
  // Ở đây set timeout cho hàm toHaveText là 5s mà để tải dữ liệu phải mất 7s
  // => chắc chắn failed
  await expect(statusMessageLocator).toHaveText(`Tải dữ liệu thành công!`, {
    timeout: 8000,
  });
  await expect(statusMessageLocator).toBeVisible();
});

// expect : toBeAttached
test("Web first assertion - toBeAttached", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  const attachElementButtonLocator = page.getByRole("button", {
    name: "Attach Element",
  });
  const attachedMessageLocator = page.locator(
    `#attached-container #attached-node`,
  );

  await attachElementButtonLocator.click();
  // Bản chất của toBeAttached nghĩa là assert 1 element được attached vào DOM
  // Với trường hợp này: sau khi click vào button attach element
  // Thì dòng thông báo "I'm attached mới" hiển thị và thẻ của nó mới được gắn và xuất hiện trên DOM

  await expect(attachedMessageLocator).toBeAttached();
});

// toBeVisible
// Kiểm tra phần tử vừa tồn tại trong DOM , vừa đang hiển thị trên UI (có kích thước lớn hơn 0, không bị phần tử nào khác che khuất)
// VD: nó không có display: none hoặc visibility: hidden => vì khi 1 element có những cái này
// thì nó vẫn có trên DOM nhưng ở trên UI sẽ bị ẩn đi thì sử dụng toBeVisible sẽ bị failed

test("Web first assertion - toBeVisible", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();
  await page.locator(`#btn-hide`).click();
  await page.locator(`#btn-show`).click();

  const visibleMessageLocator = page.locator(`//div[@id='visibility-target']`);
  await expect(visibleMessageLocator).toBeVisible();
});

// toBeHidden:
// Là phủ định của toBeVisible => check không có trong DOM hoặc bị ẩn
test("Web first assertion - toBeHidden", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();
  await page.locator(`#btn-hide-for-hidden`).click();

  const targetHiddenLocator = page.locator(`//div[@id='hidden-target']`);
  await expect(targetHiddenLocator).toBeHidden();
});

// toBeChecked:
// Kiểm tra 1 check box đã được check/ 1 radio button đã được check
test("Web first assertion - toBeChecked", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click vào checkbox nhận thông báo:
  const getNotiCheckboxLocator = page.locator(`//input[@id='news-check']`);
  await getNotiCheckboxLocator.click();

  await expect(getNotiCheckboxLocator).toBeChecked();

  // Click vào tab:
  const tabLocator = page.locator(`//div[@id='tab-option']`);
  await tabLocator.click();
  // Đối với dạng chọn value trong 1 tab => phải dùng getAttribute để lấy ra attribute của tab đó có giá trị:
  // aria-selected = "true"
  // Sau đó dùng toHaveAttribute để assertion
  const tabAriaSelectedValue = await tabLocator.getAttribute(`aria-selected`);
  expect(tabAriaSelectedValue).toBe(`true`);
  await expect(tabLocator).toHaveAttribute(`aria-selected`,`true`);
});

// toBeDisabled:
// Dùng để check 1 phần tử bị disabled/ bị vô hiệu hóa:
test("Web first assertion - toBeDisabled", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click vào button disabled
  await page.locator(`#toggle-disabled`).click();

  const selectDropdownLocator = page.locator(`//select[@id='disabled-select']`);
  const emailTextboxLocator = page.getByRole("textbox", { name: "Email" });
  const textAreaLocator = page.locator(`//textarea[@id='disabled-textarea']`);

  await expect(selectDropdownLocator).toBeDisabled();
  await expect(emailTextboxLocator).toBeDisabled();
  await expect(textAreaLocator).toBeDisabled();
});

// toBeDisabled:
// Verify element không bị disabled
test("Web first assertion - toBeEnabled", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  const enabledInputTextboxLocator = page.locator(
    `//input[@id='enabled-input']`,
  );
  await expect(enabledInputTextboxLocator).toBeEnabled();
});

// toBeEditable:
// Kiểm tra element có thể nhận được nội dung nhập liệu. Ko bị disbaled hay không có thuộc tính read-only
test("Web first assertion - toBeEditable", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  const helloPWInputTextboxLocator = page.locator(`//div[@id='editable']`);
  await expect(helloPWInputTextboxLocator).toBeEditable();
}); //button[@id='btn-clear']

// toBeEmpty:
// Kiểm tra element không chứa dữ liệu/ chứa bất kì phần tử con nào hoặc không có nội dung text
test("Web first assertion - toBeEmpty", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click on clear button:
  await page.locator(`//button[@id='btn-clear']`).click();

  // Verify textbox is empty
  const emptyTextboxLocator = page.locator(`//div[@id='empty-box']`);
  await expect(emptyTextboxLocator).toBeEmpty();
});

//toHaveCount:
// Kiểm tra 1 element có chứa chính xác bao nhiêu phần tử bên trong đó (Bên trong 1 list)
test("Web first assertion - toHaveCount", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click twice on add button to add 2 item into the item list:
  await page.locator(`//button[@id='btn-add-item']`).dblclick();

  // Verify textbox is empty
  const itemsInItemListLocator = page.locator(`//ul[@id='items']//li`);
  await expect(itemsInItemListLocator).toHaveCount(4);
});

//toContainText:
// Tượng tự như contain như trong XPath. Dùng để kiểm tra text trong element có chứa 1 đoạn text nhất định
// Không phân biệt hoa, thường và tự chuẩn hóa khoảng trắng
test("Web first assertion - toContainText", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

// Complex Text    
  // Click on complex text button
  await page.locator(`//button[@id='btn-set-complex-text']`).dblclick();

  const textContainerTextbox = page.locator(`//div[@id='text-container']`);
  // Verify Complex text case: 
  await expect(textContainerTextbox).toContainText(`john`);
  await expect(textContainerTextbox).toContainText(`example.com`);

// Mixed Text case (uppercase and lowercase)    
  // Click on mixed case button
  await page.locator(`//button[@id='btn-set-mixed-case']`).dblclick();

  // Verify Complex text case: 
  await expect(textContainerTextbox).toContainText(`UPPERCASE`);
  await expect(textContainerTextbox).toContainText(`lowercase`);  
  await expect(textContainerTextbox).toContainText(`Title Case`);
  
// Whitespace case
  // Click on Whitespace button
  await page.locator(`//button[@id='btn-set-whitespace']`).dblclick();

  // Verify Complex text case: 
  await expect(textContainerTextbox).toContainText(`Hello Playwright`);
  await expect(textContainerTextbox).toContainText(`,
  welcome here!`);  
});

// toBeFocused:
// Check element dduowcj focus vào ô input khi sau con chỏ chuột click vào
// VD click submit và báo lỗi ở 1 số các trường require nhưng chưa có value
test("Web first assertion - toBeFocused", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click on clear button:
  await page.locator(`//button[@id='btn-focus']`).click();

  // Verify textbox is empty
  const focusableTextboxLocator = page.locator(`//input[@id='focusable']`);
  await expect(focusableTextboxLocator).toBeFocused();
});

// toHaveValue và toHaveValues:
// Check attribute value trong thẻ xem có giá trị hay không (1 hoặc nhiều giá trị)
// toHaveValues dùng để check giá trị hiện tại của 1 thẻ select multiple có bao nhiêu phần tử trong 1 array
test("Web first assertion - toHaveValue", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click on set value button:
  await page.locator(`//span[text()='Set Value']//parent::button`).click();

  // Verify value in the textbox
  const valueInputTextboxLocator = page.locator(`//input[@id='value-input']`);
  await expect(valueInputTextboxLocator).toHaveValue(`Hello World`);
});

test("Web first assertion - toHaveValues", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click on set value button:
  await page.getByText("Set Values",{exact: true}).click();

  // Verify multiple select value in the textbox
  // Lưu ý chỉ check với thẻ select, không cần gọi đến các thẻ option bên trong
  const multipleValueTextboxLocator = page.locator(`//select[@id='multi-select']`);
  await expect(multipleValueTextboxLocator).toHaveValues(['Action','Drama']);
});

//toContainClass: 
// Dùng để check 1 element có attribute class và gía trị expect chỉ cần khớp 1 phần so với giá trị thực tế của attribute class

//toHaveClass:
// Tương tư như trên nhưng giá trị expect phải chính xác với giá trị thực tế của attribute class

//toHaveCSS:
// Kiểm tra element có attribute style và giá trị expect có nằm trong value của attribute style

test("Web first assertion - toContainClass - toHaveClass - toHaveCSS", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click on add exact class button
  await page.locator(`#btn-toggle-exact-class`).click();

  // Verify: 
  const exactClassTargetDivLocator = page.locator(`//div[@id='exact-class-target']`);
  await expect(exactClassTargetDivLocator).toHaveClass(`highlight`);
  await expect(exactClassTargetDivLocator).toHaveCSS(`padding`, `12px`);
  await expect(exactClassTargetDivLocator).toHaveCSS(`background-color`, `rgb(255, 251, 230)`);
});

//toHaveAttribute:
test("Web first assertion - toHaveAttribute", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Click on add attribute
  await page.locator(`//button[@id='btn-toggle-attr']`).click();

  // Verify: 
  const imageAddAttrLocator = page.locator(`//img[@id='avatar']`);
  await expect(imageAddAttrLocator).toHaveAttribute(`alt`,`User Avatar`);
});

//toHaveId:
test("Web first assertion - toHaveId", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();

  // Verify: 
  const elementWithSpecificIdLocator = page.locator(`//div[@id='unique-id']`);
  await expect(elementWithSpecificIdLocator).toHaveId(`unique-id`);
});

//toBeInViewport:
test("Web first assertion - toBeInViewport", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();
  
  // Scroll to viewport target:
  const viewportTargetLocator = page.locator(`//div[@id='viewport-target']`); 
  await viewportTargetLocator.scrollIntoViewIfNeeded();

  // Verify: 
  await expect(viewportTargetLocator).toBeInViewport()
});

//toHaveText:
// Kiểm tra text trong element khớp chính xác 100% với text trong expect
// Nó có , có phân biệt hoa thường và có tự động trim whitespace
test("Web first assertion - toHaveText", async ({ page }) => {
  await page.goto("https://demoapp-sable-gamma.vercel.app/");
  await page.getByRole("link", { name: "Bài 1: Auto-Wait Demo" }).click();
  await page
    .locator(`//span[contains(text(),'expect() có await')]//parent::button`)
    .click();
  
  // Click on whitespace text button:
  await page.getByRole("button",{name: "Whitespace Text"}).click();
  
  // Verify text "Data loaded successfully!"
  const expectedTextLocator = page.locator(`//div[@id='status-text']/child::div/child::div`).nth(1);
  await expect(expectedTextLocator).toHaveText(`Data loaded successfully!`); 
       // Chứng mình hàm toHaveText có tự động trim khoảng trắng ở 2 đầu
  await expect(expectedTextLocator).toHaveText(`   Data loaded successfully!   `);
});