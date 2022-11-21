import express from "express";
import { init as init_db } from "../../../../../utils/database";
import { databasion } from "../../../account/session/sessionroute";

const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

let db = init_db();

router.get("/", (req, res) => {
  let auth = req.headers.authorization || "";

  (async function () {
    let has = await db.get(
      `session.${databasion(
        req.headers["user-agent"] || Math.random().toString(),
        req.ip
      )}.${auth}`
    );

    if (!has) {
      res.send(
        JSON.stringify({
          e: "Session not found",
        })
      );
      res.status(401);
      return;
    }

    let usr = global.config.users.filter(
      (u) => u.authed == (has as string).split(".")[2]
    );

    if (usr.length == 0) {
      res.send(
        JSON.stringify({
          e: "User not found",
        })
      );
      res.status(401);
      return;
    }

    let uer = usr[0];
    res.send(JSON.stringify(uer.allowedPaths));
  })();
});

export default router;
