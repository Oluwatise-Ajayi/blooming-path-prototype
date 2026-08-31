import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { seedDatabase } from './db/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API REQUEST] ${req.method} ${req.url}`);
  }
  next();
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Routes
app.use('/api', apiRouter);

// Healthcheck Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'BloomingPath Vertical Slice API', timestamp: new Date().toISOString() });
});

// Serve frontend static files in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Initialize database & start server
async function startServer() {
  try {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`BloomingPath Backend API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize BloomingPath backend:', err);
    process.exit(1);
  }
}

startServer();
