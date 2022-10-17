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
import { configDir, configFile, saltFile, dataDir } from "./utils/appPaths";
import defaultConfig from "./types/defaultConfig.js";

import { readFileSync, existsSync, writeFileSync } from "fs";
import fsExtra from "fs-extra";
import { stringify as ya_stringify, parse as ya_parse } from "yaml";
import express from "express";
import { join as p_join } from "path";

// router imports
import route_api from "./routes/api/apiroute";
import route_root from "./routes/index";

import { fileURLToPath } from "url";
import { dirname } from "path";

// init database
import { init as initDB } from "./utils/database";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

async function ensureSalt() {
  let salt = btoa(
    (Math.random() * 10000000000 * new Date().getTime()).toString()
  ).slice(5, 13);

  async function delay(ms: number) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  await delay(3);

  salt += btoa(
    (Math.random() * 10000000000 * new Date().getTime()).toString()
  ).slice(-10);

  await delay(10);

  salt += btoa(
    (Math.random() * 10000000000 * new Date().getTime()).toString()
  ).slice(0, 10);

  if (!existsSync(saltFile)) {
    logger.error("Could not find encrypted salt file");
    logger.info("Creating muzo salt file...");

    writeFileSync(
      saltFile,
      `# Important! Do not edit this file, or you cannot sign in to the service.
${salt}`
    );
  }

  global.salt = readFileSync(saltFile).toString().split("\n")[1];
}

async function ensureConfig() {
  logger.info(`Reading muzo configuration... (${configFile})`);

  if (!existsSync(configFile)) {
    logger.error("Could not find muzo configuration file");
    logger.info("Creating muzo configuration file...");

    writeFileSync(configFile, ya_stringify(defaultConfig));
  }

  global.config = {
    ...defaultConfig,
    ...ya_parse(readFileSync(configFile).toString()),
  };

  writeFileSync(configFile, ya_stringify(global.config));
}

(async function () {
  console.log("*     *  *    *  *****   ****");
  console.log("**   **  *    *     *   *    *");
  console.log("* * * *  *    *    *    *    *");
  console.log("*  *  *  *    *   *     *    *");
  console.log("*     *   ****   *****   ****");
  console.log("                      by Oein");
  logger.info("Starting muzo...");

  fsExtra.ensureDirSync(configDir);
  fsExtra.ensureDirSync(dataDir);
  fsExtra.ensureDirSync(p_join(configDir, "invites"));

  await ensureSalt();
  await ensureConfig();
  initDB();

  app.use("/static", express.static(p_join(__dirname, "/static")));
  app.use("/api", route_api);
  app.use("/", route_root);

  app.listen(global.config.port, () => {
    logger.success(
      `Successfully started your '${global.config.serverName}' on port ${global.config.port}`
    );
  });
})();
