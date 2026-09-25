# Capstone JavaScript - Trung Store

## 1. Chức năng
- Trang bán hàng responsive.
- Lấy sản phẩm và danh mục từ CyberSoft API.
- Tìm kiếm và lọc sản phẩm.
- Xem chi tiết và thêm sản phẩm vào giỏ hàng.
- Giỏ hàng lưu bằng localStorage.
- Trang Admin: thêm/sửa/xóa sản phẩm.
- Trang Admin: thêm/sửa/xóa cửa hàng.
- About page.
- Tổ chức OOP: APIClient, ProductService, StoreService, Product, Store, Cart.
- SCSS source + CSS đã compile sẵn để mở trực tiếp.

## 2. API được sử dụng
Base URL:
https://apistore.cybersoft.edu.vn/api

Theo đề bài:
- GET /Product/getAllCategory
- POST /Product
- PUT /Product
- DELETE /Product/{id}
- GET /Store/getAll
- GET /Store/getbyid
- POST /Store
- PUT /Store
- DELETE /Store/{id}

## 3. Cách chạy
Cách khuyến nghị:
1. Giải nén project.
2. Mở bằng VS Code.
3. Cài extension Live Server.
4. Chuột phải `index.html` -> Open with Live Server.
5. Vào `admin.html` để quản trị.

Không nên mở bằng `file:///...` vì trình duyệt có thể chặn module/API do CORS.

## 4. Lưu ý payload
API CyberSoft có thể thay đổi tên field/model theo phiên bản. Nếu Swagger của lớp yêu cầu field khác, chỉnh duy nhất phần tạo body trong:
`assets/js/admin.js`

Ví dụ:
- Product body nằm trong submit của `entity === "product"`.
- Store body nằm trong submit của `entity === "store"`.

## 5. SCSS
File nguồn:
`assets/scss/main.scss`

File browser dùng:
`assets/css/main.css`

Nếu có Live Sass Compiler, có thể compile lại SCSS sau khi chỉnh giao diện.

## 6. Phù hợp yêu cầu Capstone
- Website bán hàng: `index.html`
- Trang quản trị: `admin.html`
- About HTML/SCSS: `about.html`
- Call API Back-End: `assets/js/api.js`
- Lớp đối tượng: `assets/js/models.js`
- Service API: `assets/js/services.js`
- Responsive: `assets/scss/main.scss`
