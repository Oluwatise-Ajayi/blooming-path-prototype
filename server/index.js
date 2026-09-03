import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { seedDatabase } from './db/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const AI_MODE = process.env.AI_MODE || 'deterministic';
const GEMINI_KEY_STATUS = process.env.GEMINI_API_KEY ? '✓ present' : '✗ missing';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ── Request Logger ──────────────────────────────────────────
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const start = Date.now();
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      const duration = Date.now() - start;
      const status = res.statusCode;
      console.log(`[API] ${req.method} ${req.url} → ${status} (${duration}ms)`);
      return originalJson(body);
    };
  }
  next();
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api', apiRouter);

// ── Healthcheck ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BloomingPath API',
    timestamp: new Date().toISOString(),
    ai_mode: AI_MODE,
    gemini_key: GEMINI_KEY_STATUS,
    pathways: 5
  });
});

// ── Serve Frontend Static Files ──────────────────────────────
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[SERVER ERROR] ${req.method} ${req.url}:`, err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ── Start Server ─────────────────────────────────────────────
async function startServer() {
  try {
    await seedDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════════╗');
      console.log('║         BloomingPath API — Server Ready          ║');
      console.log('╠══════════════════════════════════════════════════╣');
      console.log(`║  Port:       ${String(PORT).padEnd(36)}║`);
      console.log(`║  AI Mode:    ${String(AI_MODE).padEnd(36)}║`);
      console.log(`║  Gemini Key: ${String(GEMINI_KEY_STATUS).padEnd(36)}║`);
      console.log(`║  Pathways:   5 tracks seeded                     ║`);
      console.log('╚══════════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (err) {
    console.error('[STARTUP] Failed to initialize BloomingPath backend:', err);
    process.exit(1);
  }
}

startServer();
