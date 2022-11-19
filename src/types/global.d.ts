/* eslint-disable no-var */
import { Config } from "./config";
import defaultConfig from "./defaultConfig";
import a from "jsmediatags";

declare global {
  var config: Config;
  var salt: string;

  interface window {
    jsmediatags: a;
  }
}

window.jsmediatags = a;

globalThis.config = defaultConfig;
