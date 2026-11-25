import { Pool } from 'pg';
import { config } from './config';

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 5, // keep small for serverless
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : undefined,
});
