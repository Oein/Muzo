let media = document.getElementById("media") as HTMLSpanElement;
let audioContainer = document.getElementById(
  "audio-containor"
) as HTMLDivElement;
let videoContainer = document.getElementById(
  "video-containor"
) as HTMLDivElement;
let audioPlayer = document.getElementById("audio-player") as HTMLAudioElement;
let videoPlayer = document.getElementById("video-player") as HTMLVideoElement;

enum PlayingType {
  Audio,
  Video,
  NotPlaying,
}

let playing: PlayingType = PlayingType.Audio;

function classNamer() {
  if (playing != PlayingType.NotPlaying) media.classList.add("playing");
  else media.classList.remove("playing");

  videoContainer.className = "";
  audioContainer.className = "";

  if (playing == PlayingType.Audio) audioContainer.className = "show";
  else audioPlayer.pause();
  if (playing == PlayingType.Video) videoContainer.className = "show";
  else videoPlayer.pause();
}

classNamer();
