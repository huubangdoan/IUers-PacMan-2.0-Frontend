# My React App (Vite)

## Cài đặt

```bash
npm install
```

## Chạy dev server

```bash
npm run dev
```

App chạy tại `http://localhost:5173`. Request tới `/api/*` sẽ tự proxy sang backend Spring Boot tại `http://localhost:8080` (xem `vite.config.js`).

## Build production

```bash
npm run build
```

## Cấu trúc thư mục

- `src/components` — component dùng chung
- `src/pages` — các trang theo route
- `src/hooks` — custom hooks
- `src/context` — React Context (auth, theme...)
- `src/services` — gọi API (axios instance)
- `src/utils` — hàm tiện ích
- `src/routes` — cấu hình route (nếu tách riêng khỏi App.jsx)
