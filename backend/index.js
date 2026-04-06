import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { connectDB } from "./config/database-config.js";

// Routes
import authRoutes from "./routes/auth-route.js";
import sessionRoutes from "./routes/session-route.js";
import aiRoutes from "./routes/ai-route.js";

const app = express();
const PORT = process.env.PORT || 9000;

// Database Connection Middleware (Serverless Friendly)
const ensureConnection = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Database Connection Failed", 
      error: error.message 
    });
  }
};

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    const isVercel = origin && /^https:\/\/interview-ace-ai-frontend.*\.vercel\.app$/.test(origin);
    const isLocal = origin && /http:\/\/localhost:(5173|3000)/.test(origin);
    if (!origin || isVercel || isLocal) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(helmet({
  crossOriginResourcePolicy: false,
})); 
app.use(compression()); 
app.use(morgan("dev")); 
app.use(express.json());

// API Routes (Ensuring connection before each route)
app.use("/api/auth", ensureConnection, authRoutes);
app.use("/api/sessions", ensureConnection, sessionRoutes);
app.use("/api/ai", ensureConnection, aiRoutes);

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "InterviewAce AI API is live" });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.stack);
  res.status(500).json({ 
    success: false, 
    message: "A critical backend error occurred. Check MONGODB_URI and other env variables.", 
    error: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Server start check for local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Session Active: http://localhost:${PORT}`);
  });
}

export default app;
