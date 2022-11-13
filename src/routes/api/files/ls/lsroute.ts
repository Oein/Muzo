import express from "express";
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", (req, res) => {});

export default router;
