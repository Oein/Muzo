import {
  file_selected,
  driveSelected,
  drives_paths,
  path,
} from "./fileSystem.js";
import { audioFilePlaylist } from "./mediaPlayer.js";

let add = document.querySelector("#playlistadd") as HTMLSpanElement;
let files___ = document.querySelector("#files") as HTMLDivElement;

add.addEventListener("click", () => {
  file_selected.forEach((v, i) => {
    let fn = (files___.children[v - 1] as HTMLDivElement).innerText;
    if (!fn.startsWith("music_note")) return;
    fn = fn.replace("music_note", "");
    let play = {
      drive: drives_paths[driveSelected],
      path: path,
      filenames: fn,
    };
    if (
      !audioFilePlaylist
        .map((v, i) => {
          if (
            v.drive == play.drive &&
            v.path == play.path &&
            v.filenames == play.filenames
          )
            return false;
          return true;
        })
        .includes(false)
    )
      audioFilePlaylist.push(play);
  });
});
