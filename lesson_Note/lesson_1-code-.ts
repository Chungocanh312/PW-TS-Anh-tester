//Giải thích ({page}) được truyền vào arrow function có trong các test title
// => nó là 1 dạng destructuring để gọi đến thuộc tính page có trong object fixture của thư viện playwright

// Destructuring nghĩa là gì?
// VD: 
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
 
