import express from "express";
import { permission } from "../../../../types/permission";
import getUserByDBedUserId from "../../../../utils/getUserByUserDBedID";
import { validSession_ } from "../../../../utils/validSession";
import { join as p_join } from "path";

import { pathExists } from "fs-extra";

const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  let drive = decodeURI(req.query.drive?.toString() || "");
  let path = decodeURI(req.query.path?.toString() || "");

  if (drive == undefined || path == undefined) {
    res.send(
      JSON.stringify({
        e: "Querys not found",
      })
    );
    return;
  }

  let isV = await validSession_(req, req.query.token as string);

  if (isV.valid == false) {
    res.send(
      JSON.stringify({
        e: "Session is not valid",
      })
    );
    return;
  }

  let user = await getUserByDBedUserId(isV.id);
  let reqDrives = user.allowedPaths.filter((p) => p.pathD == drive);

  if (reqDrives.length == 0) {
    res.send(
      JSON.stringify({
        e: "Don't have permission to access this drive",
      })
    );
    return;
  }

  let reqDrive = reqDrives[0];
  let readPermission = reqDrive.permissions.filter((p) => p == permission.Read);

  if (readPermission.length == 0) {
    res.send(
      JSON.stringify({
        e: "Don't have permission to read this drive",
      })
    );
    return;
  }

  let joinedP = decodeURI(p_join(drive as string, path as string));
  let jsp = joinedP.split("/");

  pathExists(joinedP).then((ex) => {
    if (!ex) {
      res.send(
        JSON.stringify({
          e: "File does not exist",
        })
      );
      return;
    }
    let ext = jsp[jsp.length - 1];
    res.download(joinedP, ext);
  });
});

export default router;
