import session from "./session.js";

let drives = document.getElementById("sidebar") as HTMLDivElement;
let divider = document.querySelector("#divider") as HTMLDivElement;
let files = document.getElementById("files") as HTMLDivElement;

session;

// driveSelected

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

let executed = false;

function sessionGenerateDone() {
  executed = true;
  console.log("file system");
}

if ((window as any).sessionValid != undefined && !executed) {
  sessionGenerateDone();
}
