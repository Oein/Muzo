import express from "express";
const router = express.Router();

router.use((req, res, next) => {
  next();
});

export default router;