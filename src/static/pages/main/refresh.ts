import { lsAndShow } from "./fileSystem.js";

(document.getElementById("refresh") as HTMLSpanElement).addEventListener(
  "click",
  lsAndShow
);
