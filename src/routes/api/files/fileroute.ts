import express from "express";
const router = express.Router();

import drives_route from "./drives/drivesroute";
import ls_route from "./ls/lsroute";
import cat_route from "./cat/catroute";
import zipcat_route from "./zipcat/zipcatroute";

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.use("/drives", drives_route);
router.use("/ls", ls_route);
router.use("/cat", cat_route);
router.use("/zipcat", zipcat_route);

export default router;
