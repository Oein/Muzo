let media_tool = document.getElementById("media") as HTMLSpanElement;
let player = document.getElementsByClassName(
  "mediaSmallPlayer"
)[0] as HTMLDivElement;
import { focus } from "./mediaPlayer.js";

export let media_opened = false;

function toggleMedia() {
  if (media_opened) {
    player.className = "mediaSmallPlayer open";
    focus();
  } else player.className = "mediaSmallPlayer close";
}

export function open(e: MouseEvent | undefined = undefined) {
  media_opened = !media_opened;
  if (e == undefined) {
    media_opened = true;
  } else if ((e.target as HTMLElement).tagName.toLocaleLowerCase() == "div") {
    media_opened = true;
  }
  toggleMedia();
}

media_tool.addEventListener("click", (e) => {
  if (!e) return;
  setTimeout(open, 0, e);
});

window.addEventListener("click", (e) => {
  media_opened = false;
  setTimeout(toggleMedia, 10);
});
