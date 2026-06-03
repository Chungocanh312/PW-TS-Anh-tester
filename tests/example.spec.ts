import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();  
});

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
