import session from "./session.js";
import { allowedPath } from "../../../types/allowedPath";
import * as ABPath from "./pathGoBack.js";
import { load, done } from "./loading.js";

import {
  codeExts,
  imageExts,
  fontExts,
  videoExts,
  audioExts,
} from "./fileExts.js";

let drives = document.getElementById("drives") as HTMLDivElement;
let files = document.getElementById("files") as HTMLDivElement;
let imgs = document.getElementById("imgs") as HTMLDivElement;

session;

let driveSelected = 0;
let drives_paths: string[] = [];
let path = "/";

let file_selected: number[] = [];
let files_list: { type: string; name: string }[] = [];
let file_c = 0;
let file_type = "ukn";

let show_hidden_files = false;

let last_file_click = new Date().getTime() - 100000;

let os: string = "";
let ua = navigator.userAgent as string;

let tools_download = document.getElementById("download") as HTMLSpanElement;

// remove zoombox
let removes = [
  "zoombox-about",
  "zoombox-count",
  "zoombox-play",
  "zoombox-next",
  "zoombox-prev",
  "zoombox-preview",
];
removes.map((v) => {
  (document.getElementsByClassName(v)[0] as any).style.display = "none";
});
((window as any).zoombox as any).option({
  enableZoomButton: true,
  hideWatermark: true,
});

(function () {
  if (ua.match(/Win(dows )?NT 6\.0/)) {
    os = "Windows Vista";
  } else if (ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
    os = "Windows XP";
  } else {
    if (ua.indexOf("Windows NT 5.1") != -1 || ua.indexOf("Windows XP") != -1) {
      os = "Windows XP";
    } else if (
      ua.indexOf("Windows NT 7.0") != -1 ||
      ua.indexOf("Windows NT 6.1") != -1
    ) {
      os = "Windows 7";
    } else if (
      ua.indexOf("Windows NT 8.0") != -1 ||
      ua.indexOf("Windows NT 6.2") != -1
    ) {
      os = "Windows 8";
    } else if (
      ua.indexOf("Windows NT 8.1") != -1 ||
      ua.indexOf("Windows NT 6.3") != -1
    ) {
      os = "Windows 8.1";
    } else if (
      ua.indexOf("Windows NT 10.0") != -1 ||
      ua.indexOf("Windows NT 6.4") != -1
    ) {
      os = "Windows 10";
    } else if (
      ua.indexOf("iPad") != -1 ||
      ua.indexOf("iPhone") != -1 ||
      ua.indexOf("iPod") != -1
    ) {
      os = "Apple iOS";
    } else if (ua.indexOf("Android") != -1) {
      os = "Android OS";
    } else if (ua.match(/Win(dows )?NT( 4\.0)?/)) {
      os = "Windows NT";
    } else if (ua.match(/Mac|PPC/)) {
      os = "Mac OS";
    } else if (ua.match(/Linux/)) {
      os = "Linux";
    } else if (ua.match(/(Free|Net|Open)BSD/)) {
      os = RegExp.$1 + "BSD";
    } else if (ua.match(/SunOS/)) {
      os = "Solaris";
    }
  }
  if (os.indexOf("Windows") != -1) {
    if (
      navigator.userAgent.indexOf("WOW64") > -1 ||
      navigator.userAgent.indexOf("Win64") > -1
    ) {
      os += " 64bit";
    } else {
      os += " 32bit";
    }
  }
})();

// blank click
files.addEventListener("click", () => {
  if (file_selected.length == 0 && file_c == 0) {
    file_selected.map((v) => {
      files.children[v].className = "";
    });

    file_selected = [];
  }
  file_c = 0;
});

tools_download.addEventListener("click", () => {
  if (!tools_download.classList.contains("enable")) return;
  if (file_selected.length == 1) {
    download(
      `/api/files/cat/?drive=${drives_paths[driveSelected]}&path=${
        path +
        (files.children[file_selected[0] - 1].children[2] as HTMLDivElement)
          .innerText
      }&token=${sessionStorage.getItem("SessionKey")}`,
      (files.children[file_selected[0] - 1].children[2] as HTMLDivElement)
        .innerText
    );
  } else {
  }
});

