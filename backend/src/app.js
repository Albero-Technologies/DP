import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { swaggerUi, specs } from "./docs/swagger.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Capture raw body for Cashfree webhook HMAC verification
app.use((req, res, next) => {
  let data = "";
  req.setEncoding("utf8");
  req.on("data", chunk => { data += chunk; });
  req.on("end", () => {
    req.rawBody = data;
    try { req.body = data ? JSON.parse(data) : {}; }
    catch { req.body = {}; }
    next();
  });
});

// API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// All routes
app.use("/api", routes);

app.get("/", (req, res) => res.json({ message: "Institute CRM API running ✅" }));

export default app;