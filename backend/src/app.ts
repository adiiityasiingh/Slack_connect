import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',                         // Dev
  'https://slack-connect-j05nmk0ge-adiiityasiinghs-projects.vercel.app/'      // ✅ Replace with your actual deployed frontend domain
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import { startMessageScheduler } from "./jobs/messageSender.job";

// ✅ Start scheduled job
startMessageScheduler();

// ✅ Use routers (these must be `express.Router()` instances)
app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

// ✅ Root route
app.get("/", (_req, res) => res.send("Slack Connect API is running"));

// ✅ Fallback 404
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Ensure MONGO URI exists
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("❌ MONGODB_URI is missing!");
  process.exit(1);
}

mongoose
  .connect(mongoUri, { dbName: "slack-connect" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  });

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