export function changePath(driveX: number, pathX: string) {
  drives.children[driveSelected].className = "";
  driveSelected = driveX;
  drives.children[driveSelected].className = "driveSelected";
  path = pathX;
  lsAndShow();
}

function classNamer() {
  file_selected.sort();
  let enable = true;
  if (file_selected[file_selected.length - 1] > files.childElementCount) return;
  for (let i = 0; i < files.childElementCount; i++) {
    files.children[i].className = "";
    (files.children[i].children[0] as HTMLInputElement).checked = false;
  }
  file_selected.forEach((v, i) => {
    files.children[v - 1].className = "driveSelected";
    let ty = (files.children[v - 1] as HTMLDivElement).innerText.trim();
    console.log(ty);
    if (ty.startsWith("link")) enable = false;
    if (ty.startsWith("question")) enable = false;
    (files.children[v - 1].children[0] as HTMLInputElement).checked = true;
  });
  if (file_selected.length >= 1 && enable)
    tools_download.className = "enable toolbtn";
  else tools_download.className = "disable toolbtn";
}

function download(url: string, name: string) {
  let encodedUri = encodeURI(url);
  let link = document.createElement("a");

  link.setAttribute("href", encodedUri);
  link.setAttribute("download", name);

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  done();
}

function createFileDiv(
  name: string,
  iconText: string = " folder ",
  checkBox: boolean = false
) {
  let containor = document.createElement("div");
  let icon = document.createElement("span");
  icon.className = "material-symbols-outlined icon";
  icon.innerText = iconText;
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "cb";
  let nameElement = document.createElement("div");
  nameElement.innerText = name;
  if (checkBox) containor.append(checkbox);
  containor.append(icon);
  containor.append(nameElement);
  return containor;
}

function fileClickHnadler(
  e: MouseEvent,
  i: number,
  d: { type: string; name: string }
) {
  file_type = d.type;
  if (
    (e.target as HTMLInputElement | HTMLDivElement).classList.contains("cb")
  ) {
    // input
    let target = e.target as HTMLInputElement;
    if (target.checked) {
      if (!file_selected.includes(i)) file_selected.push(i);
    } else {
      if (file_selected.includes(i))
        file_selected.splice(file_selected.indexOf(i), 1);
    }
    classNamer();
  } else {
    // div
    let target = e.target as HTMLDivElement;
    if (
      ((os.includes("Mac") || os.includes("Apple")) && e.metaKey) ||
      ((os.includes("Windows") || os.includes("Linux")) && e.ctrlKey)
    ) {
      if (file_selected.includes(i))
        file_selected.splice(file_selected.indexOf(i), 1);
      else file_selected.push(i);
    } else {
      if (
        file_selected.length == 1 &&
        file_selected[0] == i &&
        new Date().getTime() - last_file_click < 300
      ) {
        if (d.type == "dir") {
          path += d.name + "/";
          ABPath.forward(driveSelected, path);
          lsAndShow();
        }
        if (d.type.startsWith("slk")) {
          alert("Muzo doesn't supports Symbolic links.");
        }
        if (d.type == "fil") {
          let dns = d.name.split(".");
          if (d.name.startsWith(".") == false && dns.length < 2) return;
          if (d.name.startsWith(".") && dns.length < 3) return;
          let ext = dns[dns.length - 1].toLocaleLowerCase();
          if (audioExts.includes(ext)) alert("Play audio");
          if (videoExts.includes(ext)) alert("Play Movie");
          if (codeExts.includes(ext)) alert("Editor");
          if (imageExts.includes(ext)) {
            if (ext == "heic") {
              alert("Muzo doesn't support apple's image extension [HEIC].");
              return;
            }
            let img_ = document.createElement("img");
            img_.src = encodeURI(
              `/api/files/cat/?drive=${drives_paths[driveSelected]}&path=${
                path + d.name
              }&token=${sessionStorage.getItem("SessionKey")}`
            );
            img_.setAttribute("zoombox", "");
            imgs.innerHTML = "";
            imgs.append(img_);
            img_.style.width = "1px";
            img_.style.height = "1px";
            img_.style.display = "none";
            (window as any).zoomBoxExecute();
            img_.addEventListener("load", () => {
              img_.click();
            });
          }
        }

        last_file_click = new Date().getTime() - 1000;
        return;
      }
      file_selected = [i];
      last_file_click = new Date().getTime();
    }
    classNamer();
  }
}

