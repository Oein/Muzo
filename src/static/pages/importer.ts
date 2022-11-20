class Script {
  url: string = "";
  isModule: boolean | null | undefined;
  constructor(url: string, isModule: any = false) {
    this.url = url;
    this.isModule = false;
    if (isModule) this.isModule = true;
  }
}

let scripts: Script[] = [
  new Script("/static/pages/main/close.js"),
  new Script("/static/pages/main/divider.js"),
  new Script("/static/pages/main/fullscreen.js"),
  new Script("/static/pages/main/fileSystem.js", 1),
  new Script("/static/pages/main/loading.js", 1),
  new Script("/static/pages/main/refresh.js", 1),
  new Script("/static/pages/main/disallselector.js", 1),
  new Script("/static/pages/main/keyListener.js", 1),
  new Script("/static/pages/main/mediaPlayerBTN.js", 1),
  new Script("/static/pages/main/playlistBTN.js", 1),
  new Script("/static/pages/main/rclickmenu.js", 1),
];

let csses: string[] = [
  "/css/index.css",
  "/css/global.css",
  "/css/loading.css",
  "/css/file_browser.css",
  "/css/googleIcon.css",
  "/css/zoombox.css",
];

csses.forEach((v) => {
  let li = document.createElement("link");
  li.type = "text/css";
  li.rel = "stylesheet";
  li.href = v;
  document.body.appendChild(li);
});

scripts.forEach((v) => {
  let sc = document.createElement("script");
  sc.setAttribute("defer", "");
  sc.src = v.url;
  if (v.isModule) {
    sc.setAttribute("type", "module");
  }
  document.body.appendChild(sc);
});
