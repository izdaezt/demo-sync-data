import express, { NextFunction, Request, Response } from 'express';
import { pool } from './db';
import { config } from './config';
import { authRouter } from './routes/auth';
import { waterFlowRouter } from './routes/waterFlow';

// Express app only (no listen) so it can run both as a Node server (Docker) and as a Vercel function
const app = express();
app.use(express.json());

// Hide the password so the public health check never leaks credentials
const maskUrl = (url: string) => (url ? url.replace(/(:\/\/[^:/@]+:)[^@]*@/, '$1****@') : '(DATABASE_URL is not set)');

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: (e as Error).message || (e as NodeJS.ErrnoException).code || String(e), connectionString: maskUrl(config.databaseUrl) });
  }
});
app.use('/api/auth', authRouter);
app.use('/api/water-flow', waterFlowRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
