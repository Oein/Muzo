let drives__ = document.getElementById("sidebar") as HTMLDivElement;
let divider__ = document.querySelector("#divider") as HTMLDivElement;
let files__ = document.getElementById("files") as HTMLDivElement;
let tools__ = document.getElementById("tools") as HTMLDivElement;

let moving = false;

divider__.addEventListener("mousedown", (e) => {
  moving = true;
});

document.addEventListener("mouseup", (e) => {
  moving = false;
});

document.addEventListener("mousemove", (e) => {
  if (!moving) return;
  let x = e.clientX;

  let window_w = window.innerWidth;
  x = Math.max((window_w / 100) * 12, x);
  x = Math.min((window_w / 100) * 50, x);

  drives__.style.width = `${(x / window_w) * 100}vw`;
  divider__.style.left = `${(x / window_w) * 100}vw`;
  files__.style.left = `${((x + 3) / window_w) * 100}vw`;
  tools__.style.left = `${((x + 3) / window_w) * 100}vw`;
  files__.style.width = `${((window_w - x - 3) / window_w) * 100}vw`;
  tools__.style.width = `${((window_w - x - 3) / window_w) * 100}vw`;
});
