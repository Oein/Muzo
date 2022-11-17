let media_tool = document.getElementById("media") as HTMLSpanElement;
let player = document.getElementsByClassName(
  "mediaSmallPlayer"
)[0] as HTMLDivElement;
let media_open_element = document.getElementById(
  "mediaOpen"
) as HTMLInputElement;

export let media_opened = false;

function toggleMedia() {
  if (media_opened) player.className = "mediaSmallPlayer open";
  else player.className = "mediaSmallPlayer close";
}

media_tool.addEventListener("click", (e) => {
  if (!e) return;
  setTimeout(() => {
    media_opened = !media_opened;
    if ((e.target as HTMLElement).tagName.toLocaleLowerCase() == "div") {
      media_opened = true;
    }
  }, 0);
});

window.addEventListener("click", (e) => {
  media_opened = false;
  setTimeout(toggleMedia, 10);
});
