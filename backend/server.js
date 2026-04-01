const express = require('express');
const cors = require('cors');
const path = require('path');
const itemsRouter = require('./routes/items');
const reviewRouter = require('./routes/review');
const settingsRouter = require('./routes/settings');
const uploadRouter = require('./routes/upload');
const { initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize database
initDatabase();

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/review', reviewRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
