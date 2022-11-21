/* eslint-disable no-var */
import { Config } from "./config";
import defaultConfig from "./defaultConfig";

declare global {
  var config: Config;
  var salt: string;
}

globalThis.config = await defaultConfig();
