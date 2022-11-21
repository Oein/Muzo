import express from "express";
import { permission } from "../../../../types/permission";
import getUserByDBedUserId from "../../../../utils/getUserByUserDBedID";
import { validSession_ } from "../../../../utils/validSession";
import { join as p_join } from "path";

import fs from "fs-extra";

const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  let drive = req.query.drive || "";
  let path = req.query.path || "";
  let overwrite = false;
  let fileNames = ((req.query.file as string) || "").split("///");

  if (req.query.overwrite == undefined) overwrite = false;
  else if (req.query.overwrite == "f") overwrite = false;
  else if (req.query.overwrite == "t") overwrite = true;

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

  let writePermission = reqDrive.permissions.filter(
    (p) => p == permission.Write
  );
  if (writePermission.length == 0) {
    res.send(
      JSON.stringify({
        e: "Don't have permission to write files on this drive",
      })
    );
    return;
  }

  let joinedP = decodeURI(p_join(drive as string, path as string));
  if (joinedP.at(-1) == "/") joinedP = joinedP.slice(0, -1);

  let exsistPathes: {
    path: string;
    filename: string;
  }[] = [];

  fs.pathExists(joinedP).then((ex) => {
    if (!ex) {
      res.send(
        JSON.stringify({
          e: "File does not exist",
        })
      );
      return;
    }

    function threadFor(parm: number) {
      if (parm >= fileNames.length) {
        res.write("DONE,");
        res.end();
        return;
      }

      fs.pathExists(p_join(joinedP, fileNames[parm])).then((exsi) => {
        if (!exsi) {
          res.write(`${parm},`);
          threadFor(parm + 1);
          return;
        }

        fs.pathExists(p_join(joinedP, "Duplicated " + fileNames[parm])).then(
          (exsis) => {
            if (exsis && !overwrite) {
              exsistPathes.push({
                path: joinedP,
                filename: fileNames[parm],
              });
              res.write(`${parm}EX,`);
            }
            fs.copy(
              p_join(joinedP, fileNames[parm]),
              p_join(joinedP, "Duplicated " + fileNames[parm]),
              {
                overwrite: overwrite,
              }
            ).then(() => {
              res.write(`${parm},`);
              threadFor(parm + 1);
            });
          }
        );
      });
    }

    threadFor(0);
  });
});

export default router;
