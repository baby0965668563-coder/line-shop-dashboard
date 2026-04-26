const express = require('express');
const app = express();

// 讓 public 裡的東西可以被讀到
app.use(express.static('public'));

// 👉 加這段（關鍵）
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, () => {
  console.log('Server running');
});
