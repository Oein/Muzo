import session from "./session.js";
import { allowedPath } from "../../../types/allowedPath";
import * as ABPath from "./pathGoBack.js";
import { load, done } from "./loading.js";
import { play as playMedia } from "./mediaPlayer.js";
import { open as openPlayer } from "./mediaPlayerBTN.js";
import { os } from "./userAgent.js";
import { classNamer as dupliNamer } from "./rmenu/duplicate.js";

import {
  codeExts,
  imageExts,
  fontExts,
  videoExts,
  audioExts,
} from "./fileExts.js";
import { disablePlaylistAdd, enablePlaylistAdd } from "./playlistBTN.js";

let drives = document.getElementById("drives") as HTMLDivElement;
let files = document.getElementById("files") as HTMLDivElement;
let imgs = document.getElementById("imgs") as HTMLDivElement;

session;

export let driveSelected = 0;
export let drives_paths: string[] = [];
export let path = "/";
export let file_selected: number[] = [];
let show_hidden_files = false;
let last_file_click = new Date().getTime() - 100000;

let tools_download = document.getElementById("download") as HTMLSpanElement;
let tools_download_zip = document.getElementById(
  "downloadzip"
) as HTMLSpanElement;

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
    let fileList: string[] = [];
    file_selected.forEach((v, i) => {
      fileList.push(
        (files.children[v - 1].children[2] as HTMLDivElement).innerText
      );
    });
    download(
      `/api/files/zipcat/?drive=${
        drives_paths[driveSelected]
      }&path=${path}&token=${sessionStorage.getItem(
        "SessionKey"
      )}&file=${fileList.join("///")}`,
      (files.children[file_selected[0] - 1].children[2] as HTMLDivElement)
        .innerText
    );
  }
});

tools_download_zip.addEventListener("click", () => {
  if (!tools_download.classList.contains("enable")) return;
  let fileList: string[] = [];
  file_selected.forEach((v, i) => {
    fileList.push(
      (files.children[v - 1].children[2] as HTMLDivElement).innerText
    );
  });
  download(
    `/api/files/zipcat/?drive=${
      drives_paths[driveSelected]
    }&path=${path}&token=${sessionStorage.getItem(
      "SessionKey"
    )}&file=${fileList.join("///")}`,
    (files.children[file_selected[0] - 1].children[2] as HTMLDivElement)
      .innerText
  );
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
  let playlistAddEnable = false;
  if (file_selected[file_selected.length - 1] > files.childElementCount) return;
  for (let i = 0; i < files.childElementCount; i++) {
    files.children[i].className = "";
    (files.children[i].children[0] as HTMLInputElement).checked = false;
  }
  file_selected.forEach((v, i) => {
    files.children[v - 1].className = "driveSelected";
    let ty = (files.children[v - 1] as HTMLDivElement).innerText.trim();
    if (ty.startsWith("link")) enable = false;
    if (ty.startsWith("question")) enable = false;
    if (ty.startsWith("music_note")) playlistAddEnable = true;
    (files.children[v - 1].children[0] as HTMLInputElement).checked = true;
  });
  if (file_selected.length >= 1 && enable) {
    tools_download.className = "enable toolbtn";
    tools_download_zip.className = "enable toolbtn";
  } else {
    tools_download.className = "disable toolbtn";
    tools_download_zip.className = "disable toolbtn";
  }

  dupliNamer();

  if (playlistAddEnable) enablePlaylistAdd();
  else disablePlaylistAdd();
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
          file_selected = [];
        }
        if (d.type.startsWith("slk")) {
          alert("Muzo doesn't supports Symbolic links.");
        }
        if (d.type == "fil") {
          let dns = d.name.split(".");
          if (d.name.startsWith(".") == false && dns.length < 2) return;
          if (d.name.startsWith(".") && dns.length < 3) return;
          let ext = dns[dns.length - 1].toLocaleLowerCase();
          if (audioExts.includes(ext)) {
            playMedia(drives_paths[driveSelected], path, d.name);
            setTimeout(openPlayer, 5);
          }
          if (videoExts.includes(ext)) {
            playMedia(drives_paths[driveSelected], path, d.name);
            setTimeout(openPlayer, 5);
          }
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

        file_selected = [];
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
      classNamer();
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

export function selectALL() {
  for (let i = 1; i <= files.childElementCount; i++) {
    file_selected.push(i);
  }
  classNamer();
}

export function disSelectAll() {
  file_selected = [];
  classNamer();
}
