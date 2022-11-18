let media = document.getElementById("media") as HTMLSpanElement;
let audioContainer = document.getElementById(
  "audio-container"
) as HTMLDivElement;
let videoContainer = document.getElementById(
  "video-container"
) as HTMLDivElement;
let audioPlayer = document.getElementById("audio-player") as HTMLAudioElement;
let videoPlayer = document.getElementById("video-player") as HTMLVideoElement;
let infoText = document.getElementById("infoText") as HTMLDivElement;

import { audioExts, videoExts } from "./fileExts.js";

enum PlayingType {
  Audio,
  Video,
  NotPlaying,
}

let playing: PlayingType = PlayingType.NotPlaying;
let paused = true;

audioPlayer.addEventListener("pause", () => {
  if (playing == PlayingType.Audio) {
    paused = true;
  }
  classNamer();
});

videoPlayer.addEventListener("pause", () => {
  if (playing == PlayingType.Video) {
    paused = true;
  }
  classNamer();
});

audioPlayer.addEventListener("play", () => {
  paused = false;
  classNamer();
});

videoPlayer.addEventListener("play", () => {
  paused = false;
  classNamer();
});

export function focus() {
  if (playing == PlayingType.Audio) audioPlayer.focus();
  if (playing == PlayingType.Video) videoPlayer.focus();
}

function classNamer() {
  if (playing != PlayingType.NotPlaying && !paused)
    media.classList.add("playing");
  else media.classList.remove("playing");

  videoContainer.className = "";
  audioContainer.className = "";

  if (playing == PlayingType.Audio) {
    audioContainer.className = "show";
    audioPlayer.onplay = () => {
      audioPlayer.play();
    };
  } else audioPlayer.pause();
  if (playing == PlayingType.Video) {
    videoContainer.className = "show";
    videoPlayer.onload = () => {
      videoPlayer.play();
    };
  } else videoPlayer.pause();
}

export function playingText(fileName: string) {
  if (PlayingType.NotPlaying == playing) {
    infoText.innerText = `Playing Nothing`;
    return;
  }

  infoText.innerText = `Playing ${fileName}`;
}

export function play(drive: string, path: string, fileName: string) {
  let url = `/api/files/cat/?drive=${drive}&path=${
    path + fileName
  }&token=${sessionStorage.getItem("SessionKey")}`;

  audioPlayer.src = url;
  videoPlayer.src = url;
  playing = PlayingType.NotPlaying;

  let dns = fileName.split(".");
  if (
    (!fileName.startsWith(".") && dns.length >= 2) ||
    (fileName.startsWith(".") && dns.length >= 3)
  ) {
    let ext = dns[dns.length - 1].toLocaleLowerCase();
    if (audioExts.includes(ext)) {
      playing = PlayingType.Audio;
      paused = false;
    }
    if (videoExts.includes(ext)) {
      playing = PlayingType.Video;
      paused = false;
    }
  }

  playingText(fileName);
  classNamer();
}

classNamer();
