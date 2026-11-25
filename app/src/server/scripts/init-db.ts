import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { pool } from '../db';

async function main() {
  const dir = process.env.SQL_DIR || path.resolve(process.cwd(), '../database');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    console.log(`Running ${f}`);
    await pool.query(fs.readFileSync(path.join(dir, f), 'utf8'));
  }

  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (username, password_hash, full_name, role)
     VALUES ($1, $2, 'Administrator', 'admin')
     ON CONFLICT (username) DO NOTHING`,
    [username, hash],
  );
  console.log(`Admin user "${username}" ready`);
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
