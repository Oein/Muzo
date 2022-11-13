import express from "express";
import { join as p_join } from "path";
const router = express.Router();

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.use((req, res, next) => {
  next();
});

router.get("*", (req, res) => {
  res.sendFile(p_join(__dirname, "..", "..", "public", "main", "index.html"));
});

export default router;
