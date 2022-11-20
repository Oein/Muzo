import envPaths from "env-paths";
import { join } from "path";
import { ensureDirSync } from "fs-extra";

const appPaths = envPaths("Muzo");

ensureDirSync(appPaths.config);
ensureDirSync(appPaths.data);

export const configFile = join(appPaths.config, "config.yaml");
export const saltFile = join(appPaths.config, "salt.encrypted");
export const dbFile = join(appPaths.data, "db.sqlite");
export const configDir = appPaths.config;
export const dataDir = appPaths.data;
