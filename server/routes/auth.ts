import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findUserByUsername } from '../db';
import { signToken } from '../middleware/auth';

const router = Router();

router.post('/signup', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || typeof username !== 'string' || username.length < 3 || username.length > 20) {
    res.status(400).json({ error: '使用者名稱需為 3-20 個字元' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ error: '密碼至少需要 6 個字元' });
    return;
  }

  const existing = findUserByUsername(username);
  if (existing) {
    res.status(409).json({ error: '使用者名稱已被使用' });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = createUser(username, passwordHash);
  const token = signToken(result.lastInsertRowid as number, username);

  res.json({ token, username });
});

router.post('/signin', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: '請提供使用者名稱和密碼' });
    return;
  }

  const user = findUserByUsername(username);
  if (!user) {
    res.status(401).json({ error: '使用者名稱或密碼錯誤' });
    return;
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: '使用者名稱或密碼錯誤' });
    return;
  }

  const token = signToken(user.id, user.username);
  res.json({ token, username: user.username });
});

export default router;
