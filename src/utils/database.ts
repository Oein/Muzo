import { QuickDB } from "quick.db";
import { dbFile } from "./appPaths";

const db = new QuickDB({
  filePath: dbFile,
});

export default db;
