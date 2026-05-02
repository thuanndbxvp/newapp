# App Launcher HTML (GitHub Pages)

Bộ thư mục [`docs/`](./) đã được chuẩn bị để deploy trực tiếp lên GitHub Pages.

## Cách publish

1. Commit và push toàn bộ thay đổi lên repository.
2. Vào **Settings → Pages**.
3. Ở mục **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: chọn nhánh của bạn (ví dụ `main`)
   - **Folder**: chọn `/docs`
4. Lưu cấu hình và chờ GitHub build.
5. URL site sẽ có dạng: `https://<username>.github.io/<repo>/`

## Ghi chú

- Bản HTML này chạy hoàn toàn phía client (static), không cần `pywebview`.
- Các nút app trong bản web mở liên kết URL (không chạy `.exe` trên GitHub Pages).
- Dữ liệu như key bản quyền (nếu lưu), trạng thái ẩn/hiện app được lưu bằng `localStorage` trên trình duyệt.
