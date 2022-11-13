import express from "express";
const router = express.Router();

import get_route from "./get/get_route";

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.use("/get", get_route);

export default router;
