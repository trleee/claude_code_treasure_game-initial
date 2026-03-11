import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import scoresRoutes from './routes/scores';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoresRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
