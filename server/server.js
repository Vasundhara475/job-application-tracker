// 🚀 Job Application Tracker - Express Server
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ─── Routes ──────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/applications'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/stats', require('./routes/stats'));

// ─── Health Check ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 Job Tracker API is running!', status: 'ok' });
});

// ─── 404 Handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// ─── Error Handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '💥 Server Error', error: err.message });
});

// ─── Start Server ─────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}\n`);
});