import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import { swaggerUi, specs } from "./docs/swagger.js";

// ----> routes------------>
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "Institute CRM API running" });
});

export default app;