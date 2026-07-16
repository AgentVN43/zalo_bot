# Zalo Bot Express Webhook Template

Template tối giản để xây dựng Zalo bot với Express, nhận tin nhắn qua webhook (hoặc polling khi dev local).

## Cấu trúc

```
app.js                  # Entry point: khởi tạo bot, đăng ký routes, start server
config/
  index.js              # Server config (port, CORS, base path)
  zalo.js               # Zalo bot config (token, webhook, secret)
bots/
  index.js              # Bot singleton + đăng ký handlers
  zalo.js               # Khởi tạo node-zalo-bot, đăng ký webhook với Zalo
  handlers/
    index.js            # Router lệnh chat — thêm lệnh mới tại đây
    help.js             # /help, /start
    default.js          # Tin nhắn thường (mặc định: echo)
routes/
  webhook.js            # POST /api/zalo/webhook (xác thực secret token)
services/
  notificationService.js# Wrapper gửi tin nhắn
middleware/             # errorHandler, requestLogger
utils/logger.js         # Winston logger (console + logs/)
```

## Bắt đầu

```bash
cp .env.example .env    # điền ZALO_TOKEN và các giá trị còn lại
npm install
npm run dev             # hoặc: npm start
```

- Dev local không có HTTPS: đặt `ZALO_POLLING=true`.
- Production: đặt `ZALO_WEBHOOK_URL` (HTTPS công khai) và `ZALO_SECRET_TOKEN`; webhook được tự đăng ký khi server khởi động.
- Health check: `GET /health`.

## Thêm tính năng

- **Lệnh chat mới**: tạo file trong `bots/handlers/`, rồi thêm nhánh route trong `bots/handlers/index.js`.
- **REST API mới**: tạo router trong `routes/`, mount trong `setupRoutes()` ở `app.js`.
- **Database, service ngoài, v.v.**: chưa kèm sẵn — thêm khi cần.
