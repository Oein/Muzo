import express from "express";
const router = express.Router();
import signinroute from "./signin/signinroute";
import sessionroute from "./session/sessionroute";

router.use((req, res, next) => {
  next();
});

router.use("/signin", signinroute);
router.use("/session", sessionroute);

export default router;
