import express from "express";
import { init as get_db } from "../../../../utils/database";
import { uid } from "uid";
import { databasion } from "../session/sessionroute";

const router = express.Router();

let db = get_db();

router.use((req, res, next) => {
  next();
});

router.post("/request", (req, res) => {
  let id = req.query.id;

  (async function () {
    let id = uid(128);
    db.delete(
      `session.${databasion(
        req.headers["user-agent"] || Math.random().toString(),
        req.ip
      )}.${id}`
    );
  })();
});

export default router;
