import express from "express";
const router = express.Router();

import drives_route from "./drives/drivesroute";
import ls_route from "./ls/lsroute";

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.use("/drives", drives_route);
router.use("/ls", ls_route);

export default router;
