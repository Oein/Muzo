import {
  file_selected,
  path,
  driveSelected,
  drives_paths,
} from "../fileSystem.js";
import { closeRMenu } from "../rclickmenu.js";

let rclickDuplicate = document.querySelector("#Duplicate") as HTMLDivElement;

export function classNamer() {
  if (file_selected.length) rclickDuplicate.classList.remove("disable");
  else rclickDuplicate.classList.add("disable");
}

rclickDuplicate.addEventListener("click", () => {
  closeRMenu();
});
