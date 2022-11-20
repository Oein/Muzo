import { selectALL } from "./fileSystem.js";

let rclickMenu = document.querySelector("#rightclickmenu") as HTMLDivElement;

function normalizePozition(mouseX: number, mouseY: number) {
  let normalizedX = mouseX;
  let normalizedY = mouseY;
  let rclickW = rclickMenu.clientWidth;
  let rclickH = rclickMenu.clientHeight;
  if (normalizedX < 0) normalizedX = 0;
  if (normalizedY < 0) normalizedY = 0;
  if (window.innerWidth < rclickW + normalizedX)
    normalizedX = window.innerWidth - rclickW;
  if (window.innerHeight < rclickH + normalizedY)
    normalizedY = window.innerHeight - rclickH;

  return { normalizedX, normalizedY };
}

function closeRMenu() {
  rclickMenu.style.display = "none";
}

document.body.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  let { normalizedX, normalizedY } = normalizePozition(e.clientX, e.clientY);

  rclickMenu.style.left = `${normalizedX}px`;
  rclickMenu.style.top = `${normalizedY}px`;
  rclickMenu.style.display = "block";
});

document.body.addEventListener("click", (e) => {
  if ((e.target as any).offestParent != rclickMenu) closeRMenu();
});

let rclickselectall = document.querySelector("#selectall") as HTMLDivElement;
rclickselectall.addEventListener("click", () => {
  selectALL();
  closeRMenu();
});
