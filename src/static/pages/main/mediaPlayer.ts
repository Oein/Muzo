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

let audioName = document.querySelector("#albumName") as HTMLDivElement;
let trackName = document.querySelector("#trackName") as HTMLDivElement;
let audioNameB = document.querySelector("#albumNameB") as HTMLDivElement;
let trackNameB = document.querySelector("#trackNameB") as HTMLDivElement;
let playPause = document.querySelector("#play-pause-button") as HTMLDivElement;
let playPauseICON = document.querySelector(
  "#play-pause-button > span"
) as HTMLSpanElement;

import { audioExts, videoExts } from "./fileExts.js";

let playingFileName = "";

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

audioPlayer.onload = () => {
  audioPlayer.play();
};

playPause.addEventListener("click", () => {
  paused = !paused;
  if (paused) audioPlayer.pause();
  else audioPlayer.play();
  classNamer();
});

videoPlayer.onload = () => {
  videoPlayer.play();
};

export function focus() {
  if (playing == PlayingType.Video) videoPlayer.focus();
}

function classNamer() {
  if (playing != PlayingType.NotPlaying && !paused)
    media.classList.add("playing");
  else media.classList.remove("playing");

  videoContainer.className = "";
  audioContainer.className = "";

  if (paused) {
    playPauseICON.innerText = " play_arrow ";
  } else {
    playPauseICON.innerText = " pause ";
  }

  if (playing == PlayingType.Audio) {
    audioContainer.className = "show";
  } else {
    audioPlayer.pause();
  }
  if (playing == PlayingType.Video) {
    videoContainer.className = "show";
  } else videoPlayer.pause();
}

export function playingText(fileName: string) {
  if (PlayingType.NotPlaying == playing) {
    infoText.innerText = `Playing Nothing`;
    return;
  }

  infoText.innerText = `Playing ${fileName}`;
}

function initAudioPlayer() {
  window.jsmediatags.read(audioPlayer.src, {
    onSuccess: function (result) {
      console.log(result);
      function picturing() {
        if (!result.tags.picture) return;

        const data = result.tags.picture?.data;
        const format = result.tags.picture?.format;
        let base64String = "";
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }
        base64String = `data:${format};base64,${window.btoa(base64String)}`;
        (document.querySelector("#album-art-img") as HTMLImageElement).src =
          base64String;
        (
          document.querySelector("#bg-artwork") as HTMLDivElement
        ).style.backgroundImage = `url(${base64String})`;
      }
      function naming() {
        if (!result.tags.title) return;
        audioName.innerText = result.tags.title;
        audioNameB.innerText = result.tags.title;
      }
      function tracking() {
        if (!result.tags.artist) return;
        trackName.innerText = result.tags.artist;
        trackNameB.innerText = result.tags.artist;
      }

      picturing();
      naming();
      tracking();
    },
    onError: function (error) {
      console.log(error);
      let base64String = "/images/musicNote.jpg";
      (document.querySelector("#album-art-img") as HTMLImageElement).src =
        base64String;
      (
        document.querySelector("#bg-artwork") as HTMLDivElement
      ).style.backgroundImage = `url(${base64String})`;
      trackName.innerText = "Unknown track";
      trackNameB.innerText = trackName.innerText;
      audioName.innerText = playingFileName;
      audioNameB.innerText = playingFileName;
    },
  });
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
      playingFileName = fileName;
      initAudioPlayer();
    }
    if (videoExts.includes(ext)) {
      playing = PlayingType.Video;
      paused = false;
      playingFileName = fileName;
    }
  }

  playingText(fileName);
  classNamer();
}

classNamer();
setTimeout(() => {
  play(
    "/Users/dev",
    "/Downloads/",
    "18 MacCunn The Lay of the Last Minstrel - Part 2 Final chorus O Caledonia! stern and wild.mp3"
  );
}, 100);
