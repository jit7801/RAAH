import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import aiRouter from './routes/ai';
import navigateRouter from './routes/navigate';
import locationsRouter from './routes/locations';
import classroomsRouter from './routes/classrooms';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/navigate', navigateRouter);
app.use('/api/v1/locations', locationsRouter);
app.use('/api/v1/classrooms', classroomsRouter);
app.use('/api/v1/admin', adminRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'RAAH AI Backend', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 RAAH AI Server running on http://localhost:${PORT}`);
});
