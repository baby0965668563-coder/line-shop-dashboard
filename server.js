const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const dataDir = path.join(__dirname, 'data');
const ordersFile = path.join(dataDir, 'orders.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/orders', (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  fs.writeFileSync(ordersFile, JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
