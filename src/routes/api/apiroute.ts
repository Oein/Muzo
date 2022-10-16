import express from "express";
const router = express.Router();
import route_api_files from "./files/list";

router.use((req, res, next) => {
  next();
});

router.use("/files", route_api_files);

export default router;
