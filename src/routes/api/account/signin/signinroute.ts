import express from "express";
import { init as get_db } from "../../../../utils/database";
import { textToAuthKey } from "../../../../utils/authKey";
import { uid } from "uid";
import { databasion } from "../session/sessionroute";
import consoleColor from "../../../../logger/consoleColor.mjs";

const router = express.Router();

let db = get_db();

router.use((req, res, next) => {
  next();
});

router.post("/request", (req, res) => {
  let id = req.query.id;

  if (typeof id !== "string") {
    res.send(`{"e":"Query not found"}`).status(401);
    return;
  }

  let pw = req.query.pw;

  if (typeof pw !== "string") {
    res.send(`{"e":"Query not found"}`).status(401);
    return;
  }

  (async function () {
    let has_user = await db.get(`user.${id}.${textToAuthKey(pw, global.salt)}`);

    if (has_user == 0) {
      let id = uid(128);
      db.set(
        `session.${databasion(
          req.headers["user-agent"] || Math.random().toString(),
          req.ip
        )}.${id}`,
        `user.${id}.${textToAuthKey(pw, global.salt)}`
      );
      console.log(
        consoleColor.FgGreen + "[DB][SET]",
        consoleColor.Reset +
          `session.${databasion(
            req.headers["user-agent"] || Math.random().toString(),
            req.ip
          )}.${id}`,
        `user.${id}.${textToAuthKey(pw, global.salt)}`
      );
      res.send(`{"s":"Signed in","k":"${id}"}`).status(200);
      return;
    }

    res.send(`{"e":"No user or password is incorrect."}`).status(401);
    return;
  })();
});

export default router;
