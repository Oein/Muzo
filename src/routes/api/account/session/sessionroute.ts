import express from "express";
import { uid } from "uid";
import consoleColor from "../../../../logger/consoleColor.mjs";
import { init as init_db } from "../../../../utils/database";
const router = express.Router();

router.use((req, res, next) => {
  next();
});

let db = init_db();

function btoa(msg: string) {
  return Buffer.from(msg, "base64").toString("hex");
}

export function databasion(userAgent: string, ip: string) {
  userAgent = btoa(userAgent);
  ip = btoa(ip);
  return btoa(userAgent + ip);
}

router.get("/valid", async (req, res) => {
  let user_info = databasion(
    req.headers["user-agent"] || Math.random().toString(),
    req.ip
  );

  let old_token = req.query.token;

  let valid = await db.get(`session.${user_info}.${old_token}`);
  if (!valid) {
    res.send(
      JSON.stringify({
        e: "Session not found.",
      })
    );
    res.status(401);
    return;
  }

  await db.delete(`session.${user_info}.${old_token}`);
  console.log(
    consoleColor.FgRed + "[DB][DEL]",
    consoleColor.Reset + `session.${user_info}.${old_token}`
  );
  let new_token = uid(128);
  await db.set(`session.${user_info}.${new_token}`, valid);
  console.log(
    consoleColor.FgGreen + "[DB][SET]",
    consoleColor.Reset + `session.${user_info}.${new_token}`,
    valid
  );
  res.send(
    JSON.stringify({
      s: true,
      k: new_token,
    })
  );
});

export default router;