export function lsAndShow() {
  files.innerHTML = "";
  load();
  axios
    .get(`/api/files/ls?drive=${drives_paths[driveSelected]}&path=${path}`, {
      headers: {
        Authorization: sessionStorage.getItem("SessionKey"),
      },
    })
    .then((v) => {
      files_list = v.data;
      v.data.forEach((d: { type: string; name: string }, i) => {
        if (d.name.startsWith(".") && !show_hidden_files) {
          return;
        }
        let cfd: HTMLDivElement;
        if (d.type == "dir") {
          cfd = createFileDiv(d.name, " folder ", true);
        } else if (d.type == "fil") {
          let dns = d.name.split(".");
          let iconName = " draft ";
          if (
            (!d.name.startsWith(".") && dns.length >= 2) ||
            (d.name.startsWith(".") && dns.length >= 3)
          ) {
            let ext = dns[dns.length - 1].toLocaleLowerCase();

            if (audioExts.includes(ext)) iconName = " music_note ";
            if (videoExts.includes(ext)) iconName = " movie ";
            if (codeExts.includes(ext)) iconName = " code ";
            if (imageExts.includes(ext)) iconName = " image ";
            if (fontExts.includes(ext)) iconName = " text_fields ";
            if (ext == "json") iconName = " data_object ";
            if (ext == "html") iconName = "html";
            if (ext == "js") iconName = "javascript";
            if (ext == "php") iconName = "php";
            if (ext == "css") iconName = "css";
            if (ext == "html") iconName = "code";
            if (ext == "txt") iconName = " description ";
            if (ext == "gif") iconName = " gif ";
          }
          cfd = createFileDiv(d.name, iconName, true);
        } else if (d.type.startsWith("slk")) {
          cfd = createFileDiv(d.name, " link ", true);
        } else {
          cfd = createFileDiv(d.name, " question_mark ", true);
        }

        let flc = files.childElementCount;

        cfd.addEventListener("click", (e) => {
          fileClickHnadler(e, flc + 1, d);
        });

        files.append(cfd);
      });
    })
    .finally(() => {
      done();
    });
}

export function sessionGenerateDone() {
  load();
  axios
    .get("/api/files/drives/get", {
      headers: {
        Authorization: sessionStorage.getItem("SessionKey"),
      },
    })
    .then((v) => {
      let d = v.data;

      if (d.e) {
        alert(`Critical error! ${d.e}`);
        return;
      }

      d = d as allowedPath[];

      for (let i = 0; i < d.length; i++) {
        let name = d[i].pathD.trim();
        drives_paths.push(d[i].pathD);

        if (name == "/") name = "root directory";
        if (name == "~/") name = "user directory";

        let ns = name.split("/");
        if (ns.length > 2) {
          name = "" + ns[ns.length - 1];
        }

        let drive_ = createFileDiv(name);

        if (i == 0) drive_.className = "driveSelected";

        drive_.addEventListener("click", () => {
          if (driveSelected == i && path == "") return;
          drives.children[driveSelected].className = "";
          driveSelected = i;
          drive_.className = "driveSelected";
          tools_download.className = "disable toolbtn";
          path = "";
          ABPath.forward(driveSelected, path);
          file_selected = [];
          lsAndShow();
        });

        drives.append(drive_);
      }

      lsAndShow();
    })
    .finally(() => {
      done();
    });
}
