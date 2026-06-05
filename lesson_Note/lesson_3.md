Các role hợp lệ
https://demoapp-sable-gamma.vercel.app/lesson2

implicit role: chính là tên thẻ . VD button và sử dụng thẻ là button
explicit role: có attribute role trong thẻ. Hoặc trong accessibility có role

Để check xem 1 element có vai trò tưởng mình (explicit role) mà playwright có thể nhận diện
=> mở dev tool > trỏ vào element đó > chọn sang tab accessibility , nếu có role hợp lệ => có thể nhận diện bằng role

Còn lại các lý thuyết chi tiết về getByRole .... CSS/ Xpath xem trong tài liệu 