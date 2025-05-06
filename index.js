const express = require('express');
const crypto = require('crypto');
const app = express();

// 讓 Express 可以解析 JSON
app.use(express.json());

// 驗證 LINE 的 X-Line-Signature（可選安全性）
function verifyLineSignature(req, res, buf) {
  const signature = req.headers['x-line-signature'];
  const body = buf.toString();
  const channelSecret = process.env.LINE_CHANNEL_SECRET || 'dummy_secret';

  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(body)
    .digest('base64');

  if (signature !== hash) {
    throw new Error('Invalid signature');
  }
}

// 加入原始 body buffer 做簽章驗證
app.use(express.json({ verify: verifyLineSignature }));

// Webhook 接收路由
app.post('/webhook', (req, res) => {
  console.log('收到 LINE Webhook：', JSON.stringify(req.body, null, 2));
  res.sendStatus(200); // 回應 200 表示收到
});

// 顯示首頁（Render 用）
app.get('/', (req, res) => {
  res.send('Hello from LINE Webhook server!');
});

// 監聽 port（Render 會提供 PORT 環境變數）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
