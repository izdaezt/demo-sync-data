import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db';
import { asyncHandler, requireAuth, signAccessToken } from '../auth';

export const authRouter = Router();

authRouter.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

  const { rows } = await pool.query(
    'SELECT id, username, password_hash, full_name, role, is_active FROM users WHERE username = $1',
    [username],
  );
  const user = rows[0];
  if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

  const accessToken = signAccessToken({ id: Number(user.id), username: user.username, role: user.role });
  res.json({ accessToken, user: { id: Number(user.id), username: user.username, fullName: user.full_name, role: user.role } });
}));

authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const { id } = (req as any).user;
  const { rows } = await pool.query('SELECT id, username, full_name, role FROM users WHERE id = $1 AND is_active', [id]);
  if (!rows[0]) return res.status(401).json({ message: 'User not found' });
  res.json({ id: Number(rows[0].id), username: rows[0].username, fullName: rows[0].full_name, role: rows[0].role });
}));
