import { selectALL } from "../fileSystem.js";
import { closeRMenu } from "../rclickmenu.js";

let rclickselectall = document.querySelector("#selectall") as HTMLDivElement;
rclickselectall.addEventListener("click", () => {
  selectALL();
  closeRMenu();
});
