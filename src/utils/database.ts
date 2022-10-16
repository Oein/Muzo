import { QuickDB } from "quick.db";
import logger from "../logger/index.mjs";
import { dbFile } from "./appPaths";

let db: QuickDB;

export function init() {
  logger.info(`Reading database... (${dbFile})`);

  db = new QuickDB({
    filePath: dbFile,
  });
}

export default db!;
