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

session;

let driveSelected = 0;
let drives_paths: string[] = [];
let path = "/";

let file_selected = -1;
let file_c = 0;

let show_hidden_files = false;

let last_file_click = new Date().getTime() - 100000;

export function changePath(driveX: number, pathX: string) {
  drives.children[driveSelected].className = "";
  driveSelected = driveX;
  drives.children[driveSelected].className = "driveSelected";
  path = pathX;
  lsAndShow();
}

files.addEventListener("click", () => {
  if (file_selected != -1 && file_c == 0) {
    files.children[file_selected].className = "";
    file_selected = -1;
  }
  file_c = 0;
});

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

function createFileDiv(name: string, iconText: string = " folder ") {
  let containor = document.createElement("div");
  let icon = document.createElement("span");
  icon.className = "material-symbols-outlined icon";
  icon.innerText = iconText;
  let nameElement = document.createElement("div");
  nameElement.innerText = name;
  containor.append(icon);
  containor.append(nameElement);
  return containor;
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
        if (d.name.startsWith(".") && !show_hidden_files) return;
        let cfd: HTMLDivElement;
        if (d.type == "dir") {
          cfd = createFileDiv(d.name);
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
          cfd = createFileDiv(d.name, iconName);
        } else if (d.type.startsWith("slk")) {
          cfd = createFileDiv(d.name, " link ");
        } else {
          cfd = createFileDiv(d.name, " question_mark ");
        }

        cfd.addEventListener("click", () => {
          file_c = 1;
          if (file_selected != -1) {
            if (file_selected == i) {
              if (new Date().getTime() - last_file_click < 300) {
                if (d.type == "dir") {
                  path += d.name + "/";
                  ABPath.forward(driveSelected, path);
                  lsAndShow();
                  return;
                } else if (d.type.includes("slk")) {
                  let t = d.type.replace("slk__", "");
                  if (t.startsWith("dir")) {
                    t = t.replace("dir__", "");
                    path = t;
                    ABPath.forward(driveSelected, path);
                    lsAndShow();
                    return;
                  } else {
                    t = t.replace("fil__", "");
                  }
                  return;
                } else if (d.type == "fil") {
                  load();
                  download(
                    encodeURI(
                      `/api/files/cat/?drive=${
                        drives_paths[driveSelected]
                      }&path=${path + d.name}&token=${sessionStorage.getItem(
                        "SessionKey"
                      )}`
                    ),
                    d.name
                  );
                  file_selected = -1;
                  cfd.className = "";
                }
              }
            }

            if (files.childElementCount > file_selected)
              files.children[file_selected].className = "";
            file_selected = -1;
          }
          if (file_selected == -1) {
            file_selected = i;
            cfd.className = "driveSelected";
            last_file_click = new Date().getTime();
          }
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
          path = "";
          ABPath.forward(driveSelected, path);
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
