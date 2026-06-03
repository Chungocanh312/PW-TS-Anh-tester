Giải thích ({page}) được truyền vào arrow function có trong các test title
=> nó là 1 dạng destructuring để gọi đến thuộc tính page có trong object fixture của thư viện playwright

Destructuring nghĩa là gì?
VD: 
```typescript
type User = {
    id: number;
    userName: string;
    email: string
}

const userProfile: User = {
    id: 101,
    userName: 'An',
    email: 'An@gmail.com'
}

// Để in ra các thuôc tính bên trong userProfile
// C1: phổ thông
console.log(userProfile.id);
console.log(userProfile.userName);

// C2: Dùng cú pháp destructuring trong js-ts để phân rã object từ đó
// cho phép gọi đến trực tiếp các thuộc tính bên trong object
const {id, userName} = userProfile;
console.log(id);
console.log(userName);

// Trong trường hợp ta muốn gán lại biến, không dùng đúng tên key của thuộc tính
// Mà viết lại bằng 1 tên khác. VD userId thay cho id
const {id: userId, userName: userName1, email: userEmail} = userProfile;
console.log(userEmail);
console.log(userId);
console.log(userName1);

// Command chạy file ts: npx ts-node test.ts  

type Options = {
    url: string;
    method: 'GET' | 'POST'
}

function makeApiCall({url, method = 'GET'}: Options){
    console.log(`Making ${method} request to: ${url}`);
}

const requestOptions: Options = {
    url: '/api/user',
    method: 'POST'
}

makeApiCall(requestOptions)

// Giải thích thêm cho đoạn trên
// Thông thường ở đây ta sẽ viết kiểu:
// function makeApiCall(options: Options) {
//    const url = options.url;
//    const method = options.method ?? 'GET'; // nếu method undefined → dùng 'GET'

//    console.log(`Making ${method} request to: ${url}`);
// }

// => từ đây áp dụng sang ({page}) . 
// Trong các file test ta đều import test, expect từ thư viện @playwright/test
// Trong test sẽ chứa các object, hàm có dạng như sau:
type Fixtures = {
    page: string;
};

function myTest(
    title: string,
    callback: (fixtures: Fixtures) => void
) {
    callback({
        page: 'Chrome page'
    });
}

// => khi gọi hàm myTest (tức chính là hàm test bình thường ta hay thấy)
myTest('demo', ({ page }) => {
    console.log(page);
});
 
```

Page đại diện cho 1 tab trên browser
Với playwright thì ta không cần khởi tạo page => playwright sẽ tự khởi tạo page cho mình
Vòng đời của 1 page khi chạy 1 test case:

1. Khởi tạo: đầu tiên PW sẽ tạo ra browserContext (giống như 1 profile riêng sạch sẽ)
=> sau đó sẽ mở ra 1 page / 1 tab mới hoàn toàn (như incognito)
2. Sử dụng: page => se được truyền vào qua cơ chế destructuring
=> toàn bộ testcase sẽ diễn ra trong khối ngoặc nhọn { } của hàm test
3. Sau khi chạy xong => page và browsercontext tương ứng sẽ bị tắt và hủy bỏ

Cách chạy test case:
Sử dụng lệnh:
```typescript
> npx playwright test 
```
npx là để yêu cầu chạy vào node_modules > thư viên @playwright > module test > tìm các file test và chạy

Lưu ý nên > cd .. để trở về project root để khi chạy test, tránh việc đọc thiếu file config

Cách check: dùng các command sau
pwd => để xem hiện tại đang ở thư mục nào
ls => để xem các thư mục khác đang có trong thư mục hiện tại
npx playwright test --list 
=> nếu khi mở list ta thấy đầy đủ các file trong project => oke. Khi đó mà chạy thì sẽ tránh đc các lỗi vặt

Cách mở 2 tab trên 1 trình duyệt
```typescript
// Mở 2 tab trên 1 trình duyệt
test('open 2 tab in 1 browser', async ({page, context})=> {
  // Tab 1:
   const playwrightPage = page
   await playwrightPage.goto('https://playwright.dev/');
   await playwrightPage.getByRole('button', { name: 'Search (Command+K)' }).click();
   await playwrightPage.getByRole('searchbox',{name:'Search'}).fill('Locators');
   console.log('Tab 1 đã gõ locators vào ô tìm kiếm')

  // Mở Tab 2:
  const hrmPage = await context.newPage();
  await hrmPage.goto('http://hrm.anhtester.com/');
  await hrmPage.getByRole('textbox', { name: 'Your Username' }).click();
  await hrmPage.getByRole('textbox', { name: 'Your Username' }).fill('admin_example');
  await hrmPage.getByRole('textbox', { name: 'Enter Password' }).click();
  await hrmPage.getByRole('textbox', { name: 'Enter Password' }).fill('passwrd_example');
  console.log('Tab 2 đã điền thông tin đăng nhập')

  // Back về tab 1:
  console.log('Back về tab 1:')
  await playwrightPage.getByRole('searchbox',{name:'Search'}).press('Enter');

  // Chụp ảnh lại từng tab:
  await playwrightPage.screenshot({path: 'screenshots/tab1-playwright.png'});
  await playwrightPage.screenshot({path: 'screenshots/tab1-hrm.png'});
})
```

1 cách debug hiểu quả đó là sử dụng:
```typescript
await page.pause();
```
Khi playwright chạy đến dòng code này thì sẽ tự động dừng lại.
Kết hợp với headless false => có thể xem thực tế UI khi đó nó đang như thế nào
Ngoài ra khi đó ở browser đang chạy ta có thể bấm nút continue test

