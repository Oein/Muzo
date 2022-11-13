import express from "express";
const router = express.Router();
import route_api_files from "./files/fileroute";
import route_api_account from "./account/acountroute";

router.use((req, res, next) => {
  next();
});

router.use("/files", route_api_files);
router.use("/account", route_api_account);

export default router;
