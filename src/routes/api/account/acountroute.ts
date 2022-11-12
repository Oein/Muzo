import express from "express";
const router = express.Router();
import signinroute from "./signin/signinroute";
import sessionroute from "./session/sessionroute";
import signoutroute from "./signout/signoutroute";

router.use((req, res, next) => {
  next();
});

router.use("/signin", signinroute);
router.use("/session", sessionroute);
router.use("/signout", signoutroute);

export default router;
