/*

     *     *  *    *  *****   ****
     **   **  *    *     *   *    *
     * * * *  *    *    *    *    *
     *  *  *  *    *   *     *    *
     *     *   ****   *****   ****
  
               Muzo by Oein
  Copyright (c) 2022 All rights reserved.

  Version / d.1.0.0
  Date    / 20221015
 */

import logger from "./logger/index.mjs";
import { configDir, configFile } from "./utils/appPaths";
import defaultConfig from "./types/defaultConfig.js";

import { readFileSync, existsSync, writeFileSync } from "fs";
import fsExtra from "fs-extra";
import { stringify as ya_stringify, parse as ya_parse } from "yaml";
import express from "express";
import { join as p_join } from "path";

// router imports
import route_api_files from "./routes/api/files/list";
import route_root from "./routes/index";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

(async function () {
  console.log("*     *  *    *  *****   ****");
  console.log("**   **  *    *     *   *    *");
  console.log("* * * *  *    *    *    *    *");
  console.log("*  *  *  *    *   *     *    *");
  console.log("*     *   ****   *****   ****");
  console.log("                      by Oein");
  logger.info("Starting muzo...");

  fsExtra.ensureDirSync(configDir);
  fsExtra.ensureDirSync(p_join(configDir, "invites"));

  if (!existsSync(configFile)) {
    logger.error("Could not find muzo configuration file");
    logger.info("Creating muzo configuration file...");

    writeFileSync(configFile, ya_stringify(defaultConfig));
  }

  global.config = {
    ...defaultConfig,
    ...ya_parse(readFileSync(configFile).toString()),
  };

  logger.info(`Reading muzo configuration... (${configFile})`);
  writeFileSync(configFile, ya_stringify(global.config));

  app.use("/api/files", route_api_files); // dir command api
  app.use("/static", express.static(p_join(__dirname, "/static")));
  app.use("/", route_root);

  app.listen(global.config.port, () => {
    logger.success(
      `Successfully started your '${global.config.serverName}' on port ${global.config.port}`
    );
  });
})();
