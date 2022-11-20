/* eslint-disable no-var */
import { Config } from "./config";
import defaultConfig from "./defaultConfig";
import a from "jsmediatags";
import b from "awesome-notifications";

interface CustomWindow extends Window {
  jsmediatags: a = a;
  AWN: b = b;
}

declare global {
  var config: Config;
  var salt: string;
}

declare let window: CustomWindow;

window.jsmediatags = a;
window.AWN = b;

globalThis.config = defaultConfig;
