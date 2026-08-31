import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import connectDatabase from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "CrowdSolve API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal server error"
  });
});

const preferredPort = Number(process.env.PORT) || 5000;
const maxPortRetries = 10;

const startServer = (port, retriesLeft = maxPortRetries) => {
  // 0.0.0.0 is required by hosting providers such as Render and also works
  // locally through http://localhost or http://127.0.0.1.
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`CrowdSolve API running on port ${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && retriesLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Retrying on port ${nextPort}...`);
      startServer(nextPort, retriesLeft - 1);
      return;
    }

    console.error(`Failed to start server on port ${port}:`, error.message);
    process.exit(1);
  });
};

// Start the HTTP API independently of MongoDB. This keeps the health endpoint
// reachable and provides a clear database error instead of making the whole
// backend appear offline while a remote database connection is pending.
startServer(preferredPort);

connectDatabase().catch((error) => {
  console.error("Database connection failed:", error.message);
});
