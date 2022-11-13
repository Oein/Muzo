import session from "./session.js";
import { allowedPath } from "./../../../types/allowedPath";

let drives = document.getElementById("sidebar") as HTMLDivElement;
let divider = document.querySelector("#divider") as HTMLDivElement;
let files = document.getElementById("files") as HTMLDivElement;

session;

let driveCounts = 0;
let driveSelected = 0;

function createDrive(name: string) {
  let containor = document.createElement("div");
  let icon = document.createElement("span");
  icon.className = "material-symbols-outlined icon";
  icon.innerText = " folder ";
  let nameElement = document.createElement("div");
  nameElement.innerText = name;
  containor.append(icon);
  containor.append(nameElement);
  return containor;
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

        if (name == "/") name = "root directory";
        if (name == "~/") name = "user directory";

        let ns = name.split("/");
        if (ns.length > 2) {
          name = "" + ns[ns.length - 1];
        }

        let drive_ = createDrive(name);

        if (i == 0) drive_.className = "driveSelected";

        drive_.addEventListener("click", () => {
          drives.children[driveSelected + 1].className = "";
          driveSelected = i;
          drive_.className = "driveSelected";
        });

        drives.append(drive_);
      }
    });
}
