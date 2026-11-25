import express, { NextFunction, Request, Response } from 'express';
import { authRouter } from './routes/auth';
import { waterFlowRouter } from './routes/waterFlow';

// Express app only (no listen) so it can run both as a Node server (Docker) and as a Vercel function
const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/water-flow', waterFlowRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
