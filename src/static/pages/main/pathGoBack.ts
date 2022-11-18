import { changePath } from "./fileSystem.js";

interface ABPaths {
  drive: number;
  path: string;
}

let beforePaths: ABPaths[] = [{ drive: 0, path: "/" }];
let afterPaths: ABPaths[] = [];

let go_btn = document.getElementById("go") as HTMLButtonElement;
let back_btn = document.getElementById("back") as HTMLButtonElement;

export function can_go_back() {
  return beforePaths.length > 1;
}

export function can_go_forward() {
  return afterPaths.length > 0;
}

export function forward(drive: number, path: string) {
  beforePaths.push({
    drive: drive,
    path: path,
  });

  afterPaths = [];

  if (can_go_back()) {
    back_btn.classList.add("enable");
    back_btn.classList.remove("disable");
  } else {
    back_btn.classList.remove("enable");
    back_btn.classList.add("disable");
  }

  if (can_go_forward()) {
    go_btn.classList.add("enable");
    go_btn.classList.remove("disable");
  } else {
    go_btn.classList.remove("enable");
    go_btn.classList.add("disable");
  }
}

export function back() {
  afterPaths.push(beforePaths[beforePaths.length - 1]);
  beforePaths = beforePaths.slice(0, -1);

  if (can_go_back()) {
    back_btn.classList.add("enable");
    back_btn.classList.remove("disable");
  } else {
    back_btn.classList.remove("enable");
    back_btn.classList.add("disable");
  }

  if (can_go_forward()) {
    go_btn.classList.add("enable");
    go_btn.classList.remove("disable");
  } else {
    go_btn.classList.remove("enable");
    go_btn.classList.add("disable");
  }

  return beforePaths[beforePaths.length - 1];
}

back_btn.addEventListener("click", () => {
  if (!can_go_back()) return;
  let b = back();
  changePath(b.drive, b.path);
});

go_btn.addEventListener("click", () => {
  if (!can_go_forward()) return;

  let f = afterPaths[afterPaths.length - 1];
  afterPaths = afterPaths.slice(0, -1);
  beforePaths.push(f);

  if (can_go_back()) {
    back_btn.classList.add("enable");
    back_btn.classList.remove("disable");
  } else {
    back_btn.classList.remove("enable");
    back_btn.classList.add("disable");
  }

  if (can_go_forward()) {
    go_btn.classList.add("enable");
    go_btn.classList.remove("disable");
  } else {
    go_btn.classList.remove("enable");
    go_btn.classList.add("disable");
  }

  changePath(f.drive, f.path);
});
