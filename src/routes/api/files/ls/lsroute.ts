import express from "express";
import { permission } from "../../../../types/permission";
import getUserByDBedUserId from "../../../../utils/getUserByUserDBedID";
import validSession from "../../../../utils/validSession";
import { join as p_join } from "path";

import { pathExists } from "fs-extra";
import fsext from "fs-extra";

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

  let isV = await validSession(req);

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

  let joinedP = p_join(drive as string, path as string);

  pathExists(joinedP).then((v) => {
    fsext
      .readdir(joinedP, { withFileTypes: true })
      .then((f) => {
        let resV: { type: string; name: string }[] = [];
        f.forEach((v, i) => {
          if (v.isDirectory()) {
            resV.push({
              type: "dir",
              name: v.name,
            });
          } else if (v.isFile()) {
            resV.push({
              type: "fil",
              name: v.name,
            });
          } else if (v.isSymbolicLink()) {
            try {
              let s = fsext.readlinkSync(p_join(joinedP, v.name));
              let l = fsext.lstatSync(s);
              if (l.isFile())
                resV.push({
                  type: "slk__fil__" + s,
                  name: v.name,
                });
              if (l.isDirectory())
                resV.push({
                  type: "slk__dir__" + s,
                  name: v.name,
                });
            } catch (e) {
              resV.push({
                type: "ukn",
                name: v.name,
              });
            }
          } else {
            resV.push({
              type: "ukn",
              name: v.name,
            });
          }
        });
        resV.sort((a, b) => {
          if (a.type != b.type) {
            if (a.type < b.type) return -1;
            else return 1;
          }

          if (a.name < b.name) return -1;
          else return 1;
        });
        res.send(resV);
      })
      .catch((e) => {
        res.send(
          JSON.stringify({
            fse: e,
          })
        );
        return;
      });
  });
});

export default router;
