import { disSelectAll } from "./fileSystem.js";

(document.querySelector("#files") as HTMLDivElement).addEventListener(
  "click",
  (e) => {
    if (!e.target) return;
    if (!(e.target as any).id) return;
    if ((e.target as any).id == "files") disSelectAll();
  }
);
