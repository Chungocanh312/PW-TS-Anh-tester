## Codegen
Khi mở codegen 
> npx playwrigt codegen url

- Record : sẽ lưu lại tất cả các action của mình
- Pick locator : khi mình chỉ vào các element trên web thì sẽ hiển thị locator cho mình
- Assert text: sau khi bấm record, chọn assert text, chỏ vào 1 element mà mình cần verify text của nó và accept.PW sẽ tự động gen ra câu lệnh assert vs hàm expect để kiểm tra giá trị text đó có tồn tại trên trang đó không
- Assert value: cách dùng giống assert text nhưng để xác minh 1 element có value cụ thể nào không

## test case structure
Cấu trúc 1 test case trong playwright:
- Khi tạo thì phải tạo 1 file có tên chứa .spec.ts (chuẩn spec là viết tắt của specification)
- Có thể chạy bằng 1 tên khác (k dùng .spec.ts) . Tuy nhiên cứ theo quy chuẩn mà làm vì liên quan tới việc IDE có thể k tìm thấy file test khi chạy
- Nếu muốn thay đổi => vào playwright.config.ts thêm thuộc tính testMatch: 
```typescript
VD: thay .spec.ts bằng kiemthu.ts 
=> thêm:
testMatch: '**/*.kiemthu.ts',
```


test.describe => Ta có thể tạo test suite => trong đó sẽ chứa nhiều các test case
test.step => Tăng tính dễ đọc và dễ gỡ lỗi cho báo cáo.Chia nhỏ một test case phức tạp thành các phần logic.

### Annotation
Chúng ta sẽ chia Annotations thành 2 cấp độ:
- Test-Level Annotations: Áp dụng cho toàn bộ test() hoặc test.describe().
- Step-Level Annotations: Áp dụng cho một test.step() cụ thể bên trong một test.

#### Phần 1: Test-Level Annotations (Dành cho test() và test.describe())
test.only(description)
=> Chỉ chạy duy nhất test case (hoặc nhóm describe) được đánh dấu only. Tất cả các test khác trong toàn bộ dự án sẽ bị bỏ qua

test.skip(description) hoặc test.skip(condition, description)
=> Bỏ qua, không chạy một test case hoặc một nhóm test

test.fail(description) hoặc test.fail(condition, description)
=> Đánh dấu một test case là **"dự kiến sẽ thất bại"**. Playwright vẫn sẽ chạy test này.

test.fixme(description)
=> Tương tự như test.skip, nhưng mang ý nghĩa mạnh mẽ hơn. Nó đánh dấu một test đang bị hỏng và **cần phải được sửa**

test.slow(description)
=> Đánh dấu một test case là chạy chậm. Playwright sẽ **tự động tăng gấp 3 lần thời gian timeout mặc định** cho test đó.

#### Phần 2 Step-Level Annotations (Dành cho test.step())
step.skip(condition, description)
=> Bỏ qua một bước cụ thể bên trong một test case đang chạy nếu một điều kiện được đáp ứng.

```typescript
test.describe('Trang nhân sự Anh Tester', () => {

  test('Kịch bản đăng nhập và kiểm tra widget', async ({ page, browserName }) => {

    await test.step('Bước 1: Điều hướng và đăng nhập', async () => {

      await page.goto('https://hrm.anhtester.com/');

      await page.locator('#iusername').fill('admin_example');

      await page.locator('#ipassword').fill('password_example');

      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.locator('.page-header h4')).toHaveText('Welcome back, Admin!');

    });


    await test.step('Bước 2: Kiểm tra các widget cơ bản trên Dashboard', async () => {

      await expect(page.getByText('Employees')).toBeVisible();

      await expect(page.getByText('Projects')).toBeVisible();

    });


    await test.step('Bước 3: Kiểm tra widget đặc biệt (chỉ có trên Chrome)', async (step) => {

      // Bỏ qua bước này nếu trình duyệt không phải là Chromium

      step.skip(browserName !== 'chromium', 'Widget này chỉ được thiết kế cho trình duyệt Chrome.');

     
      console.log(`Đang chạy trên ${browserName}, tiếp tục kiểm tra widget đặc biệt...`);

      // Giả sử có một widget chỉ hiển thị trên Chrome

      await expect(page.locator('#chrome-special-widget')).toBeVisible();

    });


    await test.step('Bước 4: Đăng xuất', async () => {

      await page.getByRole('link', { name: 'Logout' }).click();

      await expect(page).toHaveURL(/.*login/);

    });
 });
});
```
Kiến thức ngoài lề:
Một số các hàm trong page (VD như hàm goto) sẽ có tham số: 
waitUntil?: "load'|"domcontentloaded"|"networkidle"|"commit"
=>
- load: (default) : chờ cho toàn bộ HTML và tất cả các tài nguyên khác (ảnh, file js, file css) được tải xong
- domcontentloaded: chỉ chờ đến khi tài liệu HTML ban đầu được tải mà không cần chờ cho CSS hay hình ảnh được tải
- networkidle: chờ cho đến khi không có hoạt động nào diễn ra (HTML,js, css, API calling), trong vòng 500 milisecond, phù hợp với site client side rendering
- commit: chỉ chờ cho đến khi nhận được phản hồi từ server và trình duyệt bắt đầu render trang (ít dùng, gần như không dùng)

```typescript 
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
```
#### Cơ chế AutoWait
```typescript
test('test', async ({ page }) => {
  await page.goto('https://demoapp-sable-gamma.vercel.app/');
  await page.getByRole('link', { name: 'Bài 1: Auto-Wait Demo' }).click();
  await page.getByRole('button', { name: 'history 📜 Phiên bản cũ' }).click();
  await page.getByRole('button', { name: 'Click Me!!' }).click(); 
  // Hàm click sẽ có auto-wait trong 30s để cho element cần tương tác ổn định và có thể tương tác thành công. Ngoài ra có thể tự set time out bằng cách thêm tham số timeout vào hàm click
  await expect(page.locator('#status')).toContainText('Button Clicked Successfully!');
});