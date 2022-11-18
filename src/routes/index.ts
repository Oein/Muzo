import express from "express";
import { readFile } from "fs";
import { join as p_join } from "path";

const router = express.Router();

import { fileURLToPath } from "url";
import { dirname } from "path";
import logger from "../logger/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middleware that is specific to this router
router.use((req, res, next) => {
  next();
});

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

router.get("/404", (req, res) => {
  res.sendFile(p_join(__dirname, "..", "public", "404.html"));
});

router.get("/*", (req, res) => {
  let fileN = req.params[0] as string;
  if (fileN.endsWith("/")) fileN += "index.html";
  if (!fileN.includes(".")) fileN += "index.html";
  if (fileN.endsWith(".html")) {
    readFile(p_join(__dirname, "..", "public", fileN), (e, v) => {
      if (e) {
        res.status(404);
        logger.error(`[404] ${req.path}`);
        res.redirect("/404");
        return;
      }
      res.send(
        replaceAll(
          replaceAll(
            replaceAll(v.toString(), "{serverName}", global.config.serverName),
            "\n",
            ""
          ),
          "    ",
          ""
        ).replace(
          "</body>",
          replaceAll(
            `
          </body>
          <!-- Axios -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.1.3/axios.min.js" id="axios" defer async></script>
        `,
            "\n",
            ""
          )
        )
      );
    });
  } else if (fileN.endsWith(".css")) {
    res.contentType(".css");
    readFile(p_join(__dirname, "..", "public", fileN), (e, v) => {
      if (e) {
        res.status(404);
        logger.error(`[404] ${req.path}`);
        res.redirect("/404");
        return;
      }
      res.send(
        replaceAll(
          replaceAll(replaceAll(v.toString(), "\t", ""), "\n", " "),
          "  ",
          " "
        )
      );
    });
  } else {
    res.download(p_join(__dirname, "..", "public", fileN));
  }
});

export default router;
