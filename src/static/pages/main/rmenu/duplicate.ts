import {
  file_selected,
  file_names,
  path,
  driveSelected,
  drives_paths,
  disSelectAll,
  lsAndShow,
} from "../fileSystem.js";
import { closeRMenu } from "../rclickmenu.js";

let rclickDuplicate = document.querySelector("#Duplicate") as HTMLDivElement;

export function classNamer() {
  if (file_selected.length) rclickDuplicate.classList.remove("disable");
  else rclickDuplicate.classList.add("disable");
}

rclickDuplicate.addEventListener("click", () => {
  closeRMenu();

  let fn = Object.keys(file_names).map(function (key) {
    return file_names[key].name;
  });
  let fn2 = fn.filter((v, i) => {
    return file_selected.includes(i);
  });

  (<any>window).notifier.async(
    new Promise((resolve, reject) => {
      axios
        .get(
          encodeURI(
            `/api/files/duplicate?drive=${
              drives_paths[driveSelected]
            }&path=${path}&token=${sessionStorage.getItem(
              "SessionKey"
            )}&file=${fn2.join("///")}`
          ),
          {
            headers: {
              Authorization: sessionStorage.getItem("SessionKey"),
            },
          }
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch((e) => reject(e));
    }),
    (suc) => {
      (<any>window).notifier.success("Successfully duplicated files");
      lsAndShow();
    },
    (err) => {
      console.log(err);
      (<any>window).notifier.warning("Error occurred while duplicating files");
      lsAndShow();
    },
    "Duplicating files..."
  );

  disSelectAll();
});
