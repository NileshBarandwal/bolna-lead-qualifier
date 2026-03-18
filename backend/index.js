require('dotenv').config();

const express = require('express');
const cors = require('cors');

const leadsRouter = require('./routes/leads');
const webhookRouter = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/leads', leadsRouter);
app.use('/webhook', webhookRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, _next) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  // Server started
});

module.exports = app;
