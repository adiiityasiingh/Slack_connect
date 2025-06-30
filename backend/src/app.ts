import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import { startMessageScheduler } from './jobs/messageSender.job';

startMessageScheduler(); // ⏰ Start scheduler


app.use('/', authRoutes);
app.use('/', messageRoutes);
mongoose.connect(process.env.MONGODB_URI || '', {
  dbName: 'slack-connect',
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.get('/', (req, res) => res.send('Slack Connect API is running'));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
