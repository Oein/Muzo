/* eslint-disable no-var */
import { Config } from "./config";
import defaultConfig from "./defaultConfig";

declare global {
  var config: Config;
}

globalThis.config = defaultConfig;
