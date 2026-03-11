import { Router, Response } from 'express';
import { saveScore, getScores } from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const { score, treasureFound } = req.body;

  if (typeof score !== 'number') {
    res.status(400).json({ error: '缺少分數資料' });
    return;
  }

  saveScore(req.userId!, score, !!treasureFound);
  res.json({ success: true });
});

router.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  const scores = getScores(req.userId!);
  res.json(scores);
});

export default router;
