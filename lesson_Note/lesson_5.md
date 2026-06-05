## Kỹ thuật tìm kiếm phần tử Text & khẳng định kết qủa:
- textContent(): Phương thức phổ biến nhất, lấy toàn bộ text bao gồm cả text ẩn (display:none, visibility:hidden)
- innerText(): Chỉ lấy text hiển thị, bỏ qua text ẩn. Ít dùng trong testing vì expect đã có các assertion tốt hơn
- innerHTML(): Lấy cả mã HTML, hiếm khi cần dùng trừ khi bạn muốn kiểm tra cấu trúc HTML
- allTextContents() / allInnerTexts(): Dùng cho danh sách phần tử, trả về mảng string

### inputValue() / getAttribute()
- inputValue():Dùng để lấy giá trị trong attribute value của input Element (input/ textarea/ select)
- getAttributed(): hoạt động với mọi element và trả về string or null

## Expect Assertions:
expect() so sánh Giá trị tức thời (không có await) => đây là expect() thường , các hàm không có auto-wait
Dùng để so sánh biến/ giá trị có sẵn, không cần autowait

```typescript
import {test, expect} from '@playwright/test'
import { emit, permission } from 'node:process';

// textContent() / innerText() / htmlText()
test('Get text with (display:none) element', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();

    const htmlDemoTextbox1Locator = page.locator(`//div[@id='demo-element-1']`);
    // text content
    const textContent = await htmlDemoTextbox1Locator.textContent();
    console.log('textContent:', textContent);

    // innertext
    const innerText = await htmlDemoTextbox1Locator.innerText();
    console.log('innerText:', innerText);

    // htmlText
    const htmlText = await htmlDemoTextbox1Locator.innerHTML();
    console.log('htmlText:', htmlText);

})

test('Get text with visibility: hidden element', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();

    const htmlDemoTextbox2Locator = page.locator(`//div[@id='demo-element-2']`);
    // text content
    const textContent = await htmlDemoTextbox2Locator.textContent();
    console.log('textContent:', textContent);

    // innertext
    const innerText = await htmlDemoTextbox2Locator.innerText();
    console.log('innerText:', innerText);

    // htmlText
    const htmlText = await htmlDemoTextbox2Locator.innerHTML();
    console.log('htmlText:', htmlText);
})

// allTextContents() / allInnerTexts()
test('Get allTextContents and allInnerTexts', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();

    const dropdownLocator = page.locator(`//select[@id='demo-dropdown']`);
    
    // allTextContents
    const allTextContents = await dropdownLocator.allTextContents();
    console.log('allTextContents:', allTextContents)

    // allInnerTexts()
    const allInnerTexts = await dropdownLocator.allInnerTexts();
    console.log('allInnerTexts:', allInnerTexts)

    // ở trên nếu in ra thì sẽ là array với 1 phần tử duy nhất là các text ở option ghép lại
    // Để lấy thành array với đủ 4 option => phải lấy locator đến các options

    const dropdownOptionsLocator = page.locator(`//select[@id='demo-dropdown']//option`);

    // allTextContents
    const optionsAllTextContents = await dropdownOptionsLocator.allTextContents();
    console.log('optionsAllTextContents:', optionsAllTextContents)

    // allInnerTexts()
    const optionsAllInnerTexts = await dropdownOptionsLocator.allInnerTexts();
    console.log('optionsAllInnerTexts:', optionsAllInnerTexts)
})

test('Get allTextContents and allInnerTexts with hidden texts', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();

    const productListParentLocator = page.locator(`//label[text()='Product List:']//following-sibling::div[@class='demo-list-item']`);
    
    // allTextContents()
    const productsAllTextContents = await productListParentLocator.allTextContents();
    console.log('allTextContents:', productsAllTextContents)

    // allInnerTexts()
    const productsAllInnerTexts = await productListParentLocator.allInnerTexts();
    console.log('allInnerTexts:', productsAllInnerTexts)
})

// inputValue() / getAttribute()
// inputValue() : Dùng để lấy giá trị trong attribute value của input Element (input/ textarea/ select)
// getAttribute(): hoạt động với mọi element và trả về string or null
test('demo inputValue and getAttribute', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();

    // inputValue()
    const nameInputTextboxLocator = page.locator(`//input[@id='demo-input-text']`);
    const nameInputValue = await nameInputTextboxLocator.inputValue();
    console.log(nameInputValue)
    
    const emailInputTextboxLocator = page.locator(`//input[@id='demo-input-email']`);
    const emailInputValue = await emailInputTextboxLocator.inputValue();
    console.log(emailInputValue)

    // getAttribute()
    const demoAttributeLocator = page.locator(`//div[@id='demo-attributes']`);
    const classAttributeValue = await demoAttributeLocator.getAttribute("class");
    console.log(classAttributeValue)
})

// Expect Assertions => expect không có wait
// toBe(): so sánh nghiệm ngặt. giống rule kiểu ===.
// Kiểm trả cả gía trị và kiểu dữ liệu phải giống nhau chính xác

test('toBe()', async ({page})=>{
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();
    await page.locator(`//div[contains(text(),'Expect Assertions')]`).click();

    const name: string = 'Playwright';
    const version: number = 1.56;
    const isActive: boolean = true;

    // Passed:
    expect(name).toBe('Playwright')
    expect(version).toBe(1.56)
    expect(isActive).toBe(true)

    // Failed:
    expect(version).toBe('1.56');
})

// toEqual(): so sánh giá trị nội dung của các object hoặc array
// Kiểm tra 2 object hoặc array giống hệt nhau
// Giống như kiểm tra các đồ vật trong các hộp có giống hệt nhau hay không

