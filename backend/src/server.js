/* global process */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import waitlistRoutes from './routes/waitlist.js';
import blogRoutes from './routes/blog.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);

// Trust proxy for correct client IP behind reverse proxies (Render, Railway, etc.)
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',').map((item) => item.trim()) || ['http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/v1/health', (_req, res) => {
  res.json({ ok: true, version: '1.0.0' });
});

// Mount modular routes
app.use('/api/v1/waitlist', waitlistRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/blog', blogRoutes);

// Generic error handler
app.use((err, _req, res, next) => {
  logger.error('Unhandled Server Error', { error: err.message, stack: err.stack });
  void next;
  return res.status(500).json({ message: 'Internal server error' });
});

// Only start the listener when run directly (not when imported by tests)
const isDirectRun = process.argv[1]?.includes('server.js');
if (isDirectRun) {
  app.listen(PORT, () => {
    logger.info(`ALLC backend running on http://localhost:${PORT}`);
  });
}

export default app;
