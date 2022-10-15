import envPaths from "env-paths";
import { join } from "path";

const appPaths = envPaths("Muzo");

export const configFile = join(appPaths.config, "config.yaml");
export const configDir = appPaths.config;
