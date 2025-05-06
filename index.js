const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('收到 LINE Webhook：', req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => res.send('Hello from Webhook!'));

app.listen(3000, () => console.log('Server running'));