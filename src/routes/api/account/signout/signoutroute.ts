import express from "express";
import { init as get_db } from "../../../../utils/database";
import { uid } from "uid";
import { databasion } from "../session/sessionroute";
import consoleColor from "../../../../logger/consoleColor.mjs";

const router = express.Router();

let db = get_db();

router.use((req, res, next) => {
  next();
});

router.get("/request", (req, res) => {
  let id = req.query.id;

  (async function () {
    let id = uid(128);
    console.log(
      consoleColor.FgRed + "[DB][DEL]",
      consoleColor.Reset +
        `session.${databasion(
          req.headers["user-agent"] || Math.random().toString(),
          req.ip
        )}.${id}`
    );
    await db.delete(
      `session.${databasion(
        req.headers["user-agent"] || Math.random().toString(),
        req.ip
      )}.${id}`
    );
    res.send("Done!");
  })();
});

export default router;
