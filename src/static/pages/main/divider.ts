let drives__ = document.getElementById("sidebar") as HTMLDivElement;
let divider__ = document.querySelector("#divider") as HTMLDivElement;
let files__ = document.getElementById("files") as HTMLDivElement;

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

  drives__.style.width = `${(x / window_w) * 100}vw`;
  files__.style.width = `${((window_w - x - 3) / window_w) * 100}vw`;
});
