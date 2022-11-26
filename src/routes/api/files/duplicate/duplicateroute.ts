import express from "express";
import { permission } from "../../../../types/permission";
import getUserByDBedUserId from "../../../../utils/getUserByUserDBedID";
import { validSession_ } from "../../../../utils/validSession";
import { join as p_join } from "path";

import fs from "fs-extra";

const router = express.Router();

function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res) => {
  let drive = decodeURI(req.query.drive?.toString() || "");
  let path = decodeURI(req.query.path?.toString() || "");
  let fileNames = decodeURI((req.query.file as string) || "").split("///");

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
      let earlyFileN = p_join(joinedP, fileNames[parm]);

      fs.pathExists(earlyFileN).then((exsi) => {
        if (!exsi) {
          res.write(`${parm},`);
          threadFor(parm + 1);
          return;
        }

        function tryDup(
          ddCnt: number = 0,
          prefix: string = "Duplication of ",
          ddu: string = "D"
        ) {
          let newFileN = p_join(joinedP, prefix + fileNames[parm]);
          if (prefix.length + fileNames[parm].length > 255) {
            let fnn = fileNames[parm];
            while (fnn.startsWith("Duplication of "))
              fnn = fnn.replace("Duplication of ", "");
            let newDD = "";
            for (let i = 0; i <= ddCnt; i++) {
              newDD += ddu;
            }
            tryDup(ddCnt + 1, newDD);
            return;
          }
          fs.pathExists(newFileN).then((exsis) => {
            if (exsis) {
              tryDup(ddCnt, prefix + "Duplication of ");
              return;
            }

            fs.copy(earlyFileN, newFileN).then(() => {
              res.write(`${parm},`);
              threadFor(parm + 1);
            });
          });
        }

        tryDup();
      });
    }

    threadFor(0);
  });
});

export default router;
