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
- **Nghiệp vụ / gọi API ngoài**: xem ví dụ mẫu bên dưới.

## Ví dụ nghiệp vụ: forward tin nhắn sang endpoint ngoài

Template kèm sẵn 1 nghiệp vụ mẫu: tin nhắn thường (không phải lệnh `/...`) của end user
sẽ được POST sang endpoint bạn chỉ định, rồi bot trả lời user theo kết quả.

Luồng xử lý:

```
Zalo user nhắn tin
  → Zalo POST vào routes/webhook.js (xác thực secret)
  → bot.processUpdate() phát event "message"
  → bots/handlers/index.js route theo lệnh
  → bots/handlers/default.js (không phải lệnh)
  → services/forwardService.js POST sang FORWARD_API_URL
  → bot trả lời user (result.message hoặc ack mặc định)
```

Bật tính năng bằng cách đặt trong `.env`:

```
FORWARD_API_URL=https://your-api.com/api/messages
FORWARD_API_KEY=optional-bearer-token
```

Payload gửi đi:

```json
{
  "source": "zalo",
  "userId": "<zalo user id>",
  "text": "<nội dung tin nhắn>",
  "receivedAt": "2026-01-01T00:00:00.000Z"
}
```

Nếu endpoint trả về JSON có field `message`, bot sẽ dùng nó làm câu trả lời cho user.
Khi `FORWARD_API_URL` để trống, bot chạy chế độ echo (dùng khi dev).

**Pattern chung khi thêm nghiệp vụ mới**: viết logic gọi API/DB vào 1 file trong
`services/` (nhận input thuần, trả kết quả, throw khi lỗi), rồi gọi service đó từ
handler trong `bots/handlers/` — handler chỉ lo parse tin nhắn và trả lời user.
