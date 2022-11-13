import session from "./session.js";
import { allowedPath } from "./../../../types/allowedPath";

let drives = document.getElementById("sidebar") as HTMLDivElement;
let files = document.getElementById("files") as HTMLDivElement;

session;

let driveCounts = 0;
let driveSelected = 0;
let drives_paths: string[] = [];
let path = "/";

let files_path: { type: string; name: string }[] = [];
let file_selected = -1;
let file_c = 0;

let last_file_click = new Date().getTime() - 100000;

files.addEventListener("click", () => {
  if (file_selected != -1 && file_c == 0) {
    files.children[file_selected].className = "";
    file_selected = -1;
  }
  file_c = 0;
});

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
  axios
    .get(`/api/files/ls?drive=${drives_paths[driveSelected]}&path=${path}`, {
      headers: {
        Authorization: sessionStorage.getItem("SessionKey"),
      },
    })
    .then((v) => {
      files_path = v.data;
      v.data.forEach((d: { type: string; name: string }, i) => {
        let cfd: HTMLDivElement;
        if (d.type == "dir") {
          cfd = createFileDiv(d.name);
        } else if (d.type == "fil") {
          cfd = createFileDiv(d.name, " draft ");
        } else if (d.type == "slk") {
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
                  lsAndShow();
                  return;
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
    });
}

export function sessionGenerateDone() {
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

      driveCounts = d.length;

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
          drives.children[driveSelected + 1].className = "";
          driveSelected = i;
          drive_.className = "driveSelected";
          path = "";
          lsAndShow();
        });

        drives.append(drive_);
      }

      lsAndShow();
    });
}
