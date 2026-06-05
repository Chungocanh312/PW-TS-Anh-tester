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