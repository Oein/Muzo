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

const app = express();

(async function () {
  logger.info("Starting muzo...");
  fsExtra.ensureDirSync(configDir);
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

  app.listen(global.config.port, () => {
    logger.success(
      `Successfully started your '${global.config.serverName}' on port ${global.config.port}`
    );
  });
})();
