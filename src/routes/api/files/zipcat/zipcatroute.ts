import express from "express";
import { permission } from "../../../../types/permission";
import getUserByDBedUserId from "../../../../utils/getUserByUserDBedID";
import { validSession_ } from "../../../../utils/validSession";
import { join as p_join } from "path";

import fs from "fs-extra";

import archiver from "archiver";

const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  let drive = req.query.drive;
  let path = req.query.path;
  let fileNames = (req.query.file as string).split("///");

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

  fs.pathExists(joinedP).then((ex) => {
    if (!ex) {
      res.send(
        JSON.stringify({
          e: "File does not exist",
        })
      );
      return;
    }

    let zip = archiver("zip");

    function threadFor(parm: number) {
      if (parm >= fileNames.length) {
        let n = "";
        if ((path as string).trim() == "" || (path as string).trim() == "/") {
          let tmp = (drive as string).split("/");
          n = tmp[tmp.length - 1];
        } else {
          let tmp = (path as string).split("/");
          n = tmp[tmp.length - 1];
        }

        if (n == "") {
          n = "root directory";
        }

        res.attachment(`${n}.zip`).type("zip");
        zip.on("end", () => res.end());
        zip.pipe(res);
        zip.finalize();

        return;
      }

      fs.pathExists(p_join(joinedP, fileNames[parm])).then((exsi) => {
        if (!exsi) {
          threadFor(parm + 1);
          return;
        }

        fs.lstat(p_join(joinedP, fileNames[parm])).then((v) => {
          if (v.isDirectory()) {
            zip.directory(p_join(joinedP, fileNames[parm]), false);
          } else {
            zip.append(fs.createReadStream(p_join(joinedP, fileNames[parm])), {
              name: fileNames[parm],
            });
          }

          threadFor(parm + 1);
        });
      });
    }

    threadFor(0);
  });
});

export default router;