test('toEqual()', async ()=>{
    // object
    const user1 = { id: 1, name: 'A' };
    const user2 = { id: 1, name: 'A' };

    // Array
    const user3 = [1, 'anh', 4 ];
    const user4 = [1, 'anh', 4 ];
    const user5 = [2,'em', 5];

    // Passed
    expect(user1).toEqual(user2);
    expect(user3).toEqual(user4);

    // Failed
    expect(user3).toEqual(user5);
    expect(user1).toEqual(user3);

    // Không dùng toBe() đối với object hay array được vì với object hay array thì khi khởi tạo
    // trong ram sẽ ghi nhận các vùng biến nhớ khác nhau cho từng object hoặc array
    // Còn khi khai báo biến thông thường thì ram sẽ ghi nhận chung vào 1 vùng biến nhớ => dùng toBe()
})

// toContain() và toContainEqual():
//toContain: kiểm tra có chứa giá trị expect
// Lưu ý: hàm toContain chỉ check được các phần tử array là các giá trị intimitive. 
// Còn nếu phần tử là 1 object thì không check được
// => với phần tử là 1 object thì phải dùng toContainEqual()
test('toContain', async () => {
    const fruits = ['Táo', 'Cam', 'Xoài'];
    expect(fruits).toContain('Cam');

    const permissions: string [] = ['read', 'write', 'delete'];
    const users: {id: number; name: string} [] = [
        {
            id: 1, 
            name: 'A'
        },
        {
            id: 2, 
            name: 'B'
        }
    ]

    // passed:
    expect(permissions).toContain('read');

    // failed:
    // expect(permission).toContain('update');
    // expect(users).toContain({
    //         id: 1, 
    //         name: 'A'
    //     })

    // Còn nếu phần tử là 1 object thì không check được
    // => với phần tử là 1 object thì phải dùng toContainEqual()

    // toContainEqual(): 
    expect(users).toContainEqual({
            id: 1, 
            name: 'A'
        })   
})

// toBeTruthy() and toBeFalsy()
// Dùng để so sánh giá trị cần kiểm tra có phải là truthy hay là falsy không
// truthy: 
// falsy: 

test('toBeTruthy and toBeFalsy', () => {
    expect('Hello').toBeTruthy();
    expect([]).toBeTruthy();
    expect({}).toBeTruthy();

    expect(null).toBeFalsy();
    expect(0).toBeFalsy();
    expect(NaN).toBeFalsy();
    expect(-0).toBeFalsy();
    expect('').toBeFalsy();
    expect(false).toBeFalsy();
    expect(undefined).toBeFalsy();
})

// toBeGreaterThan / toBeLessThan
test('toBeGreaterThan and toBeLessThan', () => {
    const itemCount = 5;
    const totalPrice = 100.5

    expect(itemCount).toBeGreaterThan(0);
    expect(totalPrice).toBeLessThan(120);
})

// Practice 1: So sánh tên của user là Playwright Learner
test('Practice 1', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();
    await page.locator(`//div[contains(text(),'Expect Assertions')]`).click();

    const userNameLocator = page.locator(`//div[@id='profile-name']`);
    const userName = await userNameLocator.innerText();
    console.log(userName)
    expect(userName).toBe(`Playwright Learner`);
})

// Practice 2: So sánh profile JSON //pre[@id='profile-json']
test('Practice 2', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();
    await page.locator(`//div[contains(text(),'Expect Assertions')]`).click();

    const profileJSONTextboxLocator = page.locator(`//pre[@id='profile-json']`);
    const profileJSONString = await profileJSONTextboxLocator.innerText();
    const profileJSON = JSON.parse(profileJSONString); // Chuyển Json về object của TS
    const expectedJSON = {
        "id": 101,
        "role": "student", 
        "active": true,
        "premium": false
    }
    expect(profileJSON).toEqual(expectedJSON);
})

// practice 3: check categories chứa đủ 3 item và xác minh có chứa item nhất định
test('practice 3', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();
    await page.locator(`//div[contains(text(),'Expect Assertions')]`).click();

    const categoriesLocator = page.locator(`//ul[@id='categories']`);
    const itemsCategoriesLocator = page.locator(`//ul[@id='categories']//li`);

    const itemListArray = await itemsCategoriesLocator.allInnerTexts();
    
    expect(itemListArray).toHaveLength(3)
    const actualItemCount = itemListArray.length;
    expect(actualItemCount).toBe(3)

    expect(itemListArray).toContain('📱 Phone');
    await expect(categoriesLocator).toContainText('Phone'); // hàm toContainText sẽ kiểm tra luôn text trong element
    // KHông phải get Text xong kiểm tra 
})

// practice 4: Check trạng thái còn hàng thông qua data-value = "true"
// Lưu ý: có thể chuyển dữ liệu từ string sang boolean = hàm : Boolean(value)
test('practice 4', async ({page})=> {
    await page.goto("https://demoapp-sable-gamma.vercel.app/");
    await page.getByRole("link", { name: "Bài 3: Tổng hợp Text Methods" }).click();
    await page.locator(`//div[contains(text(),'Expect Assertions')]`).click();

    const inStockFlagLocator = page.locator(`//div[@id='in-stock-flag']`);
    
    const attributeValue = await inStockFlagLocator.getAttribute("data-value");
    const attributeValueBoolean = Boolean(attributeValue)
    expect(attributeValueBoolean).toBe(true)
    expect(attributeValueBoolean).toBeTruthy();
})
```