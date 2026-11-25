import express from 'express';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import app from './app';

// Node server entry (Docker / VPS). On Vercel, api/index.ts is used instead.
const clientDir = path.resolve(__dirname, '../client');
if (fs.existsSync(clientDir)) {
  // Production: serve the built UI from the same server
  app.use(express.static(clientDir));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDir, 'index.html')));
} else {
  // Dev: UI is served by Vite on :5173, so the API root just reports its version
  app.get('/', (_req, res) => res.json({ message: 'version1.0.0' }));
}

process.on('unhandledRejection', (e) => console.error('unhandledRejection', e));

app.listen(config.port, () => console.log(`API listening on :${config.port}`));
