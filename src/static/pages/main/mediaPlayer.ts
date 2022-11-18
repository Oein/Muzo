let media = document.getElementById("media") as HTMLSpanElement;

enum PlayingType {
  Audio,
  Video,
  NotPlaying,
}

let playing: PlayingType = PlayingType.Audio;

function classNamer() {
  if (playing != PlayingType.NotPlaying) media.classList.add("playing");
  else media.classList.remove("playing");
}

classNamer();
