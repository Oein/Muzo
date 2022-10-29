import { QuickDB } from "quick.db";
import { dbFile } from "./appPaths";

export function init() {
  let db: QuickDB;

  db = new QuickDB({
    filePath: dbFile,
  });

  return db;
}
