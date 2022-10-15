import express from "express";
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/*", (req, res) => {
  res.send("/" + req.params[0]);
});

export default router;
