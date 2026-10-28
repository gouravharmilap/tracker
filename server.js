require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');

const { analyzeAccount } = require('./lib/analyzer');
const { getHistory, clearHistory } = require('./lib/store');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { username } = req.body || {};
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'username is required' });
    }
    const clean = username.trim().replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '');
    if (!clean || clean.length < 1 || clean.length > 30) {
      return res.status(400).json({ error: 'invalid instagram username' });
    }
    const manual = (req.body && req.body.manual) || {};
    const report = await analyzeAccount(clean, manual);
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'analysis failed' });
  }
});

app.get('/api/history/:username', (req, res) => {
  const username = req.params.username.trim().replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '');
  res.json({ username, history: getHistory(username) });
});

app.delete('/api/history/:username', (req, res) => {
  const username = req.params.username.trim().replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '');
  clearHistory(username);
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Instagram Account Tracker running at http://localhost:${PORT}\n`);
});
