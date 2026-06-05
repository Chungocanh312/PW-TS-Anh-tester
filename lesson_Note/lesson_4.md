## Auto waiting:
Trong Playwright có 3 cấp độ để kiểm soát timeout
1. Cấp độ cao nhất - Inline Timeout (Mệnh lệnh của sếp)
Trong các hàm action có auto-wait thì trong đó sẽ có tham số timeout . Thì khi ta set timeout ở đây sẽ là cấp độ cao nhất
2. Cấp độ trung bình - Action Timeout (Quy định phòng ban)
Timeout này sẽ được set ở file playwright.config.ts với tham số actionTimeout trong attribute use
Đại diện để áp dụng timeout cho tất cả các action có trong playwright
3. Cấp độ thấp nhất - Timeout toàn cục (Quy định công ty) => là time chạy tối đa cho 1 testcase
Timeout này cũng sẽ set up playwright.config.ts nhưng sẽ set với key-value timeout
// Trên thực tế thì nên set timeout toàn cục (timeout cho từng tcs) là 2 phút 
// Với trường hợp có case đặc thù cần chạy lâu hơn, hoặc có thể chạy ngắn hơn thì 
// ta có thể dùng test.setTimeout. Lưu ý dùng cái này thì nó sẽ set cho toàn bộ các tcs bên dưới nó

## Web first assertion:
Có 2 cấp độ:
1. Cấp độ cao nhất - Inline Timeout 
Set key-value Timeout cho từng hàm expect tại từng step
2. Cấp độ thấp hơn - toàn cục (quy định chung ) - default là 5s
Set trong 1 key-value timeout ở phần tử expect trong file playwright.config.ts
Mặc định phần tử expect này sẽ chưa có ở trong file config sau khi cài đặt PW
Ta phải tự thêm vào:
```typescript
expect: {
    timeout: 6000,
  },
```  

Với các hàm expect mà cần time để lấy dữ liệu (Hay chính nó sẽ có web first assertion)
=> chính là hàm bất đồng bộ => cần phải có await